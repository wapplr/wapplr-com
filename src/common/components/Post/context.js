import React from "react";

const PostContext = React.createContext({
    name:"post",
    user:null,
    post:null,
    parentRoute:null
});

export default PostContext;
