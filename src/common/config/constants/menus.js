import {runPostTypesConfigSync} from "../../postTypes";

const menus = {
    loginMenu: "Login",
    signupMenu: "Signup",
    changeData: "Change data",
    changeEmail: "Change email",
    emailConfirmation: "Email confirmation",
    changePassword: "Change password",
    forgotPasswordMenu: "Forgot password",
    deleteAccount: "Delete account",
    logoutMenu: "Logout",
    homeMenu: "Home",
    gettingStartedMenu: "Getting started",
    apiReferenceMenu: "Api reference",
    gitHubMenu: "GitHub",
    editMenu: "Edit",
    deleteMenu: "Delete",
    banMenu: "Ban",
    approveMenu: "Approve",
    featuredMenu: "Mark featured",
    removeFeaturedMenu: "Remove featured",
    accountSettingsMenu: "Account settings",
    dashboardMenu: "Dashboard",
    userProfileMenu: "User profile",
    deletedPostsMenu: "Deleted posts",
    ...runPostTypesConfigSync({action:"getConstants", rKey:"menus"}).reduce((a, v) => {return {...a, ...v}}, {})
};

export default menus;
