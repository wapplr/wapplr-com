import getDefaultStatusManager from "./index";

export default function getStatusManager(p = {}) {
    return getDefaultStatusManager({
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

