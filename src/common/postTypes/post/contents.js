import App from "../../components/App";
import capitalize from "../../utils/capitalize";

import {runPostTypesConfig} from "../index";

export default function setContents({wapp, routes, titles, name="post", getTitle = function ({title}) {return title;}}) {

    const n = name;
    const N = capitalize(n);

    let reqUserForPost = null;

    function getPostTitle(p) {
        const wappResponse = p.res.wappResponse;
        const state = wappResponse.store.getState();
        const post = state.res.responses && state.res.responses[n+"FindById"];
        const route = wappResponse.route;
        const {path, params} = route;
        let title = (path === routes[n+"Route"]+"/new") ? titles["new"+N+"Title"] : titles[n+"Title"];
        if (post && params._id === post._id && post.title){
            title = (params.page === "edit") ? titles["edit"+N+"Title"] + " | " + post.title : post.title;
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
                if (post?._id && post?.content_extract){
                    return post.content_extract;
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
        {path: routes[n+"Route"]+"/new", contentName: n},
        {path: routes[n+"Route"]+"/:_id", contentName: n},
        {path: routes[n+"Route"]+"/:_id/:page", contentName: n},
    ]);

    return {
        name: n
    }

}

export async function requestForUserPage({wapp, req, res, statusManager, name="post"}) {

    const n = name;
    const ns = n+"s";

    const postStatusManager = wapp.getTargetObject().postTypes.findPostType({name: n}).statusManager;

    const wappResponse = res.wappResponse;
    const wappRequest = req.wappRequest;
    const user = wappRequest.user;
    const isAdmin = user && user[statusManager._status_isFeatured];
    const route = wappResponse.route;
    const {params} = route;
    const {_id, page, pageType} = params;

    const authorStatus = (!isAdmin) ? {
        [postStatusManager.authorStatusField]: {
            gt: statusManager.getDefaultStatus() - 1
        }
    } : {};

    if (page === ns && !pageType && _id) {
        await wapp.requests.send({
            requestName: n+"FindMany",
            args: {
                filter: {
                    _author: _id,
                    _operators:{
                        [postStatusManager.statusField]: {gt: postStatusManager.getDefaultStatus() - 1},
                        ...authorStatus
                    }
                },
                sort: "_CREATEDDATE_DESC",
                skip: 0,
                limit: 1000
            },
            req,
            res
        });
    }

    if (page === ns && pageType === "deleted" && _id) {
        await wapp.requests.send({
            requestName: n+"FindMany",
            args: {
                filter: {
                    _author: _id,
                    _operators:{
                        [postStatusManager.statusField]: {
                            lt: postStatusManager.getDefaultStatus(),
                            gt:(isAdmin) ? postStatusManager.getBannedStatus()-1 : postStatusManager.getDeletedStatus()-1
                        },
                        ...authorStatus
                    }
                },
                sort: "_CREATEDDATE_DESC",
                skip: 0,
                limit: 1000
            },
            req,
            res
        });
    }

    return null;
}
