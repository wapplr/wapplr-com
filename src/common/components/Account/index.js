import React, {useContext, useEffect, useState} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

import getStatus from "../../utils/getStatus";
import getUserName from "../../utils/getUserName";

import {withMaterialStyles} from "../Template/withMaterial";

import AppContext from "../App/context";
import Menu from "../Menu";
import NotFound from "../NotFound";
import Avatar from "../Avatar/me";

import style from "./style.css";
import materialStyle from "./materialStyle";

import AccountContext from "./context";
import {getPageName} from "./utils";
import getMenu from "./menu";

import Router from "./Router";

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

function Account(props) {

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);

    const {
        parentRoute = appContext.routes.accountRoute,
        name = "user"
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
    }, [user]);

    function getTitle() {

        const page = res.wappResponse.route.params.page;
        const pageName = getPageName({user, page});

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

    const pageName = getPageName({user, page});

    if (!pageName){
        res.wappResponse.status(404)
    }

    const userName = getUserName(user);

    const avatarClick = (e) => {
        wapp.client.history.push({pathname: appContext.routes.userRoute + "/" + user._id, search:"", hash:""})
    };

    const backClick = (e) => {
        wapp.client.history.push({pathname: (pageName === "settings") ? appContext.routes.userRoute + "/" + user._id : appContext.routes.accountRoute, search:"", hash:""})
    };

    const statusManager = wapp.getTargetObject().postTypes.findPostType({name: name}).statusManager;

    return (
        <>
            {(pageName) ?
                <div className={style.account}>
                    <Container fixed className={materialStyle.container} maxWidth={"sm"}>
                        <Paper elevation={3}>
                            {
                                (user?._id) ?
                                    <div className={style.userLayout}>
                                        <div className={style.userBox}>
                                            <div className={style.avatar} onClick={avatarClick}>
                                                <Avatar size={"big"}/>
                                            </div>
                                            <div className={style.userNameContainer}>
                                                <div className={style.userName} onClick={avatarClick}>
                                                    <Typography variant="h5" >
                                                        {userName}
                                                    </Typography>
                                                </div>
                                                {(getStatus({user, post:user, appContext, statusManager})) ?
                                                    <div className={style.status}>
                                                        <Typography variant={"subtitle1"} color={"textSecondary"} >
                                                            {getStatus({user, post:user, appContext, statusManager})}
                                                        </Typography>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    : null
                            }
                            <AppBar position={"relative"}
                                    className={materialStyle.appBar}
                            >
                                {(pageName !== "logout") ?
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
                                    :
                                    null
                                }
                            </AppBar>
                            <AccountContext.Provider value={{user, parentRoute, name, page, statusManager}}>
                                <div className={style.content}>
                                    <Router page={page} router={getPageName} pages={pages}/>
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
