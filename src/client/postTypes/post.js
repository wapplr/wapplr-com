import commonPostTypeConfig from "../../common/postTypes/post";

export default function initPostType({wapp}) {
    return wapp.client.postTypes.getPostType({
        name: "post",
        addIfThereIsNot: true,
        statusManager: commonPostTypeConfig.getStatusManager(),
    });
}
