import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import {withMaterialStyles} from "../../Template/withMaterial";
import Form from "../../Form";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AppContext from "../../App/context";
import AccountContext from "../context";

function EmailConfirmation(props) {

    const accountContext = useContext(AccountContext);
    const {user, parentRoute, name} = accountContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);

    const {materialStyle} = props;

    const {wapp, req, res} = context;

    const query = req.wappRequest.query;

    const type = (query?.hash || !user?._id) ? "confirmation" : "sendagain";

    async function onSubmit(e, formData) {
        if (type === "confirmation"){
            return await utils.sendRequest({requestName: name+"EmailConfirmation", args: formData, redirect: {pathname: parentRoute, search:"", hash:""}, timeOut:1000 });
        } else if (type === "sendagain") {
            return await utils.sendRequest({requestName: name+"EmailConfirmationSendAgain", args: formData});
        }
    }

    let formDataFromResolvers = {};

    let formData = {};

    if (type === "confirmation") {

        try {
            formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"EmailConfirmation"].formData;
        } catch (e){}

        formData = {
            ...formDataFromResolvers,
            submit: {
                label: appContext.labels.emailConfirmationSubmitLabel
            }
        };

        if (query.hash && formData.emailConfirmationKey){
            formData.emailConfirmationKey.value = query.hash;
            formData.emailConfirmationKey.disabled = true;
        }

        if (query.email && formData.email){
            formData.email.value = query.email;
            formData.email.disabled = true;
        }

        if (user?._id && user?.email && formData.email){
            formData.email.value = user.email;
            formData.email.disabled = true;
        }

    }

    if (type === "sendagain"){

        try {
            formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"EmailConfirmationSendAgain"].formData;
        } catch (e){}

        formData = {
            ...formDataFromResolvers,
            submit: {
                label: appContext.labels.emailConfirmationSendAgainSubmitLabel
            }
        };

        if (user?._id){
            formData._id.value = user._id;
            formData._id.disabled = true;
        }

    }

    wapp.styles.use(style);

    return (
        <Form
            formData={formData}
            onSubmit={onSubmit}
            successMessage={
                (type === "confirmation") ? appContext.messages.emailConfirmationSuccessMessage : appContext.messages.emailConfirmationSendAgainSuccessMessage
            }
        />
    )

}

const WappComponent = withWapp(EmailConfirmation);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
