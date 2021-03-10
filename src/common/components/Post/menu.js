import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import FeaturedForm from "./FeaturedForm";
import RemoveFeaturedForm from "./RemoveFeaturedForm";

export function getMenuProps({appContext, menuActions, dialog, utils, name, post, parentRoute, redirects= {}}) {
    return {
        appContext,
        onDelete: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogDeleteEntryTitle,
                dialogContent: appContext.messages.deleteEntryQuestion,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.deleteText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Delete", args: {_id: post?._id}, redirect: redirects.onDeleteSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.deleteEntrySuccess
            })
        },
        onBan: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogBanEntryTitle,
                dialogContent: appContext.messages.banEntryQuestion,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.banText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Ban", args: {_id: post?._id}, redirect: redirects.onBanSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.banEntrySuccess,
            })
        },
        onApprove: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogApproveEntryTitle,
                dialogContent: appContext.messages.approveEntryQuestion,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.approveText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Approve", args: {_id: post?._id}, redirect: redirects.onApproveSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.approveEntrySuccess,
            })
        },
        onFeatured: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogMarkFeaturedEntryTitle,
                dialogContent: appContext.messages.markFeaturedEntryQuestion,
                Form: FeaturedForm,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.markText,
                onSubmit: async function (e, formData) {
                    return await utils.sendRequest({requestName: name+"Featured", args: formData, redirect: redirects.onFeaturedSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.markFeaturedEntrySuccess,
            })
        },
        onRemoveFeatured: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogRemoveMarkFeaturedEntryTitle,
                dialogContent: appContext.messages.removeMarkFeaturedEntryQuestion,
                Form: RemoveFeaturedForm,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.removeMarkText,
                onSubmit: async function (e, formData) {
                    return await utils.sendRequest({requestName: name+"RemoveFeatured", args: formData, redirect: redirects.onRemoveFeaturedSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.removeMarkFeaturedEntrySuccess
            })
        }
    };
}

function getMenu(props = {}) {

    const {appContext} = props;
    const {menus} = appContext;

    return [
        {
            name: menus.editMenu,
            href: function (p) {
                return (props.getEditHref) ? props.getEditHref(p) : (p?.post?._id) ? "/" + p.post._id + "/edit" : "/";
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isAuthor = ((p?.user?._id && p?.user?._id === p?.post?._author) || (p?.user?._id && p?.user?._id === p?.post?._author?._id));
                const isBanned = p?.post?._status_isBanned;
                const isFeatured = p?.post?._status_isFeatured;

                if ((isBanned && !isAdmin) || isFeatured){
                    return false;
                }

                if (isAdmin || isAuthor) {
                    return !!(p?.post?._id && p.page !== "edit" && p.page !== "new");
                }
                return false;
            },
            Icon: EditIcon,
            featured: true
        },
        {
            name: menus.deleteMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onDelete){
                    props.onDelete(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isAuthor = ((p?.user?._id && p?.user?._id === p?.post?._author) || (p?.user?._id && p?.user?._id === p?.post?._author?._id));
                const isBanned = p?.post?._status_isBanned;
                const isFeatured = p?.post?._status_isFeatured;

                if ((isBanned && !isAdmin) || isFeatured){
                    return false;
                }

                if (isAdmin || isAuthor) {
                    const isNotDeleted = p?.post?._status_isNotDeleted;
                    return !!(p?.post?._id && isNotDeleted && p.page !== "new");
                }

                return false;
            },
            Icon: DeleteIcon,
            featured: true
        },
        {
            name: menus.banMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onBan){
                    props.onBan(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isBanned = p?.post?._status_isBanned;
                const isFeatured = p?.post?._status_isFeatured;

                if (isBanned || isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p?.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: BlockIcon,
        },
        {
            name: menus.approveMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onApprove){
                    props.onApprove(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isValidated = p?.post?._status_isValidated;
                const isApproved = p?.post?._status_isApproved;
                const isFeatured = p?.post?._status_isFeatured;

                if (!isValidated || isApproved || isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p?.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: CheckCircleIcon,
        },
        {
            name: menus.featuredMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onFeatured){
                    props.onFeatured(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isApproved = p?.post?._status_isApproved;
                const isFeatured = p?.post?._status_isFeatured;

                if (!isApproved || isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p?.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: StarIcon,
        },
        {
            name: menus.removeFeaturedMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onRemoveFeatured){
                    props.onRemoveFeatured(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isFeatured = p?.post?._status_isFeatured;

                if (!isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p?.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: StarBorderIcon,
        },
    ];
}

export default getMenu;
