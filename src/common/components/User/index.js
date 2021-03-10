import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import {withMaterialStyles} from "../Template/withMaterial";
import AppContext from "../App/context";

import Post, {defaultRouter, showPageOrNotFound} from "../Post";
import materialStyle from "./materialStyle";
import style from "./style.css";
import getDefaultMenu from "./menu";

import EditPost from "../Post/Edit";
import Content from "./Content";
import Posts from "./Posts";
import SettingsIcon from "@material-ui/icons/Settings";

function router({user, post, page}) {

    const show = showPageOrNotFound({user, post, page});

    if (!show){
        return null;
    }

    if (page === "posts"){
        return "posts"
    }

    return defaultRouter({user, post, page});
}

function User(props) {

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);

    const {
        name = "user",
        url
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

    const getMenu = function (props = {}) {
        return getDefaultMenu({...props, ...menuProps});
    };

    const pages = {
        edit: EditPost,
        content: Content,
        posts: Posts
    };

    return (
        <Post
            url={url}
            name={name}
            parentRoute={appContext.routes.userRoute}
            getTitle={({post, page}) => (post?.name) ? post?.name.last ? post?.name.first + " " + post?.name.last : post?.name.first : appContext.titles[name+"Title"]}
            getSubtitle={({post}) => ""}
            getMenu={getMenu}
            menuProperties={menuProps}
            pages={pages}
            layoutType={"user"}
            topMenu={[
                {
                    name: appContext.menus.accountSettingsMenu,
                    href: function (p) {
                        return appContext.routes.accountRoute;
                    },
                    role: function (p) {
                        const isAuthor = ((p?.user?._id && p?.user?._id === p?.post?._author) || (p?.user?._id && p?.user?._id === p?.post?._author?._id));
                        if (isAuthor) {
                            return !!(p?.post?._id && !p.page);
                        }
                        return false;
                    },
                    Icon: SettingsIcon,
                    disableParentRoute: true,
                    featured: true
                }
            ]}
            maxWidth={"sm"}
            router={router}
            dashboardTitle={({user, post, page}) => {
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

                if (!isAuthor){
                    return appContext.titles.userProfileTitle;
                }
                return appContext.titles.dashboardTitle;
            }}
        />
    )

}

const WappComponent = withWapp(User);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
