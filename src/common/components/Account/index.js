import React, {useContext, useEffect, useState} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";

import {withMaterialStyles} from "../Template/withMaterial";

import AppContext from "../App/context";

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

function Content(props) {

    const accountContext = useContext(AccountContext);
    const {user} = accountContext;
    const {page} = props;

    function renderWithUser() {
        switch (page) {
            case "forgotpassword":
                return ForgotPassword;
            case "resetpassword":
                return ResetPassword;
            case "changedata":
                return ChangeData;
            case "changeemail":
                return ChangeEmail;
            case "changepassword":
                return ChangePassword;
            default:
                return Profile;
        }
    }

    function renderWithoutUser() {
        switch (page) {
            case "signup":
                return Signup;
            case "forgotpassword":
                return ForgotPassword;
            case "resetpassword":
                return ResetPassword;
            default:
                return Login;
        }
    }

    const Page = (!user) ? renderWithoutUser() : renderWithUser();

    return <Page />
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
    const {accountMenu = []} = wapp.config;

    wapp.styles.use(style);

    const [user, setUser] = useState(utils.getRequestUser());
    const [anchorEl, setAnchorEl] = useState(null);

    function handleMenuOpen (event) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose () {
        setAnchorEl(null);
    }

    function onClick(e, menu) {

        if (menu.onClick){
            return menu.onClick(e, utils);
        }

        const target = menu.target || "self";
        const href = menu.href;

        const inner = !(target === "_blank" || (href && href.slice(0,7) === "http://") || (href && href.slice(0,8) === "https://"));

        if (inner){

            wapp.client.history.push({
                search:"",
                hash:"",
                ...wapp.client.history.parsePath(parentRoute + href)
            });

            setAnchorEl(null);
            e.preventDefault();

        }
    }

    function onUserChange(user){
        setUser((user?._id) ? user : null);
    }

    useEffect(function (){
        const unsub = subscribe.userChange(onUserChange);
        return function useUnsubscribe(){
            unsub();
        }
    }, [user])

    function getTitle() {

        const page = res.wappResponse.route.params.page;

        if (page === "login") {
            return (!user) ? appContext.titles.loginTitle : appContext.titles.accountTitle;
        }

        if (page === "signup") {
            return (!user) ? appContext.titles.signupTitle : appContext.titles.accountTitle;
        }

        if (page === "changedata") {
            return (!user) ? appContext.titles.loginTitle : appContext.titles.changeDataTitle;
        }

        if (page === "changeemail") {
            return (!user) ? appContext.titles.loginTitle : appContext.titles.changeEmailTitle;
        }

        if (page === "logout") {
            return (!user) ? appContext.titles.loginTitle : appContext.titles.logoutTitle;
        }

        if (page === "forgotpassword") {
            return appContext.titles.forgotPasswordTitle;
        }

        let title = res.wappResponse.content.title;
        if (typeof title == "function") {
            title = title({wapp, req, res});
            title = title.split(" | ")[0];
        }
        return title;
    }

    const page = res.wappResponse.route.params.page;

    return (
        <div className={style.account}>
            <Container fixed className={materialStyle.container} maxWidth={"sm"}>
                <Paper elevation={3}>
                    <AppBar position={"relative"}
                            className={materialStyle.appBar}
                    >
                        <Toolbar>
                            <IconButton
                                color={"inherit"}
                                onClick={handleMenuOpen}
                                aria-controls={"account-menu"}
                                aria-haspopup={"true"}
                                aria-label={"account-menu"}
                            >
                                <MoreIcon />
                            </IconButton>
                            <Menu
                                id={"account-menu"}
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                {[...accountMenu.map(function (menu, key) {

                                    const target = menu.target || "self";
                                    const href = menu.href;
                                    const Icon = menu.Icon;
                                    const show = (menu.role) ? menu.role({user}) : true;

                                    const inner = !(target === "_blank" || (href && href.slice(0,7) === "http://") || (href && href.slice(0,8) === "https://"));

                                    if (show) {

                                        return (
                                            <MenuItem
                                                button
                                                component={"a"}
                                                key={key}
                                                target={target}
                                                href={(inner) ? parentRoute + href : href}
                                                onClick={function (e) {
                                                    onClick(e, menu)
                                                }}
                                                className={materialStyle.listItem}
                                            >
                                                {(Icon) ?
                                                    <ListItemIcon className={materialStyle.listItemIcon}>
                                                        <Icon/>
                                                    </ListItemIcon> : null
                                                }
                                                <ListItemText primary={menu.name}/>
                                            </MenuItem>
                                        )

                                    }

                                    return null;

                                })]}
                            </Menu>
                            <Typography variant={"h6"}>
                                {getTitle()}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <AccountContext.Provider value={{user, parentRoute, name:"user"}}>
                        <div className={style.content}>
                            <Content page={page}/>
                        </div>
                    </AccountContext.Provider>
                </Paper>
            </Container>
        </div>
    )
}

const WappComponent = withWapp(Account);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
