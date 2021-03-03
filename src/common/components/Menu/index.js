import React, {useContext, useState, useEffect} from "react";

import {WappContext} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import MaterialMenu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
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
        list,
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
        const disableParentRoute = menu.disableParentRoute;
        const inner = !(target === "_blank" || (href && href.slice(0,7) === "http://") || (href && href.slice(0,8) === "https://"));

        if (inner){

            wapp.client.history.push({
                search:"",
                hash:"",
                ...wapp.client.history.parsePath((disableParentRoute) ? href : parentRoute + href)
            });

            setAnchorEl(null);
            e.preventDefault();

        }
    }

    const actions = {
        close: handleMenuClose
    }

    useEffect(function () {
        if (effect){
            effect({
                actions
            })
        }
    })

    const featuredMenus = [...menu.filter(function (menu, key) {return !!(menu.featured && !list)})];
    const showFeaturedMenu = [...featuredMenus.filter(function (menu, key) {return (menu.role) ? menu.role(menuProperties) : true})];

    const moreMenus = [...menu.filter(function (menu, key) {return !(menu.featured && !list)})];
    const showMoreMenu = [...moreMenus.filter(function (menu, key) {return (menu.role) ? menu.role(menuProperties) : true})];

    const MenuComponent = (list) ? List : MaterialMenu;
    const ItemComponent = (list) ? ListItem : MenuItem;
    const menuComponentProps = (list) ? {} : {
        anchorEl,
        keepMounted: true,
        open:Boolean(anchorEl),
        onClose:handleMenuClose
    }

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
                                onClick={function (e) {onClick(e, menu);}}
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
                        {(!list) ?
                            <IconButton
                                color={"inherit"}
                                onClick={handleMenuOpen}
                                aria-controls={"post-menu"}
                                aria-haspopup={"true"}
                                aria-label={"post-menu"}
                            >
                                <MoreIcon />
                            </IconButton>
                            : null
                        }
                        <MenuComponent
                            id={"post-menu"}
                            {...menuComponentProps}
                        >
                            {[...moreMenus.map(function (menu, key) {

                                const target = menu.target || "self";
                                const href = (typeof menu.href == "function") ? menu.href(menuProperties) : menu.href;
                                const Icon = menu.Icon;
                                const show = (menu.role) ? menu.role(menuProperties) : true;
                                const inner = !(target === "_blank" || (href && href.slice(0,7) === "http://") || (href && href.slice(0,8) === "https://"));

                                if (show) {

                                    return (
                                        <ItemComponent
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
                                        </ItemComponent>
                                    )

                                }

                                return null;

                            })]}
                        </MenuComponent>
                    </>
                    :
                    null
            }
        </>
    )
}

export default withMaterialStyles(materialStyle, Menu);
