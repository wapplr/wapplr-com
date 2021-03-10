import PostAddIcon from "@material-ui/icons/PostAdd";
import DescriptionIcon from "@material-ui/icons/Description";

function getMenu(props = {}) {

    const {appContext} = props;
    const {menus, routes} = appContext;

    return [
        {
            name: menus.newPostMenu,
            href: routes.postRoute + "/new",
            role: function (p) {
                const isAuthor = ((p?.user?._id && p?.user?._id === p?.post?._author) || (p?.user?._id && p?.user?._id === p?.post?._author?._id));
                return isAuthor;
            },
            Icon: PostAddIcon,
            disableParentRoute: true
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
    ];

}
export default getMenu;
