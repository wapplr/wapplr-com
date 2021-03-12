import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import {withMaterialStyles} from "../../Template/withMaterial";
import Form from "../../Form";

import materialStyle from "./materialStyle";
import style from "./style.css";
import PostContext from "../context";
import AppContext from "../../App/context";

function New(props) {

    const postContext = useContext(PostContext);

    // eslint-disable-next-line no-unused-vars
    const {user, post, name, parentRoute} = postContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);

    // eslint-disable-next-line no-unused-vars
    const {materialStyle} = props;

    const {wapp} = context;

    async function onSubmit(e, formData) {
        return await utils.sendRequest({requestName: name+"New", args: formData, redirect: {pathname: parentRoute+"/:_id", search:"", hash:""}, timeOut:1000 });
    }

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"New"].formData;
    } catch (e){}

    const formData = {
        ...formDataFromResolvers,
        submit: {
            label: appContext.labels.newEntrySubmitLabel
        }
    };

    wapp.styles.use(style);

    return (
        <Form
            formData={formData}
            onSubmit={onSubmit}
            successMessage={
                appContext.messages.newEntrySuccessMessage
            }
        />
    )
}

const WappComponent = withWapp(New);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
