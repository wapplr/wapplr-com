import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import AppContext from "../../App/context";
import {withMaterialStyles} from "../../Template/withMaterial";
import Form from "../../Form";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AccountContext from "../context";

function ChangePassword(props) {

    const accountContext = useContext(AccountContext);
    const {user, parentRoute, name} = accountContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);
    const {materialStyle} = props;

    const {wapp} = context;

    async function onSubmit(e, formData) {
        return await utils.sendRequest({requestName: name+"ChangePassword", args: formData, redirect: {pathname: parentRoute, search:"", hash:""}, timeOut:1000 });
    }

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"ChangePassword"].formData;
    } catch (e){}

    const formData = {
        ...formDataFromResolvers,
        submit: {
            label: appContext.labels.changePasswordSubmitLabel
        }
    };

    if (user?._id){
        formData._id.value = user._id;
        formData._id.disabled = true;
    }

    wapp.styles.use(style);

    return (
        <Form
            formData={formData}
            onSubmit={onSubmit}
            successMessage={
                appContext.messages.changePasswordSuccessMessage
            }
        />
    )
}

const WappComponent = withWapp(ChangePassword);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
