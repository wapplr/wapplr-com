import React from "react";
import Profile from "../Settings";

export default function Logout(props) {
    return (
        <Profile {...props} logout={true}/>
    )
}
