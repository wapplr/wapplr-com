export default async function post(p = {}) {

    const {wapp} = p;
    return await wapp.server.postTypes.getPostType({
        name: "post",
        addIfThereIsNot: true,
        config: {
            schemaFields: {
                title: {type: String},
                content: {type: String},
            },
            resolvers: function(p = {}) {
                const {modelName, Model} = p;
                const requestName = modelName.slice(0,1).toLowerCase() + modelName.slice(1);
                return {
                    [requestName + "GetAll"]: {
                        type: "["+modelName+"]",
                        resolve: async function(p = {}) {
                            // eslint-disable-next-line no-unused-vars
                            const {args = {}} = p;
                            const posts = await Model.find().sort({ score: -1, time: 1 });
                            if (!posts || (posts && !posts.length)){
                                return [];
                            }
                            return posts;
                        }
                    }
                }
            }
        }
    })
}
