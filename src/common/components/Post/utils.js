export function showPageOrNotFound({user, post, page, statusManager, userStatusManager}) {

    const isAdmin = user && user[userStatusManager._status_isFeatured];
    const isAuthor = ((user?._id && user?._id === post?._author) || (user?._id && user?._id === post?._author?._id));
    const isAdminOrAuthor = (isAdmin || isAuthor);
    const isNotDeleted = post && post[statusManager._status_isNotDeleted];
    const isBanned = post && post[statusManager._status_isBanned];
    const postId = post?._id;
    const authorIsNotDeleted = post && post[statusManager._author_status_isNotDeleted];

    if (isBanned && !isAdmin){
        return false;
    }

    if (!authorIsNotDeleted && !isAdmin && page !== "new"){
        return false;
    }

    return !!((isNotDeleted && postId) || (!isNotDeleted && isAdminOrAuthor && postId) || (user?._id && user[userStatusManager._status_isNotDeleted] && page === "new"));

}

export function defaultGetPageName({user, post, page, statusManager, userStatusManager}) {

    const show = showPageOrNotFound({user, post, page, statusManager, userStatusManager});

    if (!show) {
        return null;
    }

    const isAdmin = user && user[userStatusManager._status_isFeatured];
    const isAuthor = ((user?._id && user?._id === post?._author) || (user?._id && user?._id === post?._author?._id));
    const isAdminOrAuthor = (isAdmin || isAuthor);
    const isFeatured = post && post[statusManager._status_isFeatured];
    const postId = post?._id;

    function renderWithUser() {
        switch (page) {
            case "new":
                return "new";
            case "edit":
                return (isAdminOrAuthor && postId && !isFeatured) ? "edit" : null;
            default:
                return (postId) ? "content" : null;
        }
    }

    function renderWithoutUser() {
        switch (page) {
            case "new":
                return null;
            case "edit":
                return null;
            default:
                return "content";
        }
    }

    return (!user) ? renderWithoutUser() : renderWithUser();

}
