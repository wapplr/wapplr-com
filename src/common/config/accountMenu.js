import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from "@material-ui/icons/Email";

import menus from "./constants/menus";

const accountMenu = [
    {
        name: menus.loginMenu, href:"/login",
        role: function (p) {
            return !(p?.user?._id);
        },
        Icon: AccountCircleIcon
    },
    {
        name: menus.signupMenu, href:"/signup",
        role: function (p) {
            return !(p?.user?._id);
        },
        Icon: PersonAddIcon
    },
    {
        name: menus.myProfileMenu, href:"/",
        role: function (p) {
            return p?.user?._id;
        },
        Icon: AccountCircleIcon
    },
    {
        name: menus.changeData, href:"/changedata",
        role: function (p) {
            return p?.user?._id;
        },
        Icon: PersonIcon
    },
    {
        name: menus.changeEmail, href:"/changeemail",
        role: function (p) {
            return p?.user?._id;
        },
        Icon: EmailIcon
    },
    {
        name: menus.forgotPasswordMenu, href:"/forgotpassword",
        Icon: VpnKeyIcon
    },
    {
        name: menus.logoutMenu, href:"/logout",
        role: function (p) {
            return p?.user?._id;
        },
        Icon: ExitToAppIcon
    },
];

export default accountMenu;
