import React, {useContext, useEffect, useState} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import {withMaterialStyles} from "../../Template/withMaterial";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import Button from "@material-ui/core/Button";

import AppContext from "../../App/context";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AccountContext from "../context";

function Profile(props) {

    const {
        materialStyle
    } = props;

    const accountContext = useContext(AccountContext);
    const {user, name} = accountContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);

    const {wapp} = context;

    async function onSubmit(e) {
        e.preventDefault();
        await utils.logout({requestName: name+"Logout", redirect: null});
    }

    wapp.styles.use(style);

    return (
        <div className={style.profile}>
            <form className={style.form}
                  autoComplete={"off"}
                  noValidate
                  onSubmit={onSubmit}
            >
                <Button
                    className={materialStyle.logoutSubmit}
                    variant={"contained"}
                    color={"secondary"}
                    onClick={onSubmit}
                    type={"submit"}
                >
                    {appContext.labels.logoutSubmitLabel}
                </Button>
            </form>
        </div>
    )
}

const WappComponent = withWapp(Profile);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
