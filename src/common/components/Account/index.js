import React, {useContext, useEffect, useState} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";

import {withMaterialStyles} from "../Template/withMaterial";

import AppContext from "../App/context";
import Menu from "../Menu";

import style from "./style.css";
import materialStyle from "./materialStyle";

import AccountContext from "./context";

import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ChangeData from "./ChangeData";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import EmailConfirmation from "./EmailConfirmation";

import menu from "./menu";
import NotFound from "../NotFound";

const pages = {
    forgotpassword: ForgotPassword,
    resetpassword: ResetPassword,
    changedata: ChangeData,
    changeemail: ChangeEmail,
    changepassword: ChangePassword,
    emailconfirmation: EmailConfirmation,
    profile: Profile,
    signup: Signup,
    login: Login
};

function router({user, page}) {

    function renderWithUser() {
        if (!page) {
            return "profile";
        }
        if (["forgotpassword", "resetpassword", "changedata", "changeemail", "changepassword", "emailconfirmation", "logout", "login", "signup"].indexOf(page) > -1){
            if (page === "logout" || page === "login" || page === "signup"){
                return "profile"
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

function Router(props) {

    const accountContext = useContext(AccountContext);
    const {user} = accountContext;
    const {page} = props;

    const pageName = router({user, page})
    const Page = (pageName) ? pages[pageName] : null;

    return (Page) ? <Page /> : null;
}

function Account(props) {

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);

    const {
        parentRoute = appContext.routes.accountRoute,
        // eslint-disable-next-line no-unused-vars
        url
    } = props;

    const utils = getUtils(context);
    const {subscribe, materialStyle} = props;

    const {wapp, req, res} = context;

    wapp.styles.use(style);

    const [user, setUser] = useState(utils.getRequestUser());

    function onUserChange(user){
        setUser((user?._id) ? user : null);
    }

    useEffect(function (){
        const unsub = subscribe.userChange(onUserChange);
        return function useUnsubscribe(){
            unsub();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    function getTitle() {

        const page = res.wappResponse.route.params.page;
        const pageName = router({user, page});

        if (pageName === "login") {
            return appContext.titles.loginTitle;
        }

        if (pageName === "signup") {
            return appContext.titles.signupTitle;
        }

        if (pageName === "changedata") {
            return appContext.titles.changeDataTitle;
        }

        if (pageName === "changeemail") {
            return appContext.titles.changeEmailTitle;
        }

        if (pageName === "logout") {
            return appContext.titles.logoutTitle;
        }

        if (pageName === "resetpassword") {
            return appContext.titles.resetPasswordTitle;
        }

        if (pageName === "forgotpassword") {
            return appContext.titles.forgotPasswordTitle;
        }

        if (pageName === "emailconfirmation") {
            return appContext.titles.emailConfirmationTitle;
        }

        return "";
    }

    const page = res.wappResponse.route.params.page;

    const pageName = router({user, page});

    if (!pageName){
        res.wappResponse.status(404)
    }

    return (
        <>
            {(pageName) ?
                <div className={style.account}>
                    <Container fixed className={materialStyle.container} maxWidth={"sm"}>
                        <Paper elevation={3}>
                            <AppBar position={"relative"}
                                    className={materialStyle.appBar}
                            >
                                <Toolbar>
                                    <div className={style.titleContainer}>
                                        <div className={style.title}>
                                            <Typography variant="h6" className={materialStyle.title}>
                                                {getTitle()}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Menu
                                        parentRoute={parentRoute}
                                        menu={menu}
                                        materialStyle={materialStyle}
                                        menuProperties={{user, page}}
                                    />
                                </Toolbar>
                            </AppBar>
                            <AccountContext.Provider value={{user, parentRoute, name:"user"}}>
                                <div className={style.content}>
                                    <Router page={page}/>
                                </div>
                            </AccountContext.Provider>
                        </Paper>
                    </Container>
                </div>
                :
                <NotFound />
            }
        </>
    )
}

const WappComponent = withWapp(Account);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
