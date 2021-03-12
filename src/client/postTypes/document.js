import commonPostTypeConfig from "../../common/postTypes/document";

export default function initPostType({wapp}) {
    return wapp.client.postTypes.getPostType({
        name: "document",
        addIfThereIsNot: true,
        statusManager: commonPostTypeConfig.getStatusManager(),
    });
}
