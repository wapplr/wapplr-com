import wapplrServer from "wapplr";
import wapplrMongo from "wapplr-mongo";
import wapplrPostTypes from "wapplr-posttypes";
import wapplrAuthentication from "wapplr-authentication";
import wapplrGraphql, {createMiddleware as createWapplrGraphqlMiddleware} from "wapplr-graphql";
import wapplrReact from "wapplr-react";

import Head from "./components/Head";
import setContents from "../common/setContents";
import routes from "../common/config/constants/routes";
import {getConfig as getCommonConfig} from "../common/config";
import favicon from "./images/icon_192x192.png";

import bodyParser from "body-parser";
import nodeFetch from "node-fetch";
import url from "url";

export function getConfig(p = {}) {

    const {config = {}} = p;

    const serverConfig = config.server || {};
    const commonConfig = getCommonConfig(p).config;

    const common = {...commonConfig.common}

    const server = {
        ...serverConfig,
        icon: favicon,
        disableUseDefaultMiddlewares: true,
        database: {
            mongoConnectionString: "mongodb://localhost/wapplr-com",
        }
    }

    return {
        config: {
            ...config,
            common: common,
            server: server,
        },
    }
}

export default async function createServer(p = {}) {

    const {config} = getConfig(p);
    const wapp = p.wapp || wapplrServer({...p, config});

    wapp.requests.requestManager.fetch = async function (urlString, options) {
        const absoluteUrl = (!url.parse(urlString).hostname) ?
            wapp.request.protocol + "//" + wapp.request.hostname + urlString :
            urlString;

        return await nodeFetch(absoluteUrl, options);
    };

    wapplrMongo({wapp});
    wapplrPostTypes({wapp});
    wapplrAuthentication({wapp});
    wapplrReact({wapp});

    const titlePattern = /^.{1,250}$/;
    const contentPattern = /^.{1,2500}$/;
    const contentBriefPattern = /^.{1,500}$/;

    await wapp.server.postTypes.getPostType({
        name: "post",
        addIfThereIsNot: true,
        config: {
            schemaFields: {
                title: {
                    type: String,
                    wapplr: {
                        pattern: titlePattern,
                        required: true
                    }
                },
                subtitle: {
                    type: String,
                    wapplr: {
                        pattern: titlePattern,
                    }
                },
                content: {
                    type: String,
                    wapplr: {
                        pattern: contentPattern,
                        required: true
                    }
                },
                contentBrief: {
                    type: String,
                    wapplr: {
                        pattern: contentBriefPattern,
                    }
                },
            },
            requiredDataForStatus: {
                title: { type: String },
                content: { type: String },
            },
        }
    })

    const authSettings = {
        name: "user",
        addIfThereIsNot: true,
        admin: {
            name: {
                first: "Admin"
            },
            email: "admin@wapplr.com",
            password: "123456Ab"
        },
        config: {
            disableUseSessionMiddleware: true,
            mailer: {
                send: async function(type, data, input) {
                    const {req} = input;
                    if (type === "forgotPassword") {
                        const hostname = req.wappRequest.hostname;
                        const protocol = req.wappRequest.protocol;
                        const resetPasswordRoute = routes.accountRoute + "/resetpassword";
                        const user = data;
                        const url = protocol + "://" + hostname + resetPasswordRoute + "/?hash=" + encodeURIComponent(user.passwordRecoveryKey) + "&email=" + encodeURIComponent(user.email) + ""
                        console.log(url);
                    }
                }
            }
        }
    }

    await wapp.server.authentications.getAuthentication(authSettings);
    //await wapp.server.authentications.getAuthentication({...authSettings, name:"author"});

    wapplrGraphql({wapp}).init();

    wapp.contents.addComponent({
        head: Head
    })

    setContents({wapp});

    return wapp;

}

export async function createMiddleware(p = {}) {

    const wapp = p.wapp || await createServer(p);
    return [
        function createFetch(req, res, next) {
            wapp.requests.requestManager.fetch = async function (urlString, options) {
                const absoluteUrl = (!url.parse(urlString).hostname) ?
                    req.wappRequest.protocol + "://" + req.wappRequest.hostname + urlString :
                    urlString;
                return await nodeFetch(absoluteUrl, options);
            };
            next();
        },
        ...wapp.server.session.getSessionMiddleware(),
        createWapplrGraphqlMiddleware({wapp, ...p}),
    ]

}

const defaultConfig = {
    config: {
        globals: {
            DEV: (typeof DEV !== "undefined") ? DEV : undefined,
            WAPP: (typeof WAPP !== "undefined") ? WAPP : undefined,
            RUN: (typeof RUN !== "undefined") ? RUN : undefined,
            TYPE: (typeof TYPE !== "undefined") ? TYPE : undefined,
            ROOT: (typeof ROOT !== "undefined") ? ROOT : __dirname
        }
    }
}

export async function run(p = defaultConfig) {

    const {config} = getConfig(p);
    const wapp = await createServer({...p, config});
    const globals = wapp.globals;
    const {DEV} = globals;

    const app = wapp.server.app;

    if (!wapp.server.initializedBodyParser){
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        Object.defineProperty(wapp.server, "initializedBodyParser", {
            enumerable: false,
            writable: false,
            configurable: false,
            value: true
        })
    }

    app.use([
        wapp.server.middlewares.wapp,
        wapp.server.middlewares.static,
    ]);

    app.use(await createMiddleware({wapp}));

    app.use([
        ...Object.keys(wapp.server.middlewares).map(function (key){
            return (key === "wapp" || key === "static") ? function next(req, res, next) { return next(); } : wapp.server.middlewares[key];
        })
    ]);

    wapp.server.listen();

    if (typeof DEV !== "undefined" && DEV && module.hot){
        app.hot = module.hot;
        module.hot.accept("./index");
    }

    return wapp;

}

if (typeof RUN !== "undefined" && RUN === "wapplr-com") {
    run();
}
