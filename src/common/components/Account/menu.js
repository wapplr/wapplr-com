import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HelpIcon from "@material-ui/icons/Help";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";

function getMenu(props = {}) {

    const {appContext} = props;
    const {menus, routes} = appContext;

    return [
        {
            name: menus.loginMenu,
            href: "/login",
            role: function (p) {
                return !(p?.user?._id);
            },
            Icon: AccountCircleIcon
        },
        {
            name: menus.signupMenu,
            href: "/signup",
            role: function (p) {
                return !(p?.user?._id);
            },
            Icon: PersonAddIcon
        },
        {
            name: menus.myProfileMenu,
            href: function (p) {
                return routes.userRoute + "/" + p?.user?._id;
            },
            role: function (p) {
                return p?.user?._id && p?.user?._status_isNotDeleted;
            },
            Icon: AccountCircleIcon,
            disableParentRoute: true
        },
        {
            name: menus.accountSettingsMenu,
            href: function (p) {
                return routes.accountRoute
            },
            role: function (p) {
                if (!p.page){return false;}
                return p?.user?._id && p?.user?._status_isNotDeleted;
            },
            Icon: SettingsIcon,
            disableParentRoute: true
        },
        {
            name: menus.changeData, href: "/changedata",
            role: function (p) {
                return p?.user?._id && p?.user?._status_isNotDeleted;
            },
            Icon: PersonIcon
        },
        {
            name: menus.changeEmail, href: "/changeemail",
            role: function (p) {
                return p?.user?._id && p?.user?._status_isNotDeleted;
            },
            Icon: EmailIcon
        },
        {
            name: menus.emailConfirmation, href: "/emailconfirmation",
            role: function (p) {
                return p?.user?._id && !p?.user?.emailConfirmed && p?.user?._status_isNotDeleted;
            },
            Icon: CheckCircleIcon
        },
        {
            name: menus.changePassword, href: "/changepassword",
            role: function (p) {
                return p?.user?._id && p?.user?._status_isNotDeleted;
            },
            Icon: LockIcon
        },
        {
            name: menus.forgotPasswordMenu, href: "/forgotpassword",
            role: function (p) {
                return p?.user?._status_isNotDeleted || !(p?.user?._id)
            },
            Icon: HelpIcon,
        },
        {
            name: menus.deleteAccount, href: "/deleteaccount",
            role: function (p) {
                return p?.user?._id && p?.user?._status_isNotDeleted;
            },
            Icon: DeleteIcon
        },
        {
            name: menus.logoutMenu, href: "/logout",
            role: function (p) {
                return p?.user?._id;
            },
            Icon: ExitToAppIcon
        },
    ];

}
export default getMenu;
