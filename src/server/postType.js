export default async function postType(p = {}) {

    const {wapp} = p;
    return await wapp.server.posttypes.getPosttype({
        name: "post",
        addIfThereIsNot: true,
        config: {
            schemaFields: {
                title: {type: String},
                content: {type: Number, default: 0},
            },
            resolvers: function(p = {}) {
                const {modelName, Model} = p;
                const requestName = modelName.slice(0,1).toLowerCase() + modelName.slice(1);
                return {
                    [requestName + "GetBrief"]: {
                        type: "["+modelName+"]",
                        resolve: async function(p = {}) {
                            // eslint-disable-next-line no-unused-vars
                            const {args = {}} = p;
                            const posts = await Model.find().sort({ score: -1, time: 1 });
                            if (!posts || (posts && !posts.length)){
                                return [];
                            }
                            return posts.slice(0,10)
                        }
                    },
                    [requestName + "CreateOne"]: function(TC) {
                        const defaultCreateOne = TC.getResolver('createOne');
                        return {
                            ...defaultCreateOne,
                            resolve: function (p = {}) {
                                const {args = {}} = p;
                                const {record} = args;
                                if (record) {
                                    record.ip = wapp.response.req.remoteAddress;
                                }
                                return defaultCreateOne.resolve(p)
                            }
                        }
                    }
                }
            }
        }
    })
}
