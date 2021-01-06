import App from "./components/App";

export default function setContents(p = {}) {

    const {wapp} = p;

    wapp.contents.add({
        home: {
            render: App,
            description: "Home",
            renderType: "react"
        }
    })

    wapp.router.replace([
        {path: "/", contentName: "home"}
    ])

    wapp.router.add([
        {path: "/documentation", contentName: "home"},
        {path: "/contact", contentName: "home"},
    ])

}
