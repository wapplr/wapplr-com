import wapplrServer from "wapplr";
import wapplrMongo from "wapplr-mongo";
import wapplrPostTypes from "wapplr-posttypes";
import wapplrAuthentication from "wapplr-authentication";
import wapplrGraphql, {createMiddleware as createWapplrGraphqlMiddleware} from "wapplr-graphql";
import wapplrReact from "wapplr-react";

import postType from "./postTypes/post";
import userType from "./postTypes/user";

import setContents from "../common/setContents";
import setHtml from "./setHtml";
import bodyParser from "body-parser";
import favicon from "./images/icon_192x192.png";

import {getConfig as getCommonConfig} from "../common/config";

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

    wapplrMongo({wapp});
    // eslint-disable-next-line no-unused-vars
    const db = await wapp.server.database.addDatabase();

    wapplrPostTypes({wapp});
    // eslint-disable-next-line no-unused-vars
    const post = await postType({wapp});

    wapplrAuthentication({wapp});
    // eslint-disable-next-line no-unused-vars
    const user = await userType({wapp});
    //console.log(user);

    wapplrGraphql({wapp}).init();

    wapplrReact({wapp});
    setContents({wapp});
    setHtml({wapp});

    return wapp;

}

export async function createMiddleware(p = {}) {

    const wapp = p.wapp || await createServer(p);
    return [
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
