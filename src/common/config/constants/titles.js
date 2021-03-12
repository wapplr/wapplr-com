import {runPostTypesConfigSync} from "../../postTypes";

const titles = {
    loginTitle: "Login",
    accountTitle: "Account settings",
    changeDataTitle: "Change data",
    changeEmailTitle: "Change email",
    emailConfirmationTitle: "Email confirmation",
    signupTitle: "Signup",
    logoutTitle: "Logout",
    forgotPasswordTitle: "Forgot password",
    resetPasswordTitle: "Reset password",
    changePasswordTitle: "Change password",
    deleteAccountTitle: "Delete account",
    homeTitle: "Home",
    statusBannedTitle: "Banned",
    statusDeletedTitle: "Deleted",
    statusAuthorDeletedTitle: "Author deleted",
    statusMissingDataTitle: "Missing data",
    statusApprovedTitle: "Approved",
    statusFeaturedTitle: "Featured",
    statusCreatedTitle: "Created",
    dialogDeleteEntryTitle: "Delete entry",
    dialogBanEntryTitle: "Ban entry",
    dialogApproveEntryTitle: "Approve entry",
    dialogMarkFeaturedEntryTitle: "Mark entry to featured",
    dialogRemoveMarkFeaturedEntryTitle: "Remove featured mark of entry",
    dialogDeleteAccountTitle: "Delete account",
    userProfileTitle: "User profile",
    dashboardTitle: "Dashboard",
    ...runPostTypesConfigSync({action:"getConstants", rKey:"titles"}).reduce((a, v) => {return {...a, ...v}}, {})
};

export default titles;
