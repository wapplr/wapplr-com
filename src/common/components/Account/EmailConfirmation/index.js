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
            return await utils.sendRequest({requestName: name+"EmailConfirmation", args: formData, redirect: {pathname: parentRoute, search:"", hash:""}, timeOut:2000 });
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

        if (query.hash && formDataFromResolvers.emailConfirmationKey){
            formDataFromResolvers.emailConfirmationKey.value = query.hash;
            formDataFromResolvers.emailConfirmationKey.disabled = true;
        }

        if (query.email && formDataFromResolvers.email){
            formDataFromResolvers.email.value = query.email;
            formDataFromResolvers.email.disabled = true;
        }

        if (user?._id && user?.email && formDataFromResolvers.email){
            formDataFromResolvers.email.value = user.email;
            formDataFromResolvers.email.disabled = true;
        }

        formData = {
            ...formDataFromResolvers,
            submit: {
                label: appContext.labels.emailConfirmationSubmitLabel
            }
        }

    }

    if (type === "sendagain"){

        try {
            formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"EmailConfirmationSendAgain"].formData;
        } catch (e){}

        if (user?._id){
            formDataFromResolvers._id.value = user._id;
            formDataFromResolvers._id.disabled = true;
        }

        formData = {
            ...formDataFromResolvers,
            submit: {
                label: appContext.labels.emailConfirmationSendAgainSubmitLabel
            }
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
