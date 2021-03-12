import React from "react";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";

import FeaturedForm from "./Forms/FeaturedForm";
import RemoveFeaturedForm from "./Forms/RemoveFeaturedForm";

export function getMenuProps({appContext, menuActions, dialog, utils, name, post, parentRoute, redirects= {}}) {

    const {titles, labels, messages} = appContext;

    return {
        appContext,
        onDelete: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: titles.dialogDeleteEntryTitle,
                dialogContent: messages.deleteEntryQuestion,
                cancelText: labels.cancelText,
                submitText: labels.deleteText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Delete", args: {_id: post?._id}, redirect: redirects.onDeleteSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: messages.deleteEntrySuccess
            })
        },
        onBan: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: titles.dialogBanEntryTitle,
                dialogContent: messages.banEntryQuestion,
                cancelText: labels.cancelText,
                submitText: labels.banText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Ban", args: {_id: post?._id}, redirect: redirects.onBanSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: messages.banEntrySuccess,
            })
        },
        onApprove: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: titles.dialogApproveEntryTitle,
                dialogContent: messages.approveEntryQuestion,
                cancelText: labels.cancelText,
                submitText: labels.approveText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Approve", args: {_id: post?._id}, redirect: redirects.onApproveSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: messages.approveEntrySuccess,
            })
        },
        onFeatured: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: titles.dialogMarkFeaturedEntryTitle,
                dialogContent: messages.markFeaturedEntryQuestion,
                Form: (props) => <FeaturedForm {...props} name={name} post={post} />,
                cancelText: labels.cancelText,
                submitText: labels.markText,
                onSubmit: async function (e, formData) {
                    return await utils.sendRequest({requestName: name+"Featured", args: formData, redirect: redirects.onFeaturedSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: messages.markFeaturedEntrySuccess,
            })
        },
        onRemoveFeatured: function () {
            menuActions?.actions.close();
            dialog.actions.open({
                dialogTitle: titles.dialogRemoveMarkFeaturedEntryTitle,
                dialogContent: messages.removeMarkFeaturedEntryQuestion,
                Form: (props) => <RemoveFeaturedForm {...props} name={name} post={post} />,
                cancelText: labels.cancelText,
                submitText: labels.removeMarkText,
                onSubmit: async function (e, formData) {
                    return await utils.sendRequest({requestName: name+"RemoveFeatured", args: formData, redirect: redirects.onRemoveFeaturedSuccess || {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: messages.removeMarkFeaturedEntrySuccess
            })
        }
    };
}

function getMenu(props = {}) {

    const {appContext, statusManager} = props;
    const {menus, userStatusManager} = appContext;

    return [
        {
            name: menus.editMenu,
            href: function (p) {
                return (props.getEditHref) ? props.getEditHref(p) : (p.post?._id) ? "/" + p.post._id + "/edit" : "/";
            },
            role: function (p) {
                const isAdmin = p.user && p.user[userStatusManager._status_isFeatured];
                const isAuthor = ((p.user?._id && p.user?._id === p.post?._author) || (p.user?._id && p.user?._id === p.post?._author?._id));
                const isBanned = p.post && p.post[statusManager._status_isBanned];
                const isFeatured = p.post && p.post[statusManager._status_isFeatured];

                if ((isBanned && !isAdmin) || isFeatured){
                    return false;
                }

                if (isAdmin || isAuthor) {
                    return !!(p.post?._id && p.page !== "edit" && p.page !== "new");
                }
                return false;
            },
            Icon: EditIcon,
            featured: true
        },
        {
            name: menus.deleteMenu,
            href: function (p) {
                return (p.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onDelete){
                    props.onDelete(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p.user && p.user[userStatusManager._status_isFeatured];
                const isAuthor = ((p.user?._id && p.user?._id === p.post?._author) || (p.user?._id && p.user?._id === p.post?._author?._id));
                const isBanned = p.post && p.post[statusManager._status_isBanned];
                const isFeatured = p.post && p.post[statusManager._status_isFeatured];

                if ((isBanned && !isAdmin) || isFeatured){
                    return false;
                }

                if (isAdmin || isAuthor) {
                    const isNotDeleted = p.post && p.post[statusManager._status_isNotDeleted];
                    return !!(p.post?._id && isNotDeleted && p.page !== "new");
                }

                return false;
            },
            Icon: DeleteIcon,
            featured: true
        },
        {
            name: menus.banMenu,
            href: function (p) {
                return (p.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onBan){
                    props.onBan(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p.user && p.user[userStatusManager._status_isFeatured];
                const isBanned = p.post && p.post[statusManager._status_isBanned];
                const isFeatured = p.post && p.post[statusManager._status_isFeatured];

                if (isBanned || isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: BlockIcon,
        },
        {
            name: menus.approveMenu,
            href: function (p) {
                return (p.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onApprove){
                    props.onApprove(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p.user && p.user[userStatusManager._status_isFeatured];
                const isValidated = p.post && p.post[statusManager._status_isValidated];
                const isApproved = p.post && p.post[statusManager._status_isApproved];
                const isFeatured = p.post && p.post[statusManager._status_isFeatured];

                if (!isValidated || isApproved || isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: CheckCircleIcon,
        },
        {
            name: menus.featuredMenu,
            href: function (p) {
                return (p.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onFeatured){
                    props.onFeatured(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p.user && p.user[userStatusManager._status_isFeatured];
                const isApproved = p.post && p.post[statusManager._status_isApproved];
                const isFeatured = p.post && p.post[statusManager._status_isFeatured];

                if (!isApproved || isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: StarIcon,
        },
        {
            name: menus.removeFeaturedMenu,
            href: function (p) {
                return (p.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onRemoveFeatured){
                    props.onRemoveFeatured(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p.user && p.user[userStatusManager._status_isFeatured];
                const isFeatured = p.post && p.post[statusManager._status_isFeatured];

                if (!isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: StarBorderIcon,
        },
    ];
}

export default getMenu;
