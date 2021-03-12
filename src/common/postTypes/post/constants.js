import capitalize from "../../utils/capitalize";

export default function getConstants(p = {}) {

    const {name = "post"} = p;

    const n = name;
    const N = capitalize(n);
    const Ns = N+"s";
    const ns = name+"s";

    return {
        labels: {},
        menus: {
            ["user"+Ns+"Menu"]: "User "+ns,
            ["my"+Ns+"Menu"]: "My "+ns,
            ["new"+N+"Menu"]: "New "+n
        },
        messages: {},
        routes: {
            ["user"+Ns+"Route"]: "/"+ns,
            [n+"Route"]: "/"+n,
        },
        titles: {
            [n+"Title"]: N,
            ["new"+N+"Title"]: "New "+n,
            ["edit"+N+"Title"]: "Edit "+n,
            ["user"+Ns+"Title"]: "User "+ns,
            ["userDeleted"+Ns+"Title"]: "Deleted "+ns,
            ["my"+Ns+"Title"]: "My "+ns,
            ["myDeleted"+Ns+"Title"]: "My deleted "+ns,
        }
    };
}
