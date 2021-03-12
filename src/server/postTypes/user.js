import routes from "../../common/config/constants/routes";
import commonPostTypeConfig from "../../common/postTypes/post";

export default async function initPostType({wapp}) {

    return await wapp.server.authentications.getAuthentication({
        name: "user",
        addIfThereIsNot: true,
        admin: {
            name: {
                first: "Admin"
            },
            email: "admin@wapplr.com",
            password: wapp.server.config.adminPassword
        },
        statusManager: commonPostTypeConfig.getStatusManager(),
        config: {
            cookieSecret: wapp.server.config.cookieSecret,
            masterCode: wapp.server.config.masterCode,
            disableUseSessionMiddleware: true,
            mailer: {
                send: async function(type, data, input) {
                    const {req} = input;

                    const hostname = req.wappRequest.hostname;
                    const protocol = req.wappRequest.protocol;

                    if (type === "signup"){
                        const emailConfirmationRoute = routes.accountRoute + "/emailconfirmation";
                        const user = data;
                        const url = protocol + "://" + hostname + emailConfirmationRoute + "/?hash=" + encodeURIComponent(user.emailConfirmationKey) + "&email=" + encodeURIComponent(user.email) + "";
                        console.log(url);
                    }
                    if (type === "forgotPassword") {
                        const resetPasswordRoute = routes.accountRoute + "/resetpassword";
                        const user = data;
                        const url = protocol + "://" + hostname + resetPasswordRoute + "/?hash=" + encodeURIComponent(user.passwordRecoveryKey) + "&email=" + encodeURIComponent(user.email) + "";
                        console.log(url);
                    }
                    if (type === "emailConfirmation"){
                        const emailConfirmationRoute = routes.accountRoute + "/emailconfirmation";
                        const user = data;
                        const url = protocol + "://" + hostname + emailConfirmationRoute + "/?hash=" + encodeURIComponent(user.emailConfirmationKey) + "&email=" + encodeURIComponent(user.email) + "";
                        console.log(url);
                    }
                }
            },
        }
    });

}
