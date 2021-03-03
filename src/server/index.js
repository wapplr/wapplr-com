import wapplrServer from "wapplr";
import wapplrMongo from "wapplr-mongo";
import wapplrPostTypes from "wapplr-posttypes";
import wapplrAuthentication from "wapplr-authentication";
import wapplrGraphql, {createMiddleware as createWapplrGraphqlMiddleware} from "wapplr-graphql";
import wapplrReact from "wapplr-react";

import Head from "./components/Head";
import setContents from "../common/setContents";
import routes from "../common/config/constants/routes";
import labels from "../common/config/constants/labels";
import messages from "../common/config/constants/messages";
import {getConfig as getCommonConfig} from "../common/config";
import favicon from "./images/icon_192x192.png";

import bodyParser from "body-parser";
import nodeFetch from "node-fetch";
import url from "url";

import getDefaultStatusManager from "../common/config/statuses";
import getPostStatusManager from "../common/config/statuses/post";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export function getConfig(p = {}) {

    const {config = {}} = p;

    const serverConfig = config.server || {};
    const commonConfig = getCommonConfig(p).config;

    const common = {...commonConfig.common}
    const globals = {...commonConfig.globals};

    const server = {
        ...serverConfig,
        icon: favicon,
        disableUseDefaultMiddlewares: true,
        database: {
            mongoConnectionString: "mongodb://localhost/wapplr-com",
        }
    }

    const dirname = globals.ROOT || __dirname;
    const credentialsFolder = "secure/";

    let secret = null;

    try {
        if (fs.existsSync(path.resolve(dirname, credentialsFolder, "secret.json"))){
            secret = JSON.parse(fs.readFileSync(path.resolve(dirname, credentialsFolder, "secret.json"), "utf8"));
        } else {
            const newSecretJson = {
                masterCode: Math.random().toString(36).substr(2, 8),
                cookieSecret: crypto.randomBytes(256).toString('hex'),
                adminPassword: Math.random().toString(36).substr(2, 8)
            };
            fs.writeFileSync(path.resolve(dirname, credentialsFolder, "secret.json"), JSON.stringify(newSecretJson, null, "    "));
            secret = JSON.parse(fs.readFileSync(path.resolve(dirname, credentialsFolder, "secret.json"), "utf8"));
        }
    } catch (e) {
        console.log(e)
    }

    if (secret){
        server.masterCode = secret.masterCode;
        server.cookieSecret = secret.cookieSecret;
        server.adminPassword = secret.adminPassword;
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

    const authSettings = {
        name: "user",
        addIfThereIsNot: true,
        admin: {
            name: {
                first: "Admin"
            },
            email: "admin@wapplr.com",
            password: config.server.adminPassword
        },
        statusManager: getDefaultStatusManager(),
        config: {
            cookieSecret: config.server.cookieSecret,
            masterCode: config.server.masterCode,
            disableUseSessionMiddleware: true,
            mailer: {
                send: async function(type, data, input) {
                    const {req} = input;

                    const hostname = req.wappRequest.hostname;
                    const protocol = req.wappRequest.protocol;

                    if (type === "signup"){
                        const emailConfirmationRoute = routes.accountRoute + "/emailconfirmation";
                        const user = data;
                        const url = protocol + "://" + hostname + emailConfirmationRoute + "/?hash=" + encodeURIComponent(user.emailConfirmationKey) + "&email=" + encodeURIComponent(user.email) + ""
                        console.log(url);
                    }
                    if (type === "forgotPassword") {
                        const resetPasswordRoute = routes.accountRoute + "/resetpassword";
                        const user = data;
                        const url = protocol + "://" + hostname + resetPasswordRoute + "/?hash=" + encodeURIComponent(user.passwordRecoveryKey) + "&email=" + encodeURIComponent(user.email) + ""
                        console.log(url);
                    }
                    if (type === "emailConfirmation"){
                        const emailConfirmationRoute = routes.accountRoute + "/emailconfirmation";
                        const user = data;
                        const url = protocol + "://" + hostname + emailConfirmationRoute + "/?hash=" + encodeURIComponent(user.emailConfirmationKey) + "&email=" + encodeURIComponent(user.email) + ""
                        console.log(url);
                    }
                }
            },
        }
    }

    await wapp.server.authentications.getAuthentication(authSettings);

    const titlePattern = /^.{1,250}$/;
    const contentPattern = /^.{1,20000}$/m;

    await wapp.server.postTypes.getPostType({
        name: "post",
        addIfThereIsNot: true,
        statusManager: getPostStatusManager(),
        config: {
            masterCode: config.server.masterCode,
            schemaFields: {
                title: {
                    type: String,
                    wapplr: {
                        pattern: titlePattern,
                        validationMessage: messages.validationPostTitle,
                        formData: {
                            label: labels.postTitleLabel
                        }
                    }
                },
                subtitle: {
                    type: String,
                    wapplr: {
                        pattern: titlePattern,
                        validationMessage: messages.validationPostSubtitle,
                        formData: {
                            label: labels.postSubtitleLabel
                        }

                    }
                },
                content: {
                    type: String,
                    wapplr: {
                        pattern: contentPattern,
                        validationMessage: messages.validationPostContent,
                        required: true,
                        formData: {
                            label: labels.postContentLabel,
                            multiline: true,
                            rows: 4,
                            rowsMin: 4,
                            rowsMax: 20,
                        }
                    }
                }
            },
            setSchemaMiddleware: function ({schema}) {

                schema.virtualToGraphQl({
                    name: "content_extract",
                    get: function () {
                        return this.content.replace(/\r?\n|\r/g, " ").replace(/#/g, " ").trim().replace(/ +(?= )/g," - ").replace(/ +(?= )/g,"").slice(0,250)+"..."
                    },
                    options: {
                        instance: "String"
                    }
                })

            }
        }
    })

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

    const {env} = process;
    env.NODE_ENV = process.env.NODE_ENV;

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
