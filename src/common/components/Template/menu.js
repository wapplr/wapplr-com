import HomeIcon from "@material-ui/icons/Home";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CodeIcon from "@material-ui/icons/Code";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import GitHubIcon from "@material-ui/icons/GitHub";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import Avatar from "../../components/Avatar/me";
import getUserName from "../../utils/getUserName";
import menus from "../../config/constants/menus";
import routes from "../../config/constants/routes";
import PostAddIcon from "@material-ui/icons/PostAdd";

const menu = [
    {
        name: function (p) {
            if (!p?.user?._id) {
                return menus.myProfileMenu;
            }
            return getUserName(p?.user);
        },
        href: routes.accountRoute,
        role: function (p) {
            return p?.user?._id;
        },
        Icon: Avatar
    },
    {
        name: menus.homeMenu,
        href:"/",
        Icon: HomeIcon
    },
    {
        name: menus.gettingStartedMenu,
        href:"/installing",
        Icon: AddCircleIcon
    },
    {
        name: menus.apiReferenceMenu,
        href:"/api",
        Icon: CodeIcon
    },
    {
        name: menus.newMenu,
        href: routes.postRoute + "/new",
        role: function (p) {
            return (p?.user?._id);
        },
        Icon: PostAddIcon
    },
    {
        name: menus.loginMenu,
        href: routes.accountRoute + "/login",
        role: function (p) {
            return !(p?.user?._id);
        },
        Icon: AccountCircleIcon
    },
    {
        name: "GitHub",
        href:"https://github.com/wapplr/wapplr",
        target:"_blank",
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

export default menu;
