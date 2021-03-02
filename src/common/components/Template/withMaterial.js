import React, {PureComponent} from "react";
import {ServerStyleSheets, ThemeProvider} from "@material-ui/core/styles";
import {WappContext} from "wapplr-react/dist/common/Wapp";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";

export function withMaterialTheme(options = {}, ComposedComponent) {

    class WithMaterialTheme extends PureComponent {
        constructor(props, context) {

            super(props, context);
            const {wapp} = this.context;

            const mediaQuery = this.getMediaQueries(options.mediaQuery);

            this.theme = this.getTheme({theme: options.theme, mediaQuery})

            this.sheets = new ServerStyleSheets();

            if (wapp.target === "node"){
                this.addStyle();
            }

            this.state = {
                mediaQuery
            }

        }
        mediaQueryListener = (e) => {
            if (e.type === "change") {
                const media = e.media;
                const prevState = this.state.mediaQuery;
                const mediaQuery = {
                    ...prevState,
                    [media]: e.matches
                };
                this.theme = this.getTheme({theme: options.theme, mediaQuery})
                this.setState(mediaQuery);
            }
        }
        getMediaQueries(queries) {
            const mediaQueryListener = this.mediaQueryListener;
            const mediaQuery = {};
            const shouldRemoveListenersForMedia = this.shouldRemoveListenersForMedia || {};
            queries.forEach(function(query) {
                const key = query;
                const mediaQueryList = (typeof window !== "undefined") ? window.matchMedia(query) : false;
                if (mediaQueryList && typeof mediaQueryList.addEventListener !== "undefined"){
                    if (shouldRemoveListenersForMedia[key]){
                        shouldRemoveListenersForMedia[key]();
                        delete shouldRemoveListenersForMedia[key];
                    }
                    mediaQueryList.addEventListener("change", mediaQueryListener)
                    shouldRemoveListenersForMedia[key] = function removeMediaListener() {
                        mediaQueryList.removeEventListener("change", mediaQueryListener)
                    }
                }
                mediaQuery[key] = mediaQueryList;
                if (mediaQuery[key] && typeof mediaQuery[key].matches !== "undefined"){
                    mediaQuery[key] = mediaQuery[key].matches;
                }
            })
            this.shouldRemoveListenersForMedia = shouldRemoveListenersForMedia;
            return mediaQuery;
        }
        componentWillUnmount() {
            const shouldRemoveListenersForMedia = this.shouldRemoveListenersForMedia || {};
            Object.keys(shouldRemoveListenersForMedia).forEach(function (key) {
                shouldRemoveListenersForMedia[key]();
            })
        }
        getTheme = ({theme, ...props}) =>{
            return createMuiTheme(
                (typeof options.theme == "function") ?
                    options.theme(props) :
                    options.theme
            );
        }
        createCssModule() {
            const sheets = this.sheets;
            return {
                _module: {
                    id: "./src/common/components/Template/materialStyle.css"
                },
                _getCss: function () {
                    return sheets.toString();
                }
            }
        }
        addStyle() {
            const {wapp} = this.context;
            const module = this.createCssModule();
            wapp.styles.add(module);
        }
        render() {

            const {wapp} = this.context;

            if (wapp.target === "node"){

                return this.sheets.collect(
                    <ThemeProvider theme={this.theme}>
                        <ComposedComponent {...this.props} />
                    </ThemeProvider>
                )

            }

            return (
                <ThemeProvider theme={this.theme}>
                    <ComposedComponent {...this.props} />
                </ThemeProvider>
            )

        }
    }

    const displayName = ComposedComponent.displayName || ComposedComponent.name || "Component"

    WithMaterialTheme.displayName = `WithMaterialTheme(${displayName})`;
    WithMaterialTheme.contextType = WappContext;
    WithMaterialTheme.ComposedComponent = ComposedComponent;

    return WithMaterialTheme;

}

export function withMaterialStyles(styles = {}, ComposedComponent) {

    class WithMaterialStyles extends PureComponent {
        render() {
            const {classes, forwardedRef, ...rest} = this.props;
            return <ComposedComponent {...rest} ref={forwardedRef} materialStyle={classes} />
        }
    }

    const displayName = ComposedComponent.displayName || ComposedComponent.name || "Component"

    WithMaterialStyles.displayName = `WithMaterialStyles(${displayName})`;
    WithMaterialStyles.contextType = WappContext;
    WithMaterialStyles.ComposedComponent = ComposedComponent;

    const StyledComponent = withStyles(styles)(WithMaterialStyles);

    WithMaterialStyles.StyledComponent = StyledComponent;

    return React.forwardRef((props, ref) => {
        return <StyledComponent {...props} forwardedRef={ref} />;
    });

}
