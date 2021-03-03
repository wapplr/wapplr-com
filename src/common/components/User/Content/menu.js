import PostAddIcon from "@material-ui/icons/PostAdd";

function getMenu(props = {}) {

    const {appContext} = props;
    const {menus, routes} = appContext;

    return [
        {
            name: menus.newPostMenu,
            href: routes.postRoute + "/new",
            role: function (p) {
                return (p?.user?._id);
            },
            Icon: PostAddIcon,
            disableParentRoute: true
        },
    ];

}
export default getMenu;
