import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import {withMaterialStyles} from "../Template/withMaterial";
import AppContext from "../App/context";

import Post from "../Post";
import materialStyle from "./materialStyle";
import style from "./style.css";
import getDefaultMenu from "./menu";

import EditPost from "../Post/Edit";
import Content from "./Content";

function User(props) {

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);

    const {
        name = "user",
        url
    } = props;

    const {wapp} = context;

    wapp.styles.use(style);

    const menuProps = {};

    const getMenu = function (props = {}) {
        return getDefaultMenu({...props, ...menuProps});
    }

    const pages = {
        edit: EditPost,
        content: Content
    }

    return (
        <Post
            url={url}
            name={name}
            parentRoute={appContext.routes.userRoute}
            getTitle={(post) => (post?.name) ? post?.name.last ? post?.name.first + " " + post?.name.last : post?.name.first : ""}
            getSubtitle={(post) => ""}
            getMenu={getMenu}
            pages={pages}
            layoutType={"user"}
        />
    )

}

const WappComponent = withWapp(User);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
