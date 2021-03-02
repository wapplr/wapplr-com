import React, {useContext, useEffect, useState} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";

import {withMaterialStyles} from "../Template/withMaterial";
import Dialog from "../Dialog";
import Menu from "../Menu";
import NotFound from "../NotFound";

import AppContext from "../App/context";

import style from "./style.css";
import materialStyle from "./materialStyle";

import PostContext from "./context";

import New from "./New";
import Edit from "./Edit";
import Content from "./Content";
import getMenu from "./menu";
import Form from "../Form";

const pages = {
    content: Content,
    new: New,
    edit: Edit,
}

function router({user, post, page}) {

    const isAdmin = user?._status_isFeatured;
    const isAuthor = user?._id === post?._author;
    const isAdminOrAuthor = (isAdmin || isAuthor);
    const isNotDeleted = post?._status_isNotDeleted;
    const isBanned = post?._status_isBanned;
    const isFeatured = post?._status_isFeatured;
    const postId = post?._id;

    if (isBanned && !isAdmin){
        return null;
    }

    const show = !!((isNotDeleted && postId) || (!isNotDeleted && isAdminOrAuthor && postId));

    if (!show) {
        return null
    }

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

function Router(props) {

    const postContext = useContext(PostContext);
    const {user, post} = postContext;
    const {page} = props;

    const pageName = router({user, post, page})
    const Page = (pageName) ? pages[pageName] : null;

    return (Page) ? <Page /> : null;
}

function RemoveFeaturedForm(props) {

    const {
        onSubmit,
        setFormRef
    } = props;

    const postContext = useContext(PostContext);
    // eslint-disable-next-line no-unused-vars
    const {name, user, post, parentRoute} = postContext;

    const context = useContext(WappContext);
    const {wapp} = context;
    const utils = getUtils(context);

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"RemoveFeatured"].formData;
    } catch (e){
        console.log(e)
    }

    const formData = {
        ...formDataFromResolvers,
    }

    delete formData.submit;

    if (post?._id){
        formData._id.value = post._id;
        formData._id.disabled = true;
    }

    return (
        <div className={style.edit}>
            <Form
                ref={function (e) {
                    setFormRef.current = e;
                }}
                formData={formData}
                onSubmit={onSubmit}
            />
        </div>
    )
}

