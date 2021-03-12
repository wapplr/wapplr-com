import {runPostTypesConfigSync} from "../../postTypes";

const labels = {
    logoutSubmitLabel: "Logout",
    forgotPasswordSubmitLabel: "Send reset key",
    resetPasswordSubmitLabel: "Reset password",
    changeEmailSubmitLabel: "Change email",
    changePasswordSubmitLabel: "Change password",
    emailConfirmationSubmitLabel: "Confirm email",
    deleteAccountLabel: "Delete account",
    emailConfirmationSendAgainSubmitLabel: "Send confirmation key to new email address again",
    entryTitleLabel: "Title",
    entrySubtitleLabel: "Subtitle",
    entryContentLabel: "Content",
    newEntrySubmitLabel: "Save",
    restoreEntrySubmitLabel: "Restore",
    notFoundButtonBack: "Previous page",
    notFoundButtonHome: "Home page",
    notFoundButtonLogin: "Login",
    notFoundButtonSignup: "Signup",
    cancelText: "Cancel",
    deleteText: "Delete",
    banText: "Ban",
    approveText: "Approve",
    markText: "Mark",
    removeMarkText: "Remove mark",
    ...runPostTypesConfigSync({action:"getConstants", rKey:"labels"}).reduce((a, v) => {return {...a, ...v}}, {})
};

export default labels;
