import React, {useContext, useRef, useEffect} from "react";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import syntaxStyle from "react-syntax-highlighter/dist/cjs/styles/prism/okaidia";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import {withMaterialStyles} from "../../Template/withMaterial";

import materialStyle from "./materialStyle";
import style from "./style.css";
import PostContext from "../context";

const renderers = {
    code: ({language, value}) => {
        return <SyntaxHighlighter style={syntaxStyle} language={language} children={value} />
    }
}

function Content(props) {

    const container = useRef()
    const postContext = useContext(PostContext);
    // eslint-disable-next-line no-unused-vars
    const {user, post, name} = postContext;

    const context = useContext(WappContext);
    // eslint-disable-next-line no-unused-vars
    const utils = getUtils(context);
    // eslint-disable-next-line no-unused-vars
    const {materialStyle} = props;

    const {wapp} = context;

    wapp.styles.use(style);

    useEffect(function () {
        if (container.current){
            const aa = container.current.getElementsByTagName("a");
            for (let i = 0; i < aa.length; i++) {
                aa[i].setAttribute("target", "_blank");
            }
        }
    }, [container])

    return (
        <div className={style.post} ref={container}>
            <div className={style.content}>
                <ReactMarkdown renderers={renderers} >
                    {post?.content}
                </ReactMarkdown>
            </div>
        </div>
    )
}

const WappComponent = withWapp(Content);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
