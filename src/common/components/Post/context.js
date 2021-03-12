import React from "react";

const PostContext = React.createContext({
    name:"post",
    user:null,
    post:null,
    parentRoute:null,
    statusManager: null
});

export default PostContext;
