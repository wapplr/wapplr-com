import React, {useContext, useEffect, useState} from "react";
import style from "./app.css";

import Log from "wapplr-react/dist/common/Log";
import {WappContext} from "wapplr-react/dist/common/Wapp";

export function AppFunctionExample(props) {

    const {wapp} = useContext(WappContext);
    const {subscribe} = props;

    function getGlobalState() {
        return wapp.states.store.getState();
    }
    function getRequestUrl() {
        const globalState = getGlobalState();
        return globalState.req.url;
    }

    const [url, setUrl] = useState(getRequestUrl());

    function onLocationChange(newUrl){
        if (url !== newUrl){
            setUrl(newUrl);
        }
    }

    function onRequestResolved(response) {
        console.log(response);
    }

    useEffect(function useSubscribe() {
        const unsub1 = subscribe.locationChange(onLocationChange);
        const unsub2 = subscribe.requestResolved(onRequestResolved);
        return function useUnsubscribe(){
            unsub1();
            unsub2();
        }
    })

    wapp.styles.use(style);

    return (
        <div className={style.app}>
            <Log />
        </div>
    );

}

export default class App extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.removeStyle = null;
        this.state = {
            url: this.getRequestUrl()
        }
    }
    componentDidMount() {
        const {wapp} = this.context;
        this.removeStyle = wapp.styles.add(style);
    }
    componentWillUnmount() {
        if (this.removeStyle){
            this.removeStyle();
            this.removeStyle = null;
        }
    }
    getGlobalState() {
        const {wapp} = this.context;
        return wapp.states.store.getState();
    }
    getRequestUrl() {
        const globalState = this.getGlobalState();
        return globalState.req.url;
    }
    onLocationChange(url) {
        if (this.state.url !== url){
            this.setState({url})
        }
    }
    onRequestResolved(response) {
        console.log(response)
    }
    render() {
        return (
            <div className={style.app}>
                <Log footerMenu={[
                    {name: "HOME", href:"/"},
                    {name: "GETTING STARTED", href:"/installing"},
                    {name: "API REFERENCE", href:"/api"},
                    {name: "GITHUB", href:"https://github.com/wapplr/wapplr", target:"_blank"}
                ]}/>
            </div>
        );
    }
}
