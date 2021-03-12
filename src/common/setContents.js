import App from "./components/App";
import titles from "./config/constants/titles";
import routes from "./config/constants/routes";
import {runPostTypesConfigSync} from "./postTypes";

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

    const redirectToReadmeMd = {
        contentName: "document",
        action: async function action(p) {
            const {req, res} = p;
            return await wapp.router.routeManager.resolve({path: "/document/604ba75865f8fe2c0c5818a4", req, res});
        }
    };

    /*wapp.contents.add({
        home: {
            render: App,
            renderType: "react",
            title: function (p) {
                return getTitle({...p, title: titles.homeTitle})
            }
        }
    });*/

    wapp.router.replace([
        {path: "/", ...redirectToReadmeMd},
    ]);

    /*contents for post types, post, document, user...*/

    runPostTypesConfigSync({action:"setContents", p:{wapp, routes, titles, getTitle}});

    /*contents for user account*/

    wapp.contents.add({
        account: {
            render: App,
            renderType: "react",
            title: function (p) {

                const wappResponse = p.res.wappResponse;
                const route = wappResponse.route;
                const {params} = route;

                let title;

                switch (params.page) {
                    case "changedata":
                        title = titles.changeDataTitle;
                        break;
                    case "changeemail":
                        title = titles.changeEmailTitle;
                        break;
                    case "changepassword":
                        title = titles.changePasswordTitle;
                        break;
                    case "forgotpassword":
                        title = titles.forgotPasswordTitle;
                        break;
                    case "deleteaccount":
                        title = titles.deleteAccountTitle;
                        break;
                    case "logout":
                        title = titles.logoutTitle;
                        break;
                    default:
                        title = titles.accountTitle
                }

                return getTitle({...p, title})
            }
        },
    });

    wapp.router.add([
        {path: routes.accountRoute, contentName: "account"},
        {path: routes.accountRoute+"/:page", contentName: "account"},
        {path: routes.accountRoute+"/*", contentName: "account"},
    ]);

}
