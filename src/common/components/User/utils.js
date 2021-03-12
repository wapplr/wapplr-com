import {defaultGetPageName, showPageOrNotFound} from "../Post/utils";

export function getPageName({user, post, page, statusManager, userStatusManager}) {

    const show = showPageOrNotFound({user, post, page, statusManager, userStatusManager});

    if (!show){
        return null;
    }

    if (page === "posts"){
        return "posts"
    }

    if (page === "documents"){
        return "documents"
    }

    return defaultGetPageName({user, post, page, statusManager, userStatusManager});
}
