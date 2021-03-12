import React, {useContext, useState, useEffect} from "react";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";
import {WappContext} from "wapplr-react/dist/common/Wapp";
import AppContext from "./context";

import Template from "../Template";
import Account from "../Account";
import Post from "../Post";
import User from "../User";

import style from "./style.css";

import messages from "../../config/constants/messages";
import labels from "../../config/constants/labels";
import titles from "../../config/constants/titles";
import routes from "../../config/constants/routes";
import menus from "../../config/constants/menus";

export default function App(props) {

    const context = useContext(WappContext);
    const {wapp, res} = context;
    const utils = getUtils(context);
    const {subscribe} = props;

    wapp.styles.use(style);

    const [url, setUrl] = useState(utils.getRequestUrl());

    async function onLocationChange(newUrl){
        if (url !== newUrl){
            setUrl(newUrl);
        }
    }

    useEffect(function (){
        const unsub = subscribe.locationChange(onLocationChange);
        return function useUnsubscribe(){
            unsub();
        }
    }, [url]);

    const userStatusManager = wapp.getTargetObject().postTypes.findPostType({name: "user"}).statusManager;
    const route = res.wappResponse.route;
    const requestPath = route.requestPath;

    return (
        <AppContext.Provider value={{messages, labels, titles, routes, menus, userStatusManager}}>
            <div className={style.app}>
                <Template >
                    {(requestPath.startsWith(routes.accountRoute)) ? <Account /> : null}
                    {(requestPath.startsWith(routes.postRoute)) ? <Post /> : null}
                    {(requestPath.startsWith(routes.userRoute)) ? <User /> : null}
                    {(requestPath.startsWith(routes.documentRoute)) ? <Post name={"document"} parentRoute={routes.documentRoute}/> : null}
                </Template>
            </div>
        </AppContext.Provider>
    );
}
