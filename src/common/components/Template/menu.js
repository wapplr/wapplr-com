import HomeIcon from "@material-ui/icons/Home";
import GitHubIcon from "@material-ui/icons/GitHub";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

function getMenu(props = {}) {

    const {appContext} = props;
    const {menus, routes} = appContext;

    return [
        {
            name: menus.gettingStartedMenu,
            href: "/",
            Icon: HomeIcon
        },
        {
            name: "GitHub",
            href: "https://github.com/wapplr/wapplr",
            target: "_blank",
            Icon: GitHubIcon
        },
        {
            name: menus.logoutMenu,
            href: routes.accountRoute + "/logout",
            role: function (p) {
                return p?.user?._id;
            },
            Icon: ExitToAppIcon
        },
    ];

}

export default getMenu;
