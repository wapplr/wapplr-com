import defaultPostTypeConfig from "../post";

const postTypeConfig = {
    getStatusManager: function getStatusManager(p = {}) {
        return defaultPostTypeConfig.getStatusManager({
            ...p,
            config: {
                requiredDataForStatus: {
                    title: { type: String },
                    content: { type: String },
                },
                ...(p.config) ? p.config : {}
            },
        })
    },
    getConstants: function getConstants(p = {}) {
        return defaultPostTypeConfig.getConstants({
            ...p,
            name:"document"
        })
    },
    setContents: function setContents(p = {}) {
        return defaultPostTypeConfig.setContents({
            ...p,
            name:"document"
        })
    },
    requestForUserPage: async function requestForUserPage(p = {}) {
        return await defaultPostTypeConfig.requestForUserPage({
            ...p,
            name:"document"
        })
    }
};

export default postTypeConfig;
