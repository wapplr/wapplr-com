import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import {withMaterialStyles} from "../../Template/withMaterial";
import Form from "../../Form";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AppContext from "../../App/context";
import AccountContext from "../context";

function ResetPassword(props) {

    const accountContext = useContext(AccountContext);
    const {user, parentRoute, name} = accountContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);

    const {materialStyle} = props;

    const {wapp, req, res} = context;

    async function onSubmit(e, formData) {
        return await utils.sendRequest({requestName: name+"ResetPassword", args: formData, redirect: {pathname: parentRoute, search:"", hash:""}, timeOut:1000 });
    }

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"ResetPassword"].formData;
    } catch (e){}

    const formData = {
        ...formDataFromResolvers,
        submit: {
            label: appContext.labels.resetPasswordSubmitLabel
        }
    };

    const query = req.wappRequest.query;

    if (query.hash){
        formData.passwordRecoveryKey.value = query.hash;
        formData.passwordRecoveryKey.disabled = true;
    }

    if (query.email){
        formData.email.value = query.email;
        formData.email.disabled = true;
    }

    if (user?._id && user?.email){
        formData.email.value = user.email;
        formData.email.disabled = true;
    }

    wapp.styles.use(style);

    return (
        <Form
            formData={formData}
            onSubmit={onSubmit}
            successMessage={
                appContext.messages.resetPasswordSuccessMessage
            }
        />
    )

}

const WappComponent = withWapp(ResetPassword);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
