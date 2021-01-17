export default async function user(p = {}) {

    const {wapp} = p;

    return await wapp.server.authentications.getAuthentication({
        name: "user",
        addIfThereIsNot: true,
    })
}
