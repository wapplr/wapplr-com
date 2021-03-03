import React from "react";

const AccountContext = React.createContext({user:null, parentRoute:null, name:"user", page:""});

export default AccountContext;
