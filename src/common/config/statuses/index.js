import getDefaultStatusManager from "wapplr-posttypes/dist/common/getStatusManager";
import getPostStatusManager from "./post";

export default function getStatusManager(p = {}) {
    return getDefaultStatusManager({
        ...p
    })
}

export const statusManagers = {
    post: getPostStatusManager
};
