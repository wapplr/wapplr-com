import React, {useContext} from "react";

import PostContext from "../context";
import AppContext from "../../App/context";

export default function Router(props) {

    const postContext = useContext(PostContext);
    const appContext = useContext(AppContext);
    const {user, post, statusManager} = postContext;
    const {userStatusManager} = appContext;
    const {page, pages, router} = props;

    const pageName = router({user, post, page, statusManager, userStatusManager});
    const Page = (pageName) ? pages[pageName] : null;

    return (Page) ? <Page /> : null;
}
