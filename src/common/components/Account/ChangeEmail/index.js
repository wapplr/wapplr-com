import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import AppContext from "../../App/context";
import {withMaterialStyles} from "../../Template/withMaterial";
import Form from "../../Form";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AccountContext from "../context";

function ChangeData(props) {

    const accountContext = useContext(AccountContext);
    const {user, name} = accountContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);
    const {materialStyle} = props;

    const {wapp} = context;

    async function onSubmit(e, formData) {
        return await utils.sendRequest({requestName: name+"ChangeEmail", args: formData, redirect: null });
    }

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"ChangeEmail"].formData;
    } catch (e){}

    if (user?._id){
        formDataFromResolvers._id.value = user._id;
        formDataFromResolvers._id.disabled = true;
    }

    if (user?.email){
        formDataFromResolvers["email"].value = user?.email;
    }

    const formData = {
        ...formDataFromResolvers,
        submit: {
            label: appContext.labels.changeEmailSubmitLabel
        }
    }

    wapp.styles.use(style);

    return (
        <Form
            formData={formData}
            onSubmit={onSubmit}
            successMessage={
                appContext.messages.changeEmailSuccessMessage
            }
        />
    )
}

const WappComponent = withWapp(ChangeData);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
