import wapplrClient from "wapplr";
import wapplrPwa from "wapplr-pwa";
import wapplrReact from "wapplr-react";
import wapplrGraphql from "wapplr-graphql";
import wapplrAuthentication from "wapplr-authentication";
import wapplrPostTypes from "wapplr-posttypes";

import setContents from "../common/setContents";

import {getConfig as getCommonConfig} from "../common/config";

import initUser from "./postTypes/user";
import initPost from "./postTypes/post";
import initDocument from "./postTypes/document";

export function getConfig(p = {}) {

    const {config = {}} = p;

    const clientConfig = config.client || {};
    const commonConfig = getCommonConfig(p).config;

    const common = {...commonConfig.common};

    const client = {
        ...clientConfig,
        disableUseDefaultMiddlewares: true
    };

    return {
        config: {
            ...config,
            common: common,
            client: client,
        },
    }

}

export default async function createClient(p) {
    const {config} = getConfig(p);
    const wapp = p.wapp || wapplrClient({...p, config});

    await wapplrPwa({wapp});

    wapplrPostTypes({wapp});
    wapplrAuthentication({wapp});
    wapplrGraphql({wapp});
    wapplrReact({wapp});
    setContents({wapp});

    initUser({wapp});
    initPost({wapp});
    initDocument({wapp});

    return wapp;
}

export async function createMiddleware(p = {}) {
    // eslint-disable-next-line no-unused-vars
    const wapp = p.wapp || await createClient(p);
    return [
        function wapplrComMiddleware(req, res, next) {
            next()
        }
    ]

}

const defaultConfig = {
    config: {
        globals: {
            DEV: (typeof DEV !== "undefined") ? DEV : undefined,
            WAPP: (typeof WAPP !== "undefined") ? WAPP : undefined,
            RUN: (typeof RUN !== "undefined") ? RUN : undefined,
            TYPE: (typeof TYPE !== "undefined") ? TYPE : undefined,
            ROOT: (typeof ROOT !== "undefined") ? ROOT : "/"
        }
    }
};

export async function run(p = defaultConfig) {

    const {config} = getConfig(p);
    const wapp = await createClient({...p, config });
    const globals = wapp.globals;
    const {DEV} = globals;

    const app = wapp.client.app;

    app.use(wapp.client.middlewares.wapp);

    app.use(await createMiddleware({wapp, ...p}));

    app.use([
        ...Object.keys(wapp.client.middlewares).map(function (key){
            return (key === "wapp") ? function next(req, res, next) { return next(); } : wapp.client.middlewares[key];
        })
    ]);

    wapp.client.listen();

    if (typeof DEV !== "undefined" && DEV && module.hot){
        app.hot = module.hot;
        module.hot.accept();
    }

    return wapp;
}

if (typeof RUN !== "undefined" && RUN === "wapplr-com") {
    run();
}
