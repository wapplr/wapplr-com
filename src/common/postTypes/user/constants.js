import defaultPostTypeConfig from "../post";

export default function getConstants(p = {}) {
    return defaultPostTypeConfig.getConstants({
        ...p,
        name:"user"
    })
}
