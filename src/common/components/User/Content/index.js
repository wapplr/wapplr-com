import React, {useContext, useRef} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import {withMaterialStyles} from "../../Template/withMaterial";
import PostContext from "../../Post/context";
import Menu from "../../Menu";
import getMenu from "./menu";
import AppContext from "../../App/context";

import materialStyle from "./materialStyle";
import style from "./style.css";

function Content(props) {

    const container = useRef()
    const postContext = useContext(PostContext);
    // eslint-disable-next-line no-unused-vars
    const {user, post, name, parentRoute} = postContext;

    const context = useContext(WappContext);
    const appContext = useContext(AppContext);
    // eslint-disable-next-line no-unused-vars
    const utils = getUtils(context);
    // eslint-disable-next-line no-unused-vars
    const {materialStyle} = props;

    const {wapp} = context;

    wapp.styles.use(style);

    return (
        <div className={style.post} ref={container}>
            <div className={style.content}>
                <Menu
                    parentRoute={parentRoute}
                    menu={getMenu({appContext})}
                    materialStyle={materialStyle}
                    menuProperties={{user}}
                    list={true}
                />
            </div>
        </div>
    )
}

const WappComponent = withWapp(Content);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
