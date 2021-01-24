import React, {useContext, useEffect, useState} from "react";
import {WappContext, withWapp} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";
import Logo from "wapplr-react/dist/common/Logo";

import style from "./template.css";

function Template(props) {

    const context = useContext(WappContext);
    const {wapp} = context;
    const utils = getUtils(context);
    const {children, subscribe} = props;
    const {styles} = wapp;
    const {siteName = "Wapplr", footerMenu = []} = wapp.config;
    const copyright = `${siteName} ${new Date().getFullYear()} ©`;

    styles.use(style);
    const defaultUser = utils.getRequestUser()?._id;

    const [user, setUser] = useState(defaultUser);

    async function onChangeUser(user) {
        await setUser((user?._id) ? user._id : null);
    }

    function onScroll(e) {
        const header = document.querySelector("." + style.header);
        header.classList.toggle(style.sticky, window.scrollY > 0 )
    }

    useEffect(function didMount(){
        const unsub = subscribe.changeUser(onChangeUser);
        window.addEventListener("scroll", onScroll);
        return function willUnmount() {
            unsub();
            window.removeEventListener("scroll", onScroll);
        }
    }, [user]);

    return (
        <div className={style.page}>
            <header className={style.header}>
                <div className={style.innerHeader}>
                    <div className={style.logo}>
                        <Logo />
                    </div>
                </div>
            </header>
            <main className={style.content}>{children}</main>
            <footer className={style.footer}>
                <div>
                    <div className={style.menu}>
                        {[...footerMenu.map(function (menu, key) {

                            const target = menu.target || "self";
                            const noReferrer = (target === "_blank") ? "noreferrer" : null;
                            const show = menu.role ? menu.role({user: {_id: user}}) : true;
                            const href = menu.href;

                            if (show){

                                return (
                                    <div key={key}>
                                        <a className={style.button}
                                           target={target}
                                           href={href}
                                           rel={noReferrer}
                                           onClick={function (e) {
                                               const inner = !(target === "_blank" || (href && href.slice(0,7) === "http://") || (href && href.slice(0,8) === "https://"));

                                               if (inner){

                                                   wapp.client.history.push({
                                                       search:"",
                                                       href:"",
                                                       ...wapp.client.history.parsePath(href)
                                                   });

                                                   e.preventDefault();

                                               }
                                           }}
                                        >
                                            {menu.name}
                                        </a>
                                    </div>
                                )

                            }

                            return null;

                        })]}
                    </div>
                    <div className={style.copyright}>
                        {copyright}
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default withWapp(Template)
