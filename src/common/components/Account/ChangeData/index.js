import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import {withMaterialStyles} from "../../Template/withMaterial";
import Form from "../../Form";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AccountContext from "../context";

function ChangeData(props) {

    const accountContext = useContext(AccountContext);
    const {user, name} = accountContext;

    const context = useContext(WappContext);
    const utils = getUtils(context);
    const {materialStyle} = props;

    const {wapp} = context;

    async function onSubmit(e, formData) {
        return await utils.sendRequest({requestName: name+"Save", args: formData, redirect: null });
    }

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"Save"].formData;
    } catch (e){}

    if (user?._id){
        formDataFromResolvers._id.value = user._id;
        formDataFromResolvers._id.disabled = true;
    }

    if (user?.name?.first){
        formDataFromResolvers["record.name.first"].value = user?.name?.first;
    }

    if (user?.name?.last){
        formDataFromResolvers["record.name.last"].value = user?.name?.last;
    }

    const formData = {
        ...formDataFromResolvers,
    }

    wapp.styles.use(style);

    return (
        <Form formData={formData} onSubmit={onSubmit}/>
    )
}

const WappComponent = withWapp(ChangeData);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
