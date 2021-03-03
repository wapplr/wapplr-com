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
import Settings from "./Settings";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ChangeData from "./ChangeData";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import EmailConfirmation from "./EmailConfirmation";
import DeleteAccount from "./DeleteAccount";
import Logout from "./Logout";

import getMenu from "./menu";
import NotFound from "../NotFound";
import Avatar from "../Avatar/me";
import getUserName from "../../utils/getUserName";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

const pages = {
    forgotpassword: ForgotPassword,
    resetpassword: ResetPassword,
    changedata: ChangeData,
    changeemail: ChangeEmail,
    changepassword: ChangePassword,
    emailconfirmation: EmailConfirmation,
    deleteaccount: DeleteAccount,
    settings: Settings,
    signup: Signup,
    login: Login,
    logout: Logout
};

function router({user, page}) {

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

    const {wapp, res} = context;

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

        if (pageName === "changepassword") {
            return appContext.titles.changePasswordTitle;
        }

        if (pageName === "emailconfirmation") {
            return appContext.titles.emailConfirmationTitle;
        }

        if (pageName === "deleteaccount") {
            return appContext.titles.deleteAccountTitle;
        }

        if (pageName === "settings") {
            return appContext.titles.accountTitle;
        }

        return "";
    }

    const page = res.wappResponse.route.params.page;

    const pageName = router({user, page});

    if (!pageName){
        res.wappResponse.status(404)
    }

    const userName = getUserName(user);

    function getStatus() {

        const isNotDeleted = user?._status_isNotDeleted;
        const isValidated = user?._status_isValidated;

        return (!isNotDeleted) ?
            appContext.titles.statusDeletedTitle :
            (!isValidated) ?
                appContext.titles.statusMissingDataTitle :
                null
    }

    const avatarClick = (e) => {
        wapp.client.history.push({pathname: appContext.routes.userRoute + "/" + user._id, search:"", hash:""})
    }

    const backClick = (e) => {
        wapp.client.history.push({pathname: (pageName === "settings") ? appContext.routes.userRoute + "/" + user._id : appContext.routes.accountRoute, search:"", hash:""})
    }

    return (
        <>
            {(pageName) ?
                <div className={style.account}>
                    <Container fixed className={materialStyle.container} maxWidth={"sm"}>
                        <Paper elevation={3}>
                            {
                                (user?._id) ?
                                    <div>
                                        <div className={style.userBox}>
                                            <div className={style.avatar} onClick={avatarClick}>
                                                <Avatar size={"big"}/>
                                            </div>
                                            <div className={style.userName} onClick={avatarClick}>
                                                <Typography variant="h5" >
                                                    {userName}
                                                </Typography>
                                            </div>
                                            {(getStatus()) ?
                                                <div className={style.status}>
                                                    <Typography variant={"subtitle1"} color={"textSecondary"} >
                                                        {getStatus()}
                                                    </Typography>
                                                </div>
                                                :
                                                null
                                            }
                                        </div>
                                    </div>
                                    : null
                            }
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
                                    {(user?._id && pageName !== "settings") ?
                                        <div>
                                            <IconButton
                                                color={"inherit"}
                                                onClick={backClick}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </div>
                                        :
                                        null
                                    }
                                    {(pageName !== "settings") ?
                                        <Menu
                                            parentRoute={parentRoute}
                                            menu={getMenu({appContext})}
                                            materialStyle={materialStyle}
                                            menuProperties={{user, page}}
                                        />
                                        :
                                        null
                                    }
                                </Toolbar>
                            </AppBar>
                            <AccountContext.Provider value={{user, parentRoute, name:"user", page}}>
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