function Post(props) {

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);

    const {
        parentRoute = appContext.routes.postRoute,
        // eslint-disable-next-line no-unused-vars
        url,
        name = "post"
    } = props;

    const utils = getUtils(context);
    const {subscribe, materialStyle} = props;

    // eslint-disable-next-line no-unused-vars
    const {wapp, req, res} = context;

    wapp.styles.use(style);

    const page = (res.wappResponse.route.path === appContext.routes.postRoute+"/new") ? "new" : res.wappResponse.route.params.page;

    const [user, setUser] = useState(utils.getRequestUser());
    const [post, setPost] = useState((page === "new") ? null : utils.getGlobalState().res.responses?.postFindById);

    function onUserChange(user){
        setUser((user?._id) ? user : null);
    }

    function onRequestResolved({value}) {
        const keys = [name+"New", name+"Save", name+"Delete", name+"Approve", name+"Featured", name+"RemoveFeatured", name+"Ban", name+"FindById"];
        const response = value;
        let foundEnabledKeys = false;
        keys.forEach(function (requestName) {
            if (!foundEnabledKeys && response && response[requestName]){
                foundEnabledKeys = true;
                if (requestName !== name+"FindById" && typeof response[requestName].record !== "undefined" && !response[requestName].error){
                    res.wappResponse.store.dispatch(wapp.states.stateManager.actions.res({
                        type: "INS_RES",
                        name: "responses",
                        value: {[name+"FindById"]: response[requestName].record}
                    }));
                    res.wappResponse.state = res.wappResponse.store.getState();
                }
                if (requestName === name+"FindById"){
                    const newPost = {...response[requestName]};
                    setPost(newPost);
                }
            }
        })
    }

    useEffect(function (){
        const unsub = subscribe.userChange(onUserChange);
        return function useUnsubscribe(){
            unsub();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(function (){
        const unsub = subscribe.requestResolved(onRequestResolved);
        return function useUnsubscribe(){
            unsub();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post])

    useEffect(function (){
        if (page === "new"){
            setPost(null);
        } else {
            setPost(post || utils.getGlobalState().res.responses?.postFindById)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    function getTitle() {

        const pageName = router({user, post, page});

        if (pageName === "new") {
            return appContext.titles.newPostTitle;
        }

        if (pageName === "edit") {
            return appContext.titles.editPostTitle;
        }

        if (pageName === "content") {
            return post?.title || appContext.titles.postTitle;
        }

        return "";

    }

    function getSubtitle() {
        const isNotDeleted = post?._status_isNotDeleted;
        const isBanned = post?._status_isBanned;
        const isValidated = post?._status_isValidated;
        const isApproved = post?._status_isApproved;
        const isFeatured = post?._status_isFeatured;
        const isAuthor = user?._id === post?._author;
        const isAdmin = user?._status_isFeatured;
        const isAuthorOrAdmin = !!(isAuthor || isAdmin)

        if (isAuthorOrAdmin){

            return (
                <>
                    {(page === "edit") ? null : <div>{post?.subtitle}</div>}
                    <div>
                        {
                            (isBanned) ?
                                appContext.titles.statusBannedTitle :
                                (!isNotDeleted) ?
                                    appContext.titles.statusDeletedTitle :
                                    (!isValidated) ?
                                        appContext.titles.statusMissingDataTitle :
                                        (isFeatured && isAdmin) ?
                                            appContext.titles.statusFeaturedTitle :
                                            (isApproved && isAdmin) ?
                                                appContext.titles.statusApprovedTitle :
                                                appContext.titles.statusCreatedTitle
                        }
                    </div>
                </>
            )
        }

        return (isBanned) ? appContext.titles.statusBannedTitle : (!isNotDeleted) ? appContext.titles.statusDeletedTitle : (!isValidated) ? appContext.titles.statusMissingDataTitle : (page === "edit") ? null : post?.subtitle;
    }

    const subtitle = getSubtitle();

    const dialog = {
        actions: {}
    };

    const dialogEffect = function ({actions}) {
        dialog.actions = actions;
    }

    const menu = getMenu({
        onDelete: function () {
            menuActions?.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogDeletePostTitle,
                dialogContent: appContext.messages.deletePostQuestion,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.deleteText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Delete", args: {_id: post?._id}, redirect: {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.deletePostSuccess
            })
        },
        onBan: function () {
            menuActions?.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogBanPostTitle,
                dialogContent: appContext.messages.banPostQuestion,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.banText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Ban", args: {_id: post?._id}, redirect: {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.banPostSuccess,
            })
        },
        onApprove: function () {
            menuActions?.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogApprovePostTitle,
                dialogContent: appContext.messages.approvePostQuestion,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.approveText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Approve", args: {_id: post?._id}, redirect: {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.approvePostSuccess,
            })
        },
        onFeatured: function () {
            menuActions?.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogMarkFeaturedPostTitle,
                dialogContent: appContext.messages.markFeaturedPostQuestion,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.markText,
                onSubmit: async function () {
                    return await utils.sendRequest({requestName: name+"Featured", args: {_id: post?._id}, redirect: {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.markFeaturedPostSuccess,
            })
        },
        onRemoveFeatured: function () {
            menuActions?.close();
            dialog.actions.open({
                dialogTitle: appContext.titles.dialogRemoveMarkFeaturedPostTitle,
                dialogContent: appContext.messages.removeMarkFeaturedPostQuestion,
                Form: RemoveFeaturedForm,
                cancelText: appContext.labels.cancelText,
                submitText: appContext.labels.removeMarkText,
                onSubmit: async function (e, formData) {
                    return await utils.sendRequest({requestName: name+"RemoveFeatured", args: formData, redirect: {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
                },
                successMessage: appContext.messages.removeMarkFeaturedPostSuccess
            })
        }
    })

    const pageName = router({user, post, page});

    if (!pageName){
        res.wappResponse.status(404)
    }

    let menuActions = null;

    return (
        <>
            {
                (pageName) ?
                    <div className={style.post}>
                        <Container fixed className={materialStyle.container} maxWidth={"lg"}>
                            <Paper elevation={3}>
                                <AppBar position={"relative"}
                                        className={materialStyle.appBar}
                                >
                                    <Toolbar>
                                        <div className={style.titleContainer}>
                                            <div className={style.title}>
                                                <Typography variant="h6" className={materialStyle.title}>
                                                    {getTitle()}
                                                </Typography>
                                            </div>
                                            {(subtitle) ?
                                                <div className={style.subtitle}>
                                                    <Typography variant="subtitle1" color="textSecondary" className={materialStyle.subtitle}>
                                                        {subtitle}
                                                    </Typography>
                                                </div>
                                                :
                                                null
                                            }
                                        </div>
                                        <Menu
                                            parentRoute={parentRoute}
                                            menu={menu}
                                            materialStyle={materialStyle}
                                            menuProperties={{user, post, page}}
                                            effect={function ({actions}) {
                                                menuActions = actions
                                            }}
                                        />
                                    </Toolbar>
                                </AppBar>
                                <PostContext.Provider value={{name, user, post, parentRoute}}>
                                    <div className={style.content}>
                                        <Router page={page}/>
                                    </div>
                                    <Dialog effect={dialogEffect} />
                                </PostContext.Provider>
                            </Paper>
                        </Container>
                    </div>
                    :
                    <NotFound />
            }
        </>
    )
}

const WappComponent = withWapp(Post);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
