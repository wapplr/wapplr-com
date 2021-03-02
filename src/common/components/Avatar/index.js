import React, {useContext} from "react";
import clsx from "clsx";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import MaterialAvatar from "@material-ui/core/Avatar";

import {withMaterialStyles} from "../Template/withMaterial";

import materialStyle from "./materialStyle";
import style from "./style.css";

function Avatar(props) {

    const context = useContext(WappContext);
    // eslint-disable-next-line no-unused-vars
    const utils = getUtils(context);
    const {subscribe, materialStyle, user, size = "list", ...rest} = props;

    const {wapp} = context;

    wapp.styles.use(style);

    const src = "";
    const firstName = user?.name?.first || "User";
    const aLetter = firstName.slice(0,1);

    return (
        <MaterialAvatar
            alt={firstName}
            children={(!src) ? aLetter : null}
            className={clsx(
                style.avatar,
                materialStyle.avatar,
                {[materialStyle.small]: (size === "small")},
                {[materialStyle.list]: (size === "list")},
                {[materialStyle.big]: (size === "big")}
            )}
            {...rest}
        />
    )
}

const WappComponent = withWapp(Avatar);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
