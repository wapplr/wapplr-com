import React, {useContext, useEffect, useState} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";

import getStatus from "../../utils/getStatus";
import capitalize from "../../utils/capitalize";

import {withMaterialStyles} from "../Template/withMaterial";
import AppContext from "../App/context";

import Dialog from "../Dialog";
import Menu from "../Menu";
import NotFound from "../NotFound";
import Avatar from "../Avatar";

import style from "./style.css";
import materialStyle from "./materialStyle";

import PostContext from "./context";
import getDefaultMenu, {getMenuProps} from "./menu";
import {defaultGetPageName} from "./utils";

import Router from "./Router";
import New from "./New";
import Edit from "./Edit";
import Content from "./Content";

const defaultPages = {
    content: Content,
    new: New,
    edit: Edit,
};

function Post(props) {

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);

    const {userStatusManager, routes, titles} = appContext;

    const {subscribe, materialStyle, ...rest} = props;

    const {
        parentRoute = routes.postRoute,
        name = "post",
        getTitle = function ({post}) {return post?.title},
        getSubtitle = function ({post}) {return post?.subtitle},
        getMenu,
        menuProperties,
        pages = defaultPages,
        layoutType,
        getTopMenu,
        maxWidth = "lg",
        getPageName = defaultGetPageName,
        getDashboardTitle = function ({post}) {return titles.dashboardTitle}
    } = rest;

    const utils = getUtils(context);
    const {wapp, res} = context;

    const statusManager = wapp.getTargetObject().postTypes.findPostType({name: name}).statusManager;

    wapp.styles.use(style);

    const page = (res.wappResponse.route.path === routes[name+"Route"]+"/new") ? "new" : res.wappResponse.route.params.page;

    const [user, setUser] = useState(utils.getRequestUser());
    const [post, setPost] = useState((page === "new") ? null : utils.getGlobalState().res.responses && utils.getGlobalState().res.responses[name+"FindById"]);

    function onUserChange(user){
        setUser((user?._id) ? user : null);
    }

    function onRequestResolved({value}) {
        const keys = [name+"FindById"];
        const response = value;
        let foundEnabledKeys = false;
        keys.forEach(function (requestName) {
            if (!foundEnabledKeys && response && response[requestName]){
                foundEnabledKeys = true;
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
    }, [user]);

    useEffect(function (){
        const unsub = subscribe.requestResolved(onRequestResolved);
        return function useUnsubscribe(){
            unsub();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post]);

    useEffect(function (){
        if (page === "new"){
            setPost(null);
        } else {
            setPost(post || (utils.getGlobalState().res.responses && utils.getGlobalState().res.responses[name+"FindById"]))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    function getTitleWithPageName() {

        const pageName = getPageName({user, post, page, statusManager, userStatusManager});

        if (pageName === "new") {
            return titles["new"+capitalize(name)+"Title"];
        }

        if (pageName === "edit") {
            return titles["edit"+capitalize(name)+"Title"];
        }

        if (pageName === "content") {
            return getTitle({user, post, page}) || titles[name+"Title"];
        }

        return getTitle({user, post, page}) || titles[name+"Title"] || "";

    }

    const subtitle = (page === "edit") ? null : getSubtitle({user, post, page});

    const dialog = {
        actions: {}
    };

    const dialogEffect = function ({actions}) {
        dialog.actions = actions;
    };

    let menuActions = {};

    const menuProps = getMenuProps({appContext, menuActions, dialog, utils, name, post, parentRoute});

    const menu = (getMenu) ? getMenu({...menuProps, statusManager}) : getDefaultMenu({...menuProps, statusManager});

    const topMenu = (getTopMenu) ? getTopMenu({...menuProps, statusManager}) : [];

    const pageName = getPageName({user, post, page, statusManager, userStatusManager});

    if (!pageName){
        res.wappResponse.status(404)
    }

    const avatarClick = (e) => {
        const author = getAuthorObject();
        wapp.client.history.push({pathname: routes.userRoute + "/" + author._id, search:"", hash:""})
    };

    function getAuthorObject() {
        return (post?._id && post?._author === post?._id && post?.name) ? post : (post?._author?._id) ? post?._author : null;
    }

    return (
        <>
            {
                (pageName) ?
                    <div className={style.post}>
                        <Container fixed className={materialStyle.container} maxWidth={maxWidth}>
                            <Paper elevation={3}>
                                {(layoutType === "user") ?
                                    <div className={style.userLayout}>
                                        {
                                            (topMenu.length) ?
                                                <div className={style.topMenu}>
                                                    <Menu
                                                        parentRoute={parentRoute}
                                                        menu={topMenu}
                                                        materialStyle={materialStyle}
                                                        menuProperties={{user, post, page, ...menuProperties}}
                                                    />
                                                </div>
                                                :
                                                null
                                        }
                                        <div className={style.userBox}>
                                            <div className={style.avatarContainer} onClick={avatarClick}>
                                                <Avatar user={getAuthorObject()} size={"big"}/>
                                            </div>
                                            <div className={style.titleContainer}>
                                                <div className={style.title}>
                                                    <Typography variant={"h5"} className={materialStyle.title}>
                                                        {getTitleWithPageName()}
                                                    </Typography>
                                                </div>
                                                {(subtitle) ?
                                                    <div className={style.subtitle}>
                                                        <Typography variant={"subtitle1"} color={"textSecondary"} className={materialStyle.subtitle}>
                                                            {subtitle}
                                                        </Typography>
                                                    </div>
                                                    :
                                                    null
                                                }
                                                {(page !== "new" && getStatus({user, post, appContext, statusManager})) ?
                                                    <div className={style.status}>
                                                        <Typography variant={"subtitle1"} color={"textSecondary"} className={materialStyle.subtitle}>
                                                            {getStatus({user, post, appContext, statusManager})}
                                                        </Typography>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                }
                                <AppBar position={"relative"}
                                        className={materialStyle.appBar}
                                >
                                    <Toolbar>
                                        {
                                            (layoutType !== "user") ?
                                                <>
                                                    {(getAuthorObject()) ?
                                                        <div className={style.avatarContainer} onClick={avatarClick}>
                                                            <Avatar user={getAuthorObject()} />
                                                        </div>
                                                        : null
                                                    }
                                                    <div className={style.titleContainer}>
                                                        <div className={style.title}>
                                                            <Typography variant={"h6"} className={materialStyle.title}>
                                                                {getTitleWithPageName()}
                                                            </Typography>
                                                        </div>
                                                        {(subtitle) ?
                                                            <div className={style.subtitle}>
                                                                <Typography variant={"subtitle1"} color={"textSecondary"} className={materialStyle.subtitle}>
                                                                    {subtitle}
                                                                </Typography>
                                                            </div>
                                                            :
                                                            null
                                                        }
                                                        {(page !== "new" && getStatus({user, post, page, appContext, statusManager})) ?
                                                            <div className={style.status}>
                                                                <Typography variant={"subtitle1"} color={"textSecondary"} className={materialStyle.subtitle}>
                                                                    {getStatus({user, post, page, appContext, statusManager})}
                                                                </Typography>
                                                            </div>
                                                            :
                                                            null
                                                        }
                                                    </div>
                                                </>
                                                :
                                                <div className={style.titleContainer} >
                                                    <Typography variant={"h6"} className={materialStyle.title}>
                                                        {getDashboardTitle({user, post, page})}
                                                    </Typography>
                                                </div>
                                        }
                                        <Menu
                                            parentRoute={parentRoute}
                                            menu={menu}
                                            materialStyle={materialStyle}
                                            menuProperties={{user, post, page, ...menuProperties}}
                                            effect={function ({actions}) {
                                                menuActions.actions = actions;
                                            }}
                                        />
                                    </Toolbar>
                                </AppBar>
                                <PostContext.Provider value={{name, user, post, parentRoute, statusManager}}>
                                    <div className={style.content}>
                                        <Router page={page} pages={pages} router={getPageName}/>
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
