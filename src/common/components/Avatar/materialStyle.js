export default function makeMaterialStyle(theme) {
    return {
        avatar: {
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            backgroundColor: theme.palette.secondary.main
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            fontSize: "0.9rem"
        },
        list: {
            width: theme.spacing(4),
            height: theme.spacing(4),
            fontSize: "1.1rem"
        },
    }
}
