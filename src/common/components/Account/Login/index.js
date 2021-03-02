import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import {withMaterialStyles} from "../../Template/withMaterial";
import Form from "../../Form";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AccountContext from "../context";

function Login(props) {

    const accountContext = useContext(AccountContext);
    const {user, parentRoute, name} = accountContext;

    const context = useContext(WappContext);
    const utils = getUtils(context);
    const {materialStyle} = props;

    const {wapp, req} = context;

    const query = req.wappRequest.query;

    async function onSubmit(e, formData) {
        return await utils.login({requestName: name+"Login", args: formData, redirect: {pathname: query.redirect || parentRoute, search:"", hash:""}});
    }

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"Login"].formData;
    } catch (e){
        console.log(e)
    }

    const formData = {
        ...formDataFromResolvers,
    }

    wapp.styles.use(style);

    return (
        <Form formData={formData} onSubmit={onSubmit}/>
    )
}

const WappComponent = withWapp(Login);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
