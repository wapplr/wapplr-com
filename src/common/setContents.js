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

    function getPostTitle(p) {
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
    }

    wapp.contents.add({
        post: {
            render: App,
            renderType: "react",
            title: getPostTitle,
            description: function (p) {
                const {wapp, req, res} = p;
                const wappResponse = res.wappResponse;
                const state = wappResponse.store.getState();
                const post = state.res.responses?.postFindById;
                if (post?._id && post?.content_extract){
                    return post.content_extract;
                }
                const config = wapp.getTargetObject().config;
                const {description} = config;
                return (description) ? description : getPostTitle({wapp, req, res}).split(" | ")[0];
            },
            request: async function ({wapp, req, res}) {
                const wappResponse = res.wappResponse;
                const args = wappResponse.route.params;
                const state = wappResponse.store.getState();
                const responses = state.res.responses || {};
                if ((args._id && typeof responses.postFindById == "undefined") ||
                    (args._id && responses.postFindById && responses.postFindById._id !== args._id) ||
                    (args._id && reqUser?._id !== req.wappRequest.user?._id)) {
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

    /*contents for user*/

    function getUserTitle(p) {
        const wappResponse = p.res.wappResponse;
        const state = wappResponse.store.getState();
        const post = state.res.responses?.userFindById;
        const route = wappResponse.route;
        const {params} = route;
        let title = titles.userTitle;
        if (post && params._id === post._id && post.name?.first){
            title = (params.page === "edit") ? titles.editUserTitle + " | " + post.name.first : post.name.first
        }
        return getTitle({...p, title})
    }

    wapp.contents.add({
        user: {
            render: App,
            renderType: "react",
            title: getUserTitle,
            description: function (p) {
                const {wapp, req, res} = p;
                const wappResponse = res.wappResponse;
                const state = wappResponse.store.getState();
                const post = state.res.responses?.userFindById;
                if (post?._id && post?.name){
                    return post?.name.first+"'s page";
                }
                const config = wapp.getTargetObject().config;
                const {description} = config;
                return (description) ? description : getUserTitle({wapp, req, res}).split(" | ")[0];
            },
            request: async function ({wapp, req, res}) {
                const wappResponse = res.wappResponse;
                const args = wappResponse.route.params;
                const state = wappResponse.store.getState();
                const responses = state.res.responses || {};
                if ((args._id && typeof responses.userFindById == "undefined") ||
                    (args._id && responses.userFindById && responses.userFindById._id !== args._id) ||
                    (args._id && reqUser?._id !== req.wappRequest.user?._id)) {
                    reqUser = req.wappRequest.user;
                    await wapp.requests.send({requestName: "userFindById", args: {_id: args._id}, req, res});
                }
            }
        }
    })

    wapp.router.add([
        {path: routes.userRoute, contentName: "user"},
        {path: routes.userRoute+"/:_id", contentName: "user"},
        {path: routes.userRoute+"/:_id/:page", contentName: "user"},
    ])

}
