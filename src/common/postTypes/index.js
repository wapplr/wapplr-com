import getPostPostTypeConfig from "./post";
import getDocumentPostTypeConfig from "./document";
import getUserPostTypeConfig from "./user";

export const postTypesConfig = {
    post: getPostPostTypeConfig,
    document: getDocumentPostTypeConfig,
    user: getUserPostTypeConfig,
};

export function runPostTypesConfigSync({action, rKey, p = {}}) {
    const config = postTypesConfig;
    return Object.keys(config).map(function (key) {
        const postTypeConfig = config[key];
        if (postTypeConfig[action]){
            const r = postTypeConfig[action](p);
            return (rKey) ? r[rKey] : r;
        }
        return null;
    });
}

export async function runPostTypesConfig({action, rKey, p = {}}) {
    const config = postTypesConfig;
    return await Promise.all(
        Object.keys(config).map(async function (key) {
            const postType = config[key];
            if (postType[action]){
                const r = await postType[action](p);
                return (rKey) ? r[rKey] : r;
            }
            return null;
        })
    );
}
