import React, {useContext, useEffect, useState} from "react";
import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";
import Logo from "wapplr-react/dist/common/Logo";
import Log from "wapplr-react/dist/common/Log";

import clsx from "clsx";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from '@material-ui/icons/Close';

import {storage} from "../../utils/localStorage";

import {withMaterialTheme, withMaterialStyles} from "./withMaterial";
import {materialTheme, materialMediaQuery} from "./materialTheme";
import style from "./style.css";
import materialStyle from "./materialStyle";

import menu from "./menu";

function Template(props) {

    const {
        subscribe,
        children,
        title = "WAPPLR",
        materialStyle,
        // eslint-disable-next-line no-unused-vars
        url,
    } = props;
    //const materialTheme = useTheme();

    const context = useContext(WappContext);
    const utils = getUtils(context);

    const {wapp} = context;
    const {siteName = "Wapplr"} = wapp.config;
    const copyright = `${siteName} ${new Date().getFullYear()} ©`;

    wapp.styles.use(style);

    const [open, setOpen] = useState(false);
    const [sticky, setSticky] = useState((typeof window !== "undefined") ? (window.scrollY > 0) : false);
    const [narrow, setNarrow] = useState((typeof window !== "undefined") ? (window.innerWidth <= 640) : false);
    const [user, setUser] = useState(utils.getRequestUser());

    function handleDrawerClose() {
        setOpen(false);
        storage({drawerOpen: false});
    }

    function handleDrawerToggle() {
        setOpen(!open);
        storage({drawerOpen: !open});
    }

    function onScroll(e) {
        if (window.scrollY > 0) {
            setSticky(true);
        } else {
            setSticky(false);
        }
    }

    function onResize(e) {
        if (window.innerWidth > 640) {
            setNarrow(false);
        } else {
            setNarrow(true);
        }
    }

    function onClick(e, menu) {

        if (menu.onClick){
            return menu.onClick(e, utils);
        }

        const target = menu.target || "self";
        const href = menu.href;

        const inner = !(target === "_blank" || (href && href.slice(0,7) === "http://") || (href && href.slice(0,8) === "https://"));

        if (inner){

            if (narrow) {
                handleDrawerClose();
            }

            wapp.client.history.push({
                search:"",
                hash:"",
                ...wapp.client.history.parsePath(href)
            });

            e.preventDefault();

        }
    }

    function onUserChange(user){
        setUser((user?._id) ? user : null);
    }

    useEffect(function didMount(){
        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onResize);
        const unsub = subscribe.userChange(onUserChange);
        const storageDrawerOpen = storage().drawerOpen;
        if (typeof storageDrawerOpen == "boolean" && open !== storageDrawerOpen){
            setOpen(storageDrawerOpen);
        }
        return function willUnmount() {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            unsub();
        }
    }, [open, subscribe, user]);

    return (

        <div className={materialStyle.root}>
            <AppBar
                position={"fixed"}
                className={
                    clsx(
                        materialStyle.appBar,
                        {[materialStyle.appBarSticky]: sticky},
                    )}
            >
                <Toolbar>
                    <IconButton
                        color={"inherit"}
                        aria-label={"open drawer"}
                        onClick={handleDrawerToggle}
                        className={clsx(materialStyle.menuButton, {
                            [materialStyle.hide]: open,
                        })}
                    >
                        {(open) ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <div className={style.logo}>
                        <Logo />
                    </div>
                    <Typography variant={"h6"} noWrap>
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant={"permanent"}
                className={clsx(materialStyle.drawer, {
                    [materialStyle.drawerAbsolute]: narrow,
                },{
                    [materialStyle.drawerOpen]: open,
                    [materialStyle.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [materialStyle.drawerOpen]: open,
                        [materialStyle.drawerClose]: !open,
                    })
                }}
                open={open}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <div className={materialStyle.drawerContainer}>
                    <div className={materialStyle.toolbar} />
                    <Divider />
                    <List>
                        {[...menu.map(function (menu, key) {

                            const target = menu.target || "self";
                            const href = menu.href;
                            const Icon = menu.Icon;
                            const show = (menu.role) ? menu.role({user}) : true;
                            const name = (typeof menu.name == "function") ? menu.name({user}) : menu.name;

                            if (show) {

                                return (
                                    <ListItem
                                        button
                                        component={"a"}
                                        key={key}
                                        target={target}
                                        href={href}
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
                                        <ListItemText primary={name}/>
                                    </ListItem>
                                )

                            }

                            return null;

                        })]}
                    </List>
                </div>
            </Drawer>
            <div
                className={clsx(materialStyle.drawerLayer, {
                    [materialStyle.drawerLayerShow]: narrow && open,
                })}
                onClick={handleDrawerClose}
            />
            <main className={materialStyle.content}>
                <div className={style.page}>
                    <div className={clsx(style.pagePaddingTop, materialStyle.pagePaddingTop)} />
                    <div className={style.pageContent}>
                        {children}
                    </div>
                </div>
                <footer className={style.footer}>
                    <div className={style.footerOneColumn}>
                        <div className={style.copyright}>
                            {copyright}
                        </div>
                        {(wapp.globals.DEV) ?
                            <div className={style.log}>
                                <Log Parent={null} Logo={null } />
                            </div> : null
                        }
                    </div>
                </footer>
            </main>
        </div>
    )
}

const WappComponent = withWapp(Template);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

const ThemedComponent = withMaterialTheme(
    {
        theme: materialTheme,
        mediaQuery: materialMediaQuery},
    StyledComponent
);

export default ThemedComponent;
