import {runPostTypesConfigSync} from "../../postTypes";

const messages = {
    forgotPasswordSuccessMessage: "The message has been sent to your email address",
    resetPasswordSuccessMessage: "Your password has been updated",
    changePasswordSuccessMessage: "Your password has been updated",
    changeEmailSuccessMessage: "Your email has been updated",
    changeDataSuccessMessage: "Your data has been updated",
    emailConfirmationSuccessMessage: "Your email has been confirmed",
    emailConfirmationSendAgainSuccessMessage: "Your email confirmation key has been sent again",
    deleteAccountSuccessMessage: "Your account has been deleted",
    saveEntrySuccessMessage: "The entry has been updated",
    newEntrySuccessMessage: "The new entry has been saved",
    validationEntryTitle: "Minimum 1 max 250 characters",
    validationEntrySubtitle: "Minimum 1 max 250 characters",
    validationEntryContent: "Minimum 1 max 20000 characters",
    notFoundNotAvailable: "This content is not available",
    notFoundLoginText: "Log in to your account because there are pages that can only be seen with permission",
    deleteEntrySuccess: "This entry has been deleted",
    deleteEntryQuestion: "Are you sure want to delete this entry?",
    banEntrySuccess: "This entry has been banned",
    banEntryQuestion: "Are you sure want to ban this entry?",
    approveEntrySuccess: "This entry has been approved",
    approveEntryQuestion: "Are you sure want to approve this entry?",
    markFeaturedEntrySuccess: "This entry has been marked to featured",
    markFeaturedEntryQuestion: "Are you sure want to mark this entry to featured?",
    removeMarkFeaturedEntrySuccess: "The featured mark of this entry has been removed",
    removeMarkFeaturedEntryQuestion: "Are you sure want to remove featured mark of this entry?",
    deleteAccountQuestion: "Are you sure want to delete your account?",
    deleteAccountSuccess: "Your account has been deleted",
    thereAreNoEntries:"There are no entries",
    ...runPostTypesConfigSync({action:"getConstants", rKey:"messages"}).reduce((a, v) => {return {...a, ...v}}, {})
};

export default messages;
