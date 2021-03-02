import menus from "../../config/constants/menus";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";

function getMenu(props) {
    return [
        {
            name: menus.editMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/edit" : "/";
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isAuthor = p?.user?._id === p?.post?._author;
                const isBanned = p?.post?._status_isBanned;
                const isFeatured = p?.post?._status_isFeatured;

                if ((isBanned && !isAdmin) || isFeatured){
                    return false;
                }

                if (isAdmin || isAuthor) {
                    return !!(p?.post?._id && p.page !== "edit" && p.page !== "new");
                }
                return false;
            },
            Icon: EditIcon,
            featured: true
        },
        {
            name: menus.deleteMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onDelete){
                    props.onDelete(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isAuthor = p?.user?._id === p?.post?._author;
                const isBanned = p?.post?._status_isBanned;
                const isFeatured = p?.post?._status_isFeatured;

                if ((isBanned && !isAdmin) || isFeatured){
                    return false;
                }

                if (isAdmin || isAuthor) {
                    const isNotDeleted = p?.post?._status_isNotDeleted;
                    return !!(p?.post?._id && isNotDeleted && p.page !== "new");
                }

                return false;
            },
            Icon: DeleteIcon,
            featured: true
        },
        {
            name: menus.banMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onBan){
                    props.onBan(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isBanned = p?.post?._status_isBanned;
                const isFeatured = p?.post?._status_isFeatured;

                if (isBanned || isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p?.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: BlockIcon,
        },
        {
            name: menus.approveMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onApprove){
                    props.onApprove(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isValidated = p?.post?._status_isValidated;
                const isApproved = p?.post?._status_isApproved;
                const isFeatured = p?.post?._status_isFeatured;

                if (!isValidated || isApproved || isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p?.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: CheckCircleIcon,
        },
        {
            name: menus.featuredMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onFeatured){
                    props.onFeatured(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isApproved = p?.post?._status_isApproved;
                const isFeatured = p?.post?._status_isFeatured;

                if (!isApproved || isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p?.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: StarIcon,
        },
        {
            name: menus.removeFeaturedMenu,
            href: function (p) {
                return (p?.post?._id) ? "/" + p.post._id + "/" : "/";
            },
            onClick: function (e, utils) {
                if (props.onRemoveFeatured){
                    props.onRemoveFeatured(e, utils);
                }
                e.preventDefault();
            },
            role: function (p) {
                const isAdmin = p?.user?._status_isFeatured;
                const isFeatured = p?.post?._status_isFeatured;

                if (!isFeatured){
                    return false;
                }

                if (isAdmin) {
                    return !!(p?.post?._id && p.page !== "new");
                }

                return false;
            },
            Icon: StarBorderIcon,
        },
    ];
}

export default getMenu;
