import React, {useContext, useState, useEffect} from "react";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

import getStatus from "../../../utils/getStatus";

import {withMaterialStyles} from "../../Template/withMaterial";
import PostContext from "../../Post/context";
import AppContext from "../../App/context";

import Avatar from "../../Avatar";
import Dialog from "../../Dialog";
import getDefaultMenu, {getMenuProps} from "../../Post/menu";
import Menu from "../../Menu";

import materialStyle from "./materialStyle";
import style from "./style.css";

function Posts(props) {

    const postContext = useContext(PostContext);
    // eslint-disable-next-line no-unused-vars
    const {user, post, parentRoute, statusManager} = postContext;

    const context = useContext(WappContext);
    const appContext = useContext(AppContext);
    // eslint-disable-next-line no-unused-vars
    const utils = getUtils(context);
    // eslint-disable-next-line no-unused-vars
    const {subscribe, materialStyle, name = "post"} = props;

    const {wapp, req} = context;

    wapp.styles.use(style);

    const [posts, setPosts] = useState(utils.getGlobalState().res.responses && utils.getGlobalState().res.responses[name+"FindMany"]);

    function onRequestResolved({value}) {
        const keys = [name+"FindMany"];
        const response = value;
        let foundEnabledKeys = false;
        keys.forEach(function (requestName) {
            if (!foundEnabledKeys && response && response[requestName]){
                foundEnabledKeys = true;
                if (requestName === name+"FindMany"){
                    const newPosts = [...response[requestName]];
                    setPosts(newPosts);
                }
            }
        })
    }

    useEffect(function (){
        const unsub = subscribe.requestResolved(onRequestResolved);
        return function useUnsubscribe(){
            unsub();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post]);

    function onClick(e, post) {

        wapp.client.history.push({
            search:"",
            hash:"",
            ...wapp.client.history.parsePath(appContext.routes[name+"Route"]+"/"+post._id)
        });

        e.preventDefault();
    }

    const dialog = {
        actions: {}
    };

    const dialogEffect = function ({actions}) {
        dialog.actions = actions;
    };

    return (
        <div className={style.posts}>
            {(posts?.length) ?
                <div>
                    <List dense={true}>
                        {posts.map(function (post, i){

                            const wappRequest = req.wappRequest;
                            const {path} = wappRequest;

                            const status = getStatus({user, post, appContext, statusManager});
                            const menuActions = {};

                            const menu = getDefaultMenu({
                                statusManager,
                                ...getMenuProps({
                                    appContext,
                                    menuActions,
                                    dialog,
                                    utils,
                                    name,
                                    post,
                                    redirects: {
                                        onDeleteSuccess: path,
                                        onBanSuccess: path,
                                        onApproveSuccess: path,
                                        onFeaturedSuccess: path,
                                        onRemoveFeaturedSuccess: path,
                                    }
                                }),
                                getEditHref: function (p) {
                                    const r = (p?.post?._id) ? "/" + p.post._id + "/edit" : "/";
                                    return r + "?redirect=" + path;
                                }
                            });

                            menu.forEach((m)=>{delete m.featured});

                            return (
                                <ListItem
                                    key={i}
                                    classes={{
                                        container: materialStyle.listItem,
                                        root: materialStyle.listItemRoot
                                    }}
                                    onClick={(e) => onClick(e, post)}
                                >
                                    <ListItemAvatar>
                                        <Avatar user={post._author}/>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={post.title || "No title"}
                                        secondary={
                                            <React.Fragment>
                                                <span className={materialStyle.block}>{post.subtitle || "No subtitle"}</span>
                                                {(status) ? <span className={materialStyle.block}>{status}</span> : null}
                                            </React.Fragment>
                                        }
                                        classes={{
                                            primary: materialStyle.title,
                                            secondary: materialStyle.subtitle,
                                        }}
                                    />
                                    <ListItemSecondaryAction>
                                        <Menu
                                            parentRoute={appContext.routes[name+"Route"]}
                                            menu={menu}
                                            materialStyle={materialStyle}
                                            menuProperties={{user, post}}
                                            effect={function ({actions}) {
                                                menuActions.actions = actions;
                                            }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                    <Dialog effect={dialogEffect} />
                </div>
                :
                <div className={style.thereAreNoEntries}>
                    <Typography variant={"subtitle1"}>
                        {appContext.messages.thereAreNoEntries}
                    </Typography>
                </div>
            }
        </div>
    )
}

const WappComponent = withWapp(Posts);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
