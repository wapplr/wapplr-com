export default async function user(p = {}) {

    const {wapp} = p;

    return await wapp.server.authentications.getAuthentication({
        name: "author",
        addIfThereIsNot: true,
        config: {
            schemaFields: {
                firstName: {type: String},
                lastName: {type: String},
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
                            const users = await Model.find();
                            if (!users || (users && !users.length)){
                                return [];
                            }
                            return users;
                        }
                    },
                }
            }
        }
    })
}
