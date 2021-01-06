import wapplrClient from "wapplr";
import wapplrPwa from "wapplr-pwa";
import wapplrReact, {createMiddleware as createWapplrReactMiddleware} from "wapplr-react";

import setContents from "../common/setContents";

import {getConfig as getCommonConfig} from "../common/config";

export function getConfig(p = {}) {

    const {config = {}} = p;

    const clientConfig = config.client || {};
    const commonConfig = getCommonConfig(p).config;

    const common = {...commonConfig.common}

    const client = {
        ...clientConfig,
        disableUseDefaultMiddlewares: true
    }

    return {
        config: {
            ...config,
            common: common,
            client: client,
        },
    }

}

export default function createClient(p) {
    const {config} = getConfig(p);
    const wapp = p.wapp || wapplrClient({...p, config});
    wapplrPwa({wapp, ...p, config});
    wapplrReact({wapp, ...p});
    setContents({wapp, ...p});
    return wapp;
}

export function createMiddleware(p = {}) {

    // eslint-disable-next-line no-unused-vars
    const {config} = getConfig(p);
    const wapp = p.wapp || createClient(p);

    const middlewares = [
        function wapplrComMiddleware(req, res, next) {
            createWapplrReactMiddleware({wapp})
            return next();
        }
    ]

    return function(req, res, out) {

        let index = 0;

        function next(err) {

            if (middlewares[index]){
                const func = middlewares[index];
                index = index + 1;
                return func(req, res, (err) ? function(){next(err)} : next)
            } else if (typeof out === "function") {
                index = 0;
                return out(err);
            }

            return null;
        }

        return next();

    }

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
}

export function run(p = defaultConfig) {

    const {config} = getConfig(p);
    const wapp = createClient({...p, config });
    const globals = wapp.globals;
    const {DEV} = globals;

    const app = wapp.client.app;

    app.use([
        wapp.client.middlewares.wapp,
        createMiddleware({wapp, ...p}),
        ...Object.keys(wapp.client.middlewares).map(function (key){
            return (key === "wapp") ? function next(req, res, next) { return next(); } : wapp.client.middlewares[key];
        })
    ]);

    wapp.client.listen();

    if (typeof DEV !== "undefined" && DEV && module.hot){
        app.hot = module.hot;
        module.hot.accept("./index");
    }

    return wapp;
}

if (typeof RUN !== "undefined" && RUN === "wapplr-com") {
    run();
}
