export function getPageName({user, page}) {

    function renderWithUser() {
        if (!page) {
            return "settings";
        }
        if (["forgotpassword", "resetpassword", "changedata", "changeemail", "changepassword", "emailconfirmation", "logout", "login", "signup", "deleteaccount"].indexOf(page) > -1){
            if (page === "login" || page === "signup"){
                return "settings"
            }
            return page;
        }
        return null;
    }

    function renderWithoutUser() {
        if (!page) {
            return "login";
        }
        if (["login", "signup", "forgotpassword", "resetpassword", "emailconfirmation"].indexOf(page) > -1){
            return page;
        }
        return null;
    }

    return (!user) ? renderWithoutUser() : renderWithUser();

}
