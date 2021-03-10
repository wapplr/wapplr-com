import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import AppContext from "../../App/context";
import {withMaterialStyles} from "../../Template/withMaterial";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AccountContext from "../context";
import Dialog from "../../Dialog";
import Button from "@material-ui/core/Button";

function DeleteAccount(props) {

    const accountContext = useContext(AccountContext);
    const {user, parentRoute, name} = accountContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);
    const {materialStyle} = props;

    const {wapp} = context;

    async function onSubmit(e, formData) {
        return await utils.sendRequest({requestName: name+"Delete", args: formData, redirect: null });
    }

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"Delete"].formData;
    } catch (e){}

    const formData = {
        ...formDataFromResolvers,
    };

    if (user?._id){
        formData._id.value = user._id;
        formData._id.disabled = true;
    }

    wapp.styles.use(style);

    const dialog = {
        actions: {}
    };

    const dialogEffect = function ({actions}) {
        dialog.actions = actions;
    };

    const onDelete = function () {
        dialog.actions.open({
            dialogTitle: appContext.titles.dialogDeleteAccountTitle,
            dialogContent: appContext.messages.deleteAccountQuestion,
            cancelText: appContext.labels.cancelText,
            submitText: appContext.labels.deleteText,
            onSubmit: async function () {
                return await utils.sendRequest({requestName: name+"Delete", args: {_id: user?._id}, redirect: {pathname: parentRoute, search:"", hash:""}, timeOut:1000 });
            },
            successMessage: appContext.messages.deleteAccountSuccess
        })
    };

    return (
        <div>
            <Button
                className={materialStyle.deleteAccountButton}
                variant={"contained"}
                color={"secondary"}
                onClick={onDelete}
            >
                {appContext.labels.deleteAccountLabel}
            </Button>
            <Dialog effect={dialogEffect} />
        </div>
    )
}

const WappComponent = withWapp(DeleteAccount);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
