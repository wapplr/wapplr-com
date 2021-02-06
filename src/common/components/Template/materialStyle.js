const drawerWidth = 320;

export default function materialStyle(theme) {
    return {
        root: {
            display: "flex",
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            boxShadow: theme.shadows[0]
        },
        appBarSticky: {
            boxShadow: theme.shadows[3]
        },
        menuButton: {
            marginRight: 12,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
        },
        drawerAbsolute: {
            position: "absolute"
        },
        drawerOpen: {
            transition: theme.transitions.create("margin-left", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        drawerClose: {
            transition: theme.transitions.create("margin-left", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        drawerContainer: {
            overflowX: "hidden",
            overflowY: "auto",
            width: drawerWidth,
        },
        drawerLayer: {
            transition: theme.transitions.create("opacity", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0,
            visibility: "hidden",
            backgroundColor: "#000000",
            zIndex: theme.zIndex.drawer - 1,
        },
        drawerLayerShow: {
            opacity: 0.5,
            visibility: "visible"
        },
        listItem: {
            color: theme.palette.text.primary
        },
        listItemIcon: {
            color: theme.palette.text.primary
        },
        toolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
        },
        page: {
            paddingTop: theme.mixins.toolbar.minHeight,
            "@media (min-width:600px)": {
                paddingTop: theme.mixins.toolbar["@media (min-width:600px)"].minHeight,
            },
        }
    }
}
