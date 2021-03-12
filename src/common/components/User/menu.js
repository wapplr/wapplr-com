import getPostMenu from "../Post/menu";
import DescriptionIcon from '@material-ui/icons/Description';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";

export function getTopMenu(props) {

    // eslint-disable-next-line no-unused-vars
    const {appContext, statusManager} = props;
    // eslint-disable-next-line no-unused-vars
    const {menus, routes, userStatusManager} = appContext;

    return [
        {
            name: menus.accountSettingsMenu,
            href: function (p) {
                return routes.accountRoute;
            },
            role: function (p) {
                const isAuthor = ((p?.user?._id && p?.user?._id === p?.post?._author) || (p?.user?._id && p?.user?._id === p?.post?._author?._id));
                if (isAuthor) {
                    return !!(p?.post?._id);
                }
                return false;
            },
            Icon: SettingsIcon,
            disableParentRoute: true,
            featured: true
        }
    ]

}

function getMenu(props = {}) {

    // eslint-disable-next-line no-unused-vars
    const {appContext, statusManager} = props;
    const {menus, routes, userStatusManager} = appContext;

    const postMenu = getPostMenu(props);
    const filtered = postMenu.map(function (m) {
        if (m.name === menus.deleteMenu || m.name === menus.editMenu){
            const role = m.role;
            m.role = function (p) {
                const isAdmin = p.user && p.user[userStatusManager._status_isFeatured];
                if (!isAdmin) {
                    return false;
                }
                return role(p)
            };
            m.featured = false;
        }
        return m;
    });

    return [
        {
            name: function (p) {
                const isAuthor = ((p.user?._id && p.user?._id === p.post?._author) || (p.user?._id && p.user?._id === p.post?._author?._id));
                return (isAuthor) ? menus.dashboardMenu : menus.userProfileMenu;
            },
            href: function (p) {
                return (p.post?._id) ? "/"+p.post._id : "/"
            },
            role: function (p) {
                return true;
            },
            Icon: AccountCircleIcon,
        },
        {
            name: function (p) {
                const isAuthor = ((p.user?._id && p.user?._id === p.post?._author) || (p.user?._id && p.user?._id === p.post?._author?._id));
                return (isAuthor) ? menus.myPostsMenu : menus.userPostsMenu;
            },
            href: function (p) {
                return (p.post?._id) ? "/"+p.post._id + routes.userPostsRoute : routes.userPostsRoute;
            },
            role: function (p) {
                return true;
            },
            Icon: DescriptionIcon,
        },
        {
            name: function (p) {
                return menus.deletedPostsMenu;
            },
            href: function (p) {
                return (p.post?._id) ? "/"+p.post._id + routes.userPostsRoute+"/deleted" : routes.userPostsRoute+"/deleted"
            },
            role: function (p) {
                const isAuthor = ((p.user?._id && p.user?._id === p.post?._author) || (p.user?._id && p.user?._id === p.post?._author?._id));
                const isAdmin = p.user && p.user[userStatusManager._status_isFeatured];
                const isPostsPage = (p.page === "posts" && !p.pageType);
                if (isPostsPage) {
                    if (isAuthor || isAdmin) {
                        return true;
                    }
                }
                return false;
            },
            Icon: DeleteIcon,
            featured: true,
        },
        {
            name: function (p) {
                const isAuthor = ((p.user?._id && p.user?._id === p.post?._author) || (p.user?._id && p.user?._id === p.post?._author?._id));
                return (isAuthor) ? menus.myDocumentsMenu : menus.userDocumentsMenu;
            },
            href: function (p) {
                return (p.post?._id) ? "/"+p.post._id + routes.userDocumentsRoute : routes.userDocumentsRoute;
            },
            role: function (p) {
                return true;
            },
            Icon: DescriptionIcon,
        },
        {
            name: function (p) {
                return menus.deletedDocumentsMenu;
            },
            href: function (p) {
                return (p.post?._id) ? "/"+p.post._id + routes.userDocumentsRoute+"/deleted" : routes.userDocumentsRoute+"/deleted"
            },
            role: function (p) {
                const isAuthor = ((p.user?._id && p.user?._id === p.post?._author) || (p.user?._id && p.user?._id === p.post?._author?._id));
                const isAdmin = p.user && p.user[userStatusManager._status_isFeatured];
                const isPostsPage = (p.page === "documents" && !p.pageType);
                if (isPostsPage) {
                    if (isAuthor || isAdmin) {
                        return true;
                    }
                }
                return false;
            },
            Icon: DeleteIcon,
            featured: true,
        },
        ...filtered
    ];
}

export default getMenu;
