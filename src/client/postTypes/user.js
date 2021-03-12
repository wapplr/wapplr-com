import commonPostTypeConfig from "../../common/postTypes/user";

export default function initPostType({wapp}) {
    return wapp.client.authentications.getAuthentication({
        name: "user",
        addIfThereIsNot: true,
        statusManager: commonPostTypeConfig.getStatusManager(),
    });
}
