export function getConfig(p = {}) {

    const {config = {}} = p;

    const commonConfig = config.common || {};

    const common = {
        ...commonConfig,
        siteName: "Wapplr.com",
        description: "Wapplr.com is a website for introducing Wapplr and even an example for how to use it.",
        graphql: {
            route: "/graphql"
        }
    }

    return {
        config: {
            ...config,
            common: common
        },
    }
}
