import React, {useContext} from "react";
import AccountContext from "../context";

export default function Router(props) {

    const accountContext = useContext(AccountContext);
    const {user} = accountContext;
    const {page, router, pages} = props;

    const pageName = router({user, page});
    const Page = (pageName) ? pages[pageName] : null;

    return (Page) ? <Page /> : null;
}
