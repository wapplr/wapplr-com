export default function getStatus({user, post, page, appContext}) {

    const isNotDeleted = post?._status_isNotDeleted;
    const isBanned = post?._status_isBanned;
    const isValidated = post?._status_isValidated;
    const isApproved = post?._status_isApproved;
    const isFeatured = post?._status_isFeatured;
    const author = post?._author?._id || post?._author;
    const isAuthor = (user?._id && user?._id === author);
    const isAdmin = user?._status_isFeatured;
    const isAuthorOrAdmin = !!(isAuthor || isAdmin);
    const authorIsNotDeleted = post?._author_status_isNotDeleted;

    if (isAuthorOrAdmin && page !== "new"){

        const s = (isBanned && isAdmin) ?
            appContext.titles.statusBannedTitle :
                (!isNotDeleted) ?
                    appContext.titles.statusDeletedTitle :
                    (!isValidated) ?
                        appContext.titles.statusMissingDataTitle :
                        (isFeatured && isAdmin) ?
                            appContext.titles.statusFeaturedTitle :
                            (isApproved && isAdmin) ?
                                appContext.titles.statusApprovedTitle :
                                (isAdmin) ? appContext.titles.statusCreatedTitle : null;

        if (!authorIsNotDeleted && isAdmin && post._id !== author) {
            return s + " (" + appContext.titles.statusAuthorDeletedTitle + ")"
        }

        return s;

    }

    return null;
}
