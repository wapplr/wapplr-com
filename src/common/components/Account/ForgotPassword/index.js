import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import {withMaterialStyles} from "../../Template/withMaterial";

import Form from "../../Form";
import AppContext from "../../App/context";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AccountContext from "../context";

function ForgotPassword(props) {

    const accountContext = useContext(AccountContext);
    const {user, name} = accountContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);
    const {materialStyle} = props;

    const {wapp} = context;

    async function onSubmit(e, formData) {
        return await utils.sendRequest({requestName: name+"ForgotPassword", args: formData, redirect: null});
    }

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"ForgotPassword"].formData;
    } catch (e){}

    const formData = {
        ...formDataFromResolvers,
        submit: {
            label: appContext.labels.forgotPasswordSubmitLabel
        }
    };

    if (user?._id){
        formData.email.value = user.email;
        formData.email.disabled = true;
    }

    wapp.styles.use(style);

    return (
        <Form
            formData={formData}
            onSubmit={onSubmit}
            successMessage={
                appContext.messages.forgotPasswordSuccessMessage
            }
        />
    )
}

const WappComponent = withWapp(ForgotPassword);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
