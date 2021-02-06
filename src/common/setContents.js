import App from "./components/App";
import titles from "./config/constants/titles";
import routes from "./config/constants/routes";

export default function setContents(p = {}) {

    const {wapp} = p;

    function getTitle({wapp, req, res, title = titles.homeTitle}) {
        const config = wapp.getTargetObject().config;
        const {siteName = "Wapplr"} = config;
        const {statusCode, statusMessage, errorMessage} = res.wappResponse;
        if (statusCode === 404) {
            title = statusMessage || "Not found";
        }
        if (statusCode === 500) {
            title = errorMessage || statusMessage || "Internal Server Error";
        }
        return title + " | " + siteName;
    }

    /*contents for home and some static page*/

    wapp.contents.add({
        home: {
            render: App,
            description: "Home",
            renderType: "react",
            title: function (p) {
                return getTitle({...p, title: titles.homeTitle})
            }
        }
    })

    wapp.router.replace([
        {path: "/", contentName: "home"},
    ])

    wapp.router.add([
        {path: "/installing", contentName: "home"},
        {path: "/api", contentName: "home"},
    ])

    /*contents for user*/

    wapp.contents.add({
        account: {
            render: App,
            renderType: "react",
            title: function (p) {
                return getTitle({...p, title: titles.accountTitle})
            }
        },
        user: {
            render: App,
            renderType: "react",
            title: function (p) {
                return getTitle({...p, title: titles.userTitle})
            }
        },
    })

    wapp.router.add([
        {path: routes.accountRoute, contentName: "account"},
        {path: routes.accountRoute+"/:page", contentName: "account"},
        {path: routes.accountRoute+"/*", contentName: "account"},

        {path: routes.userRoute+"/:_id", contentName: "user"},
        {path: routes.userRoute+"/:_id/:page", contentName: "user"},
        {path: routes.userRoute+"/:_id/*", contentName: "user"},
    ])

    /*contents for post*/

    wapp.contents.add({
        post: {
            render: App,
            renderType: "react",
            title: function (p) {
                return getTitle({...p, title: titles.postTitle})
            }
        }
    })

    wapp.router.add([
        {path: "/post/:_id", contentName: "post"},
        {path: "/post/:_id/:page", contentName: "post"},
        {path: "/post/:_id/*", contentName: "post"},
    ])

}
