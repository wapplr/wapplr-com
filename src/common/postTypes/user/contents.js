import App from "../../components/App";
import capitalize from "../../utils/capitalize";

import {runPostTypesConfig} from "../index";

export default function setContents({wapp, routes, titles, name="user", getTitle=function ({title}){return title;}}) {

    const n = name;
    const N = capitalize(n);

    let reqUserForPost = null;

    function getPostTitle(p) {
        const wappResponse = p.res.wappResponse;
        const state = wappResponse.store.getState();
        const post = state.res.responses && state.res.responses[n+"FindById"];
        const route = wappResponse.route;
        const {params} = route;
        let title = titles[n+"Title"];
        if (post && params._id === post._id && post.name?.first){
            switch (params.page) {
                case "edit":
                    title = titles["edit"+N+"Title"] + " | " + post.name.first;
                    break;
                case "posts":
                    switch (params.pageType) {
                        case "deleted":
                            title = titles[n+"DeletedPostsTitle"] + " | " + post.name.first;
                            break;
                        default:
                            title = titles[n+"PostsTitle"] + " | " + post.name.first
                    }
                    break;
                case "documents":
                    switch (params.pageType) {
                        case "deleted":
                            title = titles[n+"DeletedDocumentsTitle"] + " | " + post.name.first;
                            break;
                        default:
                            title = titles[n+"DocumentsTitle"] + " | " + post.name.first
                    }
                    break;
                default:
                    title = post.name.first;
            }
        }
        return getTitle({...p, title})
    }

    wapp.contents.add({
        [n]: {
            render: App,
            renderType: "react",
            title: getPostTitle,
            description: function (p) {
                const {wapp, req, res} = p;
                const wappResponse = res.wappResponse;
                const state = wappResponse.store.getState();
                const post = state.res.responses && state.res.responses[n+"FindById"];
                if (post?._id && post?.name){
                    return post?.name.first+"'s page";
                }
                const config = wapp.getTargetObject().config;
                const {description} = config;
                return (description) ? description : getPostTitle({wapp, req, res}).split(" | ")[0];
            },
            request: async function ({wapp, req, res}) {
                const wappResponse = res.wappResponse;
                const state = wappResponse.store.getState();
                const responses = state.res.responses || {};
                const route = wappResponse.route;
                const {params} = route;
                const {_id} = params;

                const statusManager = wapp.getTargetObject().postTypes.findPostType({name: n}).statusManager;

                await runPostTypesConfig({action: "requestFor"+N+"Page", p:{wapp, req, res, statusManager}});

                if ((_id && !responses[n+"FindById"]) ||
                    (_id && responses[n+"FindById"] && responses[n+"FindById"]._id !== _id) ||
                    (_id && reqUserForPost?._id !== req.wappRequest.user?._id)) {
                    reqUserForPost = {_id: req.wappRequest.user?._id};
                    return await wapp.requests.send({requestName: n+"FindById", args: {_id: _id}, req, res});
                }
            }
        }
    });

    wapp.router.add([
        {path: routes[n+"Route"], contentName: n},
        {path: routes[n+"Route"]+"/:_id", contentName: n},
        {path: routes[n+"Route"]+"/:_id/:page", contentName: n},
        {path: routes[n+"Route"]+"/:_id/:page/:pageType", contentName: n},
    ]);

    return {
        name: n
    }

}

export async function requestForUserPage(p = {}) {
    return null;
}
