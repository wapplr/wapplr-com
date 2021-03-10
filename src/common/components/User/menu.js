import getPostMenu from "../Post/menu";
import DescriptionIcon from '@material-ui/icons/Description';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DeleteIcon from "@material-ui/icons/Delete";

function getMenu(props = {}) {

    const {appContext} = props;
    const {menus, routes} = appContext;

    const postMenu = getPostMenu(props);
    const filtered = postMenu.map(function (m) {
        if (m.name === menus.deleteMenu || m.name === menus.editMenu){
            const role = m.role;
            m.role = function (p) {
                const isAdmin = p?.user?._status_isFeatured;
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
                const isAuthor = ((p?.user?._id && p?.user?._id === p?.post?._author) || (p?.user?._id && p?.user?._id === p?.post?._author?._id));
                return (isAuthor) ? menus.dashboardMenu : menus.userProfileMenu;
            },
            href: function (p) {
                return (p?.post?._id) ? "/"+p.post._id : "/"
            },
            role: function (p) {
                return true;
            },
            Icon: AccountCircleIcon,
        },
        {
            name: function (p) {
                const isAuthor = ((p?.user?._id && p?.user?._id === p?.post?._author) || (p?.user?._id && p?.user?._id === p?.post?._author?._id));
                return (isAuthor) ? menus.myPostsMenu : menus.userPostsMenu;
            },
            href: function (p) {
                return (p?.post?._id) ? "/"+p.post._id + routes.userPostsRoute : routes.userPostsRoute;
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
                return (p?.post?._id) ? "/"+p.post._id + routes.userPostsRoute+"/deleted" : routes.userPostsRoute+"/deleted"
            },
            role: function (p) {
                const isAuthor = ((p?.user?._id && p?.user?._id === p?.post?._author) || (p?.user?._id && p?.user?._id === p?.post?._author?._id));
                const isAdmin = p?.user?._status_isFeatured;
                const isPostsPage = (p?.page === "posts" && !p?.pageType);
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
