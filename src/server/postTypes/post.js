export default async function post(p = {}) {

    const {wapp} = p;

    const titlePattern = /^.{1,250}$/;
    const contentPattern = /^.{1,2500}$/;
    const contentBriefPattern = /^.{1,500}$/;

    return await wapp.server.postTypes.getPostType({
        name: "post",
        addIfThereIsNot: true,
        config: {
            schemaFields: {
                title: {
                    type: String,
                    wapplr: {
                        pattern: titlePattern,
                        required: true
                    }
                },
                subtitle: {
                    type: String,
                    wapplr: {
                        pattern: titlePattern,
                    }
                },
                content: {
                    type: String,
                    wapplr: {
                        pattern: contentPattern,
                        required: true
                    }
                },
                contentBrief: {
                    type: String,
                    wapplr: {
                        pattern: contentBriefPattern,
                    }
                },
            },
            requiredDataForStatus: {
                title: { type: String },
                content: { type: String },
            },
        }
    })

}
