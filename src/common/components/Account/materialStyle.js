export default function makeMaterialStyle(theme) {
    return {
        container: {
            marginBottom: "128px"
        },
        appBar: {
            boxShadow: theme.shadows[0]
        },
        listItem: {
            color: theme.palette.text.primary
        },
        listItemIcon: {
            color: theme.palette.text.primary
        }
    }
}
