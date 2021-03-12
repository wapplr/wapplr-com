import getDefaultStatusManager from "wapplr-posttypes/dist/common/getStatusManager";

export default function getStatusManager(p = {}) {
    return getDefaultStatusManager({
        ...p
    })
}
