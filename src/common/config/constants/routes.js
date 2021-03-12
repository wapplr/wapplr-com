import {runPostTypesConfigSync} from "../../postTypes";

const routes = {
    accountRoute: "/account",
    ...runPostTypesConfigSync({action:"getConstants", rKey:"routes"}).reduce((a, v) => {return {...a, ...v}}, {})
};

export default routes;
