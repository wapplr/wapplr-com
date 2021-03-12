import messages from "../../common/config/constants/messages";
import labels from "../../common/config/constants/labels";
import commonPostTypeConfig from "../../common/postTypes/document";

export default async function initPostType({wapp}) {

    const titlePattern = /^.{1,250}$/;
    const contentPattern = /^.{1,20000}$/m;

    return await wapp.server.postTypes.getPostType({
        name: "document",
        addIfThereIsNot: true,
        statusManager: commonPostTypeConfig.getStatusManager(),
        config: {
            masterCode: wapp.server.config.masterCode,
            schemaFields: {
                title: {
                    type: String,
                    wapplr: {
                        pattern: titlePattern,
                        validationMessage: messages.validationEntryTitle,
                        formData: {
                            label: labels.entryTitleLabel
                        }
                    }
                },
                subtitle: {
                    type: String,
                    wapplr: {
                        pattern: titlePattern,
                        validationMessage: messages.validationEntrySubtitle,
                        formData: {
                            label: labels.entrySubtitleLabel
                        }

                    }
                },
                content: {
                    type: String,
                    wapplr: {
                        pattern: contentPattern,
                        validationMessage: messages.validationEntryContent,
                        required: true,
                        formData: {
                            label: labels.entryContentLabel,
                            multiline: true,
                            rows: 4,
                            rowsMin: 4,
                            rowsMax: 20,
                        }
                    }
                }
            },
            setSchemaMiddleware: function ({schema}) {

                schema.virtualToGraphQl({
                    name: "content_extract",
                    get: function () {
                        return this.content.replace(/\r?\n|\r/g, " ").replace(/#/g, " ").trim().replace(/ +(?= )/g, " - ").replace(/ +(?= )/g, "").slice(0, 250) + "..."
                    },
                    options: {
                        instance: "String"
                    }
                })

            }
        }
    });

}
