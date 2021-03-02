export default function makeMaterialStyle(theme) {
    return {
        container: {
            marginBottom: "128px"
        },
        appBar: {
            boxShadow: theme.shadows[0]
        },
        title: {
           overflow: "hidden",
           textOverflow: "ellipsis"
        },
        subtitle: {
            overflow: "hidden",
            textOverflow: "ellipsis"
        }
    }
}
