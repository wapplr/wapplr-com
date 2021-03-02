import React, {useContext, useState, useEffect} from "react";

import {WappContext} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import MaterialMenu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import style from "./style.css";
import materialStyle from "./materialStyle"
import {withMaterialStyles} from "../Template/withMaterial";

function Menu(props) {

    const context = useContext(WappContext);
    const utils = getUtils(context);
    const {wapp} = context;

    wapp.styles.use(style);

    const {
        parentRoute = "",
        menu = [],
        materialStyle = {},
        menuProperties = {},
        effect
    } = props;

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
        const href = (typeof menu.href == "function") ? menu.href(menuProperties) : menu.href;

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

    const actions = {
        close: handleMenuClose
    }

    useEffect(function () {
        if (props.effect){
            props.effect({
                actions
            })
        }
    })

    const featuredMenus = [...menu.filter(function (menu, key) {return !!(menu.featured)})];
    const showFeaturedMenu = [...featuredMenus.filter(function (menu, key) {return (menu.role) ? menu.role(menuProperties) : true})];

    const moreMenus = [...menu.filter(function (menu, key) {return !(menu.featured)})];
    const showMoreMenu = [...moreMenus.filter(function (menu, key) {return (menu.role) ? menu.role(menuProperties) : true})];

    return (
        <>  {
            (showFeaturedMenu.length) ?
                [...featuredMenus.map(function (menu, key) {

                    const target = menu.target || "self";
                    const href = (typeof menu.href == "function") ? menu.href(menuProperties) : menu.href;
                    const Icon = menu.Icon;
                    const show = (menu.role) ? menu.role(menuProperties) : true;

                    const inner = !(target === "_blank" || (href && href.slice(0,7) === "http://") || (href && href.slice(0,8) === "https://"));

                    if (show) {

                        return (
                            <IconButton
                                key={"featured"+key}
                                component={"a"}
                                color={"inherit"}
                                onClick={function (e) {
                                    onClick(e, menu)
                                }}
                                href={(inner) ? parentRoute + href : href}
                            >
                                {(Icon) ? <Icon/> : null}
                            </IconButton>
                        )

                    }

                    return null;

                })]
                :
                null
        }
            {
                (showMoreMenu.length > 0) ?
                    <>
                        <IconButton
                            color={"inherit"}
                            onClick={handleMenuOpen}
                            aria-controls={"post-menu"}
                            aria-haspopup={"true"}
                            aria-label={"post-menu"}
                        >
                            <MoreIcon />
                        </IconButton>
                        <MaterialMenu
                            id={"post-menu"}
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {[...moreMenus.map(function (menu, key) {

                                const target = menu.target || "self";
                                const href = (typeof menu.href == "function") ? menu.href(menuProperties) : menu.href;
                                const Icon = menu.Icon;
                                const show = (menu.role) ? menu.role(menuProperties) : true;

                                const inner = !(target === "_blank" || (href && href.slice(0,7) === "http://") || (href && href.slice(0,8) === "https://"));

                                if (show) {

                                    return (
                                        <MenuItem
                                            button
                                            component={"a"}
                                            key={"menu"+key}
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
                        </MaterialMenu>
                    </>
                    :
                    null
            }
        </>
    )
}

export default withMaterialStyles(materialStyle, Menu);
