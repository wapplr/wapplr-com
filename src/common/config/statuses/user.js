import getDefaultStatusManager from "./index";

export default function getStatusManager(p = {}) {
    return getDefaultStatusManager({
        ...p,
        config: {
            requiredDataForStatus: {
                name: {
                    first: { type: String },
                },
                email: { type: String },
                emailConfirmed: { type: Boolean, value: true },
            },
            ...(p.config) ? p.config : {}
        },
    })
}

