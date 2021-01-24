import React, {useContext, useState, useEffect} from "react";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";
import {WappContext} from "wapplr-react/dist/common/Wapp";
import Log from "wapplr-react/dist/common/Log";

import Template from "../Template";

import style from "./app.css";

export default function App(props) {

    const context = useContext(WappContext);
    const {wapp} = context;
    const utils = getUtils(context);
    const {subscribe} = props;

    wapp.styles.use(style);

    const [url, setUrl] = useState(utils.getRequestUrl());

    function onLocationChange(newUrl){
        if (url !== newUrl){
            setUrl(newUrl);
        }
    }

    useEffect(function (){
        const unsub = subscribe.locationChange(onLocationChange);
        return function useUnsubscribe(){
            unsub();
        }
    }, [url])

    return (
        <div className={style.app}>
            <Template>
                <Log Parent={null} />
            </Template>
        </div>
    );
}
