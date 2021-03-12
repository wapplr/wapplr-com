import defaultPostTypeConfig from "../post";

export default function getStatusManager(p = {}) {
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
}
