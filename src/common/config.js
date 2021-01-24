export function getConfig(p = {}) {

    const {config = {}} = p;

    const commonConfig = config.common || {};
    const globalsConfig = config.globals || {}

    const {WAPP, DEV} = globalsConfig;

    const common = {
        ...commonConfig,
        siteName: "Wapplr.com",
        description: "Wapplr.com is a website for introducing Wapplr and even an example for how to use it.",
        footerMenu: [
            {name: "HOME", href:"/"},
            {name: "GETTING STARTED", href:"/installing"},
            {name: "API REFERENCE", href:"/api"},
            {name: "GITHUB", href:"https://github.com/wapplr/wapplr", target:"_blank"}
        ],
        graphql: {
            route: (DEV) ? "/graphql" : "/g" + WAPP
        }
    }

    return {
        config: {
            ...config,
            common: common
        },
    }
}
