import React from "react";

const AccountContext = React.createContext({user:null, parentRoute:null, name:"user", page:"", statusManager:null});

export default AccountContext;
