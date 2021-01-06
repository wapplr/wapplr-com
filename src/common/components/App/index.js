import React from "react";
import style from "./app.css";

import Log from "wapplr-react/dist/common/Log";

export default function App(props) {

    const {wapp} = props;

    wapp.styles.use(style);

    return (
        <Log {...props} />
    );
}
