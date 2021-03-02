import React, {useContext} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import {withMaterialStyles} from "../../Template/withMaterial";
import Form from "../../Form";

import materialStyle from "./materialStyle";
import style from "./style.css";
import PostContext from "../context";
import AppContext from "../../App/context";

function Edit(props) {

    const postContext = useContext(PostContext);
    // eslint-disable-next-line no-unused-vars
    const {name, user, post, parentRoute} = postContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);
    // eslint-disable-next-line no-unused-vars
    const {materialStyle} = props;

    const {wapp} = context;

    async function onSubmit(e, formData) {
        return await utils.sendRequest({requestName: name+"Save", args: formData, redirect: {pathname: parentRoute+"/"+post._id, search:"", hash:""}, timeOut:1000 });
    }

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"Save"].formData;
    } catch (e){
        console.log(e)
    }

    const isNotDeleted = post?._status_isNotDeleted;

    const formData = {
        ...formDataFromResolvers,
        submit: {
            label: (isNotDeleted) ? appContext.labels.savePostSubmitLabel : appContext.labels.restorePostSubmitLabel
        }
    }

    if (post?._id){
        formData._id.value = post._id;
        formData._id.disabled = true;
    }

    if (post?.title){
        formData["record.title"].value = post.title;
    }

    if (post?.subtitle){
        formData["record.subtitle"].value = post.subtitle;
    }

    if (post?.content){
        formData["record.content"].value = post.content;
    }

    wapp.styles.use(style);

    return (
        <div className={style.edit}>
            <Form
                formData={formData}
                onSubmit={onSubmit}
                successMessage={
                    appContext.messages.savePostSuccessMessage
                }
            />
        </div>
    )
}

const WappComponent = withWapp(Edit);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
