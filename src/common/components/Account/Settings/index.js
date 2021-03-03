import React, {useContext} from "react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import getUserName from "../../../utils/getUserName";
import {withMaterialStyles} from "../../Template/withMaterial";
import Avatar from "../../Avatar/me";
import AppContext from "../../App/context";

import materialStyle from "./materialStyle";
import style from "./style.css";
import AccountContext from "../context";
import Menu from "../../Menu";
import getMenu from "../menu";

function Profile(props) {

    const {
        materialStyle,
        logout
    } = props;

    const accountContext = useContext(AccountContext);
    const {user, parentRoute, name, page} = accountContext;

    const appContext = useContext(AppContext);
    const context = useContext(WappContext);
    const utils = getUtils(context);

    const {wapp} = context;

    async function onSubmit(e) {
        e.preventDefault();
        await utils.logout({requestName: name+"Logout", redirect: {pathname: parentRoute, search:"", hash:""}});
    }

    wapp.styles.use(style);

    return (
        <div className={style.settings}>
            {(!logout) ?
                <div className={style.menu}>
                    <Menu
                        parentRoute={parentRoute}
                        menu={getMenu({appContext})}
                        materialStyle={materialStyle}
                        menuProperties={{user, page}}
                        list={true}
                    />
                </div>
                :
                <form className={style.form}
                      autoComplete={"off"}
                      noValidate
                      onSubmit={onSubmit}
                >
                    <Button
                        className={materialStyle.logoutSubmit}
                        variant={"contained"}
                        color={"secondary"}
                        onClick={onSubmit}
                        type={"submit"}
                    >
                        {appContext.labels.logoutSubmitLabel}
                    </Button>
                </form>
            }
        </div>
    )
}

const WappComponent = withWapp(Profile);

const StyledComponent = withMaterialStyles(materialStyle, WappComponent);

export default StyledComponent;
