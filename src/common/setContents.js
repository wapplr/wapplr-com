import App from "./components/App";

export default function setContents(p = {}) {

    const {wapp} = p;

    /*contents for home and some static page*/

    wapp.contents.add({
        home: {
            render: App,
            description: "Home",
            renderType: "react"
        }
    })

    wapp.router.replace([
        {path: "/", contentName: "home"},
    ])

    wapp.router.add([
        {path: "/installing", contentName: "home"},
        {path: "/api", contentName: "home"},
    ])

    /*contents for user*/

    wapp.contents.add({
        user: {
            render: App,
            title: "User",
            renderType: "react"
        },
        login: {
            render: App,
            title: "Login",
            renderType: "react"
        }
    })

    wapp.router.add([
        {path: "/account", contentName: "login"},
        {path: "/account/:accountPage", contentName: "login"},
        {path: "/account/*", contentName: "login"},
        {path: "/user/:_id", contentName: "user"},
        {path: "/user/:_id/:userPage", contentName: "user"},
        {path: "/user/:_id/*", contentName: "user"},
    ])

    /*contents for post*/

    wapp.contents.add({
        post: {
            render: App,
            title: "Post",
            renderType: "react"
        }
    })

    wapp.router.add([
        {path: "/post/:_id", contentName: "post"},
        {path: "/post/:_id/:postPage", contentName: "post"},
        {path: "/post/:_id/*", contentName: "post"},
    ])

}
