export default function makeMaterialStyle(theme) {
    return {
        title: {
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        subtitle: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            "& span": {
                overflow: "hidden",
                textOverflow: "ellipsis",
            }
        },
        listItem: {
            cursor: "pointer",
            "&:hover": {
                backgroundColor: theme.palette.action.disabledBackground,
            }
        },
        block: {
            display: "block"
        },
        listItemRoot: {
            paddingRight: "96px"
        }
    }
}
