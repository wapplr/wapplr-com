import React, {useContext} from "react";

import PostContext from "./context";
import {WappContext} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";
import Form from "../Form";

function RemoveFeaturedForm(props) {

    const {
        onSubmit,
        setFormRef
    } = props;

    const postContext = useContext(PostContext);
    const {name, post} = postContext;

    const context = useContext(WappContext);
    const utils = getUtils(context);

    let formDataFromResolvers = {};
    try {
        formDataFromResolvers = utils.getGlobalState().res.graphql.mutation[name+"RemoveFeatured"].formData;
    } catch (e){
        console.log(e)
    }

    const formData = {
        ...formDataFromResolvers,
    };

    delete formData.submit;

    if (post?._id){
        formData._id.value = post._id;
        formData._id.disabled = true;
    }

    return (
        <div >
            <Form
                ref={function (e) {
                    setFormRef.current = e;
                }}
                formData={formData}
                onSubmit={onSubmit}
            />
        </div>
    )
}

export default RemoveFeaturedForm