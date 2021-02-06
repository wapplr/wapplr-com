import React, {PureComponent} from "react";
import {ServerStyleSheets, ThemeProvider} from "@material-ui/core/styles";
import {WappContext} from "wapplr-react/dist/common/Wapp";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";

export function withMaterialTheme(themeOptions = {}, ComposedComponent) {

    const theme = createMuiTheme(themeOptions);

    class WithMaterialTheme extends PureComponent {
        constructor(props, context) {

            super(props, context);
            const {wapp} = this.context;

            this.sheets = new ServerStyleSheets();

            if (wapp.target === "node"){
                this.addStyle();
            }

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
                    <ThemeProvider theme={theme}>
                        <ComposedComponent {...this.props} />
                    </ThemeProvider>
                )

            }

            return (
                <ThemeProvider theme={theme}>
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
            const {classes, ...rest} = this.props;
            return <ComposedComponent {...rest} materialStyle={classes} />
        }
    }

    const displayName = ComposedComponent.displayName || ComposedComponent.name || "Component"

    WithMaterialStyles.displayName = `WithMaterialStyles(${displayName})`;
    WithMaterialStyles.contextType = WappContext;
    WithMaterialStyles.ComposedComponent = ComposedComponent;

    const StyledComponent = withStyles(styles)(WithMaterialStyles);

    WithMaterialStyles.StyledComponent = StyledComponent;

    return StyledComponent;

}
