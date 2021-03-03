import getPostMenu from "../Post/menu"
import SettingsIcon from "@material-ui/icons/Settings";

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
    })

    return [
        {
            name: menus.accountSettingsMenu,
            href: function (p) {
                return routes.accountRoute;
            },
            role: function (p) {
                const isAuthor = ((p?.user?._id && p?.user?._id === p?.post?._author) || (p?.user?._id && p?.user?._id === p?.post?._author?._id));
                if (isAuthor) {
                    return !!(p?.post?._id && p.page !== "edit" && p.page !== "new");
                }
                return false;
            },
            Icon: SettingsIcon,
            disableParentRoute: true,
            featured: true
        },
        ...filtered
    ];
}

export default getMenu;
