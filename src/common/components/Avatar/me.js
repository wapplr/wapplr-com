import React, {useContext, useState, useEffect} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import Avatar from "./index";

function Me(props) {

    const context = useContext(WappContext);
    const utils = getUtils(context);
    const {subscribe, materialStyle, ...rest} = props;

    const [user, setUser] = useState(utils.getRequestUser());

    function onUserChange(user){
        setUser((user?._id) ? user : null);
    }

    useEffect(function (){
        const unsub = subscribe.userChange(onUserChange);
        return function useUnsubscribe(){
            unsub();
        }
    }, [user]);

    return (
        <Avatar {...rest} user={user} />
    )
}

export default withWapp(Me);
