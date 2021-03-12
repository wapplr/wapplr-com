export default function getStatus({user, post, appContext, statusManager}) {

    const {userStatusManager, titles} = appContext;

    const isNotDeleted = post && post[statusManager._status_isNotDeleted];
    const isBanned = post && post[statusManager._status_isBanned];
    const isValidated = post && post[statusManager._status_isValidated];
    const isApproved = post && post[statusManager._status_isApproved];
    const isFeatured = post && post[statusManager._status_isFeatured];
    const author = post?._author?._id || post?._author;
    const isAuthor = (user?._id && user?._id === author);
    const isAdmin = user && user[userStatusManager._status_isFeatured];
    const isAuthorOrAdmin = !!(isAuthor || isAdmin);
    const authorIsNotDeleted = post[statusManager._author_status_isNotDeleted];

    if (isAuthorOrAdmin){

        const s = (isBanned && isAdmin) ?
            titles.statusBannedTitle :
            (!isNotDeleted) ?
                titles.statusDeletedTitle :
                (!isValidated) ?
                    titles.statusMissingDataTitle :
                    (isFeatured && isAdmin) ?
                        titles.statusFeaturedTitle :
                        (isApproved && isAdmin) ?
                            titles.statusApprovedTitle :
                            (isAdmin) ? titles.statusCreatedTitle : null;

        return ((!authorIsNotDeleted && isAdmin && post._id !== author)) ? s + " (" + titles.statusAuthorDeletedTitle + ")" : s;

    }

    return null;
}
