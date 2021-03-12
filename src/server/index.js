import wapplrServer from "wapplr";
import wapplrMongo from "wapplr-mongo";
import wapplrPostTypes from "wapplr-posttypes";
import wapplrAuthentication from "wapplr-authentication";
import wapplrGraphql, {createMiddleware as createWapplrGraphqlMiddleware} from "wapplr-graphql";
import wapplrReact from "wapplr-react";

import bodyParser from "body-parser";
import nodeFetch from "node-fetch";
import {URL} from "url";
import fs from "fs";
import path from "path";
import crypto from "crypto";

import Head from "./components/Head";
import setContents from "../common/setContents";
import {getConfig as getCommonConfig} from "../common/config";
import favicon from "./images/icon_192x192.png";

import initUser from "./postTypes/user";
import initPost from "./postTypes/post";
import initDocument from "./postTypes/document";

export function getConfig(p = {}) {

    const {config = {}} = p;

    const serverConfig = config.server || {};
    const commonConfig = getCommonConfig(p).config;

    const common = {...commonConfig.common};
    const globals = {...commonConfig.globals};

    const server = {
        ...serverConfig,
        icon: favicon,
        disableUseDefaultMiddlewares: true,
        database: {
            mongoConnectionString: "mongodb://localhost/wapplr-com",
        }
    };

    const dirname = globals.ROOT || __dirname;
    const credentialsFolder = "secure/";

    if (
        !globals.DEV &&
        fs.existsSync(path.resolve(dirname, credentialsFolder, "wapplr.com.crt")) &&
        fs.existsSync(path.resolve(dirname, credentialsFolder, "wapplr.com.key"))
    ){
        server.credentials = {
            key: fs.readFileSync(path.resolve(dirname, credentialsFolder, "wapplr.com.key"), "utf8"),
            cert: fs.readFileSync(path.resolve(dirname, credentialsFolder, "wapplr.com.crt"), "utf8"),
        }
    }

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

    wapplrMongo({wapp});
    wapplrPostTypes({wapp});
    wapplrAuthentication({wapp});
    wapplrReact({wapp});

    await initUser({wapp});
    await initPost({wapp});
    await initDocument({wapp});

    wapplrGraphql({wapp}).init();

    wapp.contents.addComponent({
        head: Head
    });

    setContents({wapp});

    return wapp;

}

export async function createMiddleware(p = {}) {

    const wapp = p.wapp || await createServer(p);

    return [
        function createFetch(req, res, next) {

            wapp.requests.requestManager.fetch = async function fetch(urlString, options) {
                let hostname = "";
                try {
                    hostname = new URL(urlString).hostname
                } catch (e){}

                const absoluteUrl = (!hostname) ?
                    req.wappRequest.protocol + "://" + req.wappRequest.hostname + urlString :
                    urlString;

                return await nodeFetch(absoluteUrl, {...options});
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
};

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
