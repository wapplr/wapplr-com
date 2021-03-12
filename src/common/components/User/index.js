import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import {withMaterialStyles} from "../Template/withMaterial";

import AppContext from "../App/context";
import Post from "../Post";

import materialStyle from "./materialStyle";
import style from "./style.css";

import getMenu, {getTopMenu} from "./menu";
import {getPageName} from "./utils";

import EditPost from "../Post/Edit";
import Content from "./Content";
import Posts from "./Posts";

function User(props) {

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);

    const {
        name = "user",
    } = props;

    const {wapp, res} = context;

    wapp.styles.use(style);

    const wappResponse = res.wappResponse;
    const route = wappResponse.route;
    const {params} = route;
    const {pageType} = params;

    const menuProps = {
        pageType
    };

    const pages = {
        edit: EditPost,
        content: Content,
        posts: Posts,
        documents: function () {
            return (
                <Posts
                    name={"document"}
                />
            )
        }
    };

    function getDashboardTitle({user, post, page}) {
        const isAuthor = ((user?._id && user?._id === post?._author) || (user?._id && user?._id === post?._author?._id));

        const wappResponse = res.wappResponse;
        const route = wappResponse.route;
        const {params} = route;
        const {pageType} = params;

        if (page === "posts" && !pageType){
            return (isAuthor) ? appContext.titles.myPostsTitle : appContext.titles.userPostsTitle;
        }
        if (page === "posts" && pageType === "deleted"){
            return (isAuthor) ? appContext.titles.myDeletedPostsTitle : appContext.titles.userDeletedPostsTitle;
        }

        if (page === "documents" && !pageType){
            return (isAuthor) ? appContext.titles.myDocumentsTitle : appContext.titles.userDocumentsTitle;
        }
        if (page === "documents" && pageType === "deleted"){
            return (isAuthor) ? appContext.titles.myDeletedDocumentsTitle : appContext.titles.userDeletedDocumentsTitle;
        }

        if (!isAuthor){
            return appContext.titles.userProfileTitle;
        }
        return appContext.titles.dashboardTitle;
    }

    return (
        <Post
            name={name}
            parentRoute={appContext.routes.userRoute}
            getTitle={({post, page}) => (post?.name) ? post?.name.last ? post?.name.first + " " + post?.name.last : post?.name.first : appContext.titles[name+"Title"]}
            getSubtitle={({post}) => ""}
            getMenu={(props = {}) => getMenu({...props, ...menuProps})}
            getTopMenu={(props = {}) => getTopMenu({...props, ...menuProps})}
            menuProperties={menuProps}
            pages={pages}
            layoutType={"user"}
            maxWidth={"sm"}
            getPageName={getPageName}
            getDashboardTitle={getDashboardTitle}
        />
    )

}

const WappComponent = withWapp(User);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
