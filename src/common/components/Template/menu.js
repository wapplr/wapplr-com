import HomeIcon from "@material-ui/icons/Home";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CodeIcon from "@material-ui/icons/Code";
import GitHubIcon from "@material-ui/icons/GitHub";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PostAddIcon from "@material-ui/icons/PostAdd";

function getMenu(props = {}) {

    const {appContext} = props;
    const {menus, routes} = appContext;

    return [
        {
            name: menus.homeMenu,
            href: "/",
            Icon: HomeIcon
        },
        {
            name: menus.gettingStartedMenu,
            href: "/installing",
            Icon: AddCircleIcon
        },
        {
            name: menus.apiReferenceMenu,
            href: "/api",
            Icon: CodeIcon
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
