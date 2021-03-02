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
    })

    wapp.router.add([
        {path: routes.accountRoute, contentName: "account"},
        {path: routes.accountRoute+"/:page", contentName: "account"},
        {path: routes.accountRoute+"/*", contentName: "account"},
    ])

    /*contents for post*/

    let reqUser = null;

    wapp.contents.add({
        post: {
            render: App,
            renderType: "react",
            title: function (p) {
                const wappResponse = p.res.wappResponse;
                const state = wappResponse.store.getState();
                const post = state.res.responses?.postFindById;
                const route = wappResponse.route;
                const {path, params} = route;
                let title = (path === routes.postRoute+"/new") ? titles.newPostTitle : titles.postTitle;
                if (post && params._id === post._id && post.title){
                    title = (params.page === "edit") ? titles.editPostTitle + " | " + post.title : post.title;
                }
                return getTitle({...p, title})
            },
            request: async function ({wapp, req, res}) {
                const wappResponse = res.wappResponse;
                const args = wappResponse.route.params;
                const state = wappResponse.store.getState();
                const responses = state.res.responses || {};
                if ((args._id && typeof responses.postFindById == "undefined") ||
                    (args._id && responses.postFindById && responses.postFindById._id !== args._id) ||
                    (reqUser?._id !== req.wappRequest.user?._id)) {
                    reqUser = req.wappRequest.user;
                    await wapp.requests.send({requestName: "postFindById", args: {_id: args._id}, req, res});
                }
            }
        }
    })

    wapp.router.add([
        {path: routes.postRoute, contentName: "post"},
        {path: routes.postRoute+"/new", contentName: "post"},
        {path: routes.postRoute+"/:_id", contentName: "post"},
        {path: routes.postRoute+"/:_id/:page", contentName: "post"},
    ])

}
