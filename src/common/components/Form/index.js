import React from "react";
import {withWapp, WappContext} from "wapplr-react/dist/common/Wapp";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import style from "./style.css";
import materialStyle from "./materialStyle";
import {withMaterialStyles} from "../Template/withMaterial";

const components = {
    Button: {
        props: {
            type: "submit",
            variant: "contained",
            color: "secondary",
            children: "Submit"
        },
        Component: Button
    },
    TextField: {
        props: {
            type: "text",
            label: "",
            value: "",
            error: false,
            helperText: "",
            variant: "outlined",
            autoComplete: "on",
            disabled: false,
            multiline: false,
            rows: null,
            rowsMax: null
        },
        Component: TextField
    }
}

function getComponentName({data, key}) {
    if (data.componentName){
        return data.componentName;
    }
    if (key === "submit"){
        return "Button";
    }
    let componentName = "TextField";
    if (data.schemaType){
        switch(data.schemaType) {
            case "String":
                componentName = "TextField";
                break;
            case "MongoId":
                componentName = "TextField";
                break;
            default:
                componentName = "TextField";
        }
    }
    return componentName;
}

function generatePropsAndSelectComponent({formData, key, onSubmit, onChange}) {

    const data = {...formData[key]};

    const componentName = getComponentName({data, key});

    const Component = components[componentName]?.Component || TextField;
    const defaultProps = {...components[componentName]?.props || {}};

    if (componentName === "Button" && data.label && typeof data.children == "undefined"){
        data.children = data.label;
        delete data.label;
    }

    const props = Object.keys(defaultProps).reduce(function (a, key, i) {
        a[key] = (typeof data[key] !== "undefined") ? data[key] : defaultProps[key];
        return a;
    }, {})

    if (props.type === "submit") {
        props.onClick = onSubmit;
    } else if (componentName === "TextField") {
        props.onChange = function (e) {
            return onChange(e, key);
        };
    }

    if (!props.id){
        props.id = key;
    }

    if (componentName === "TextField" && !props.label){
        props.label = key.slice(0,1).toUpperCase() + key.slice(1)
    }

    if (data.required && props.label && props.label.slice(-2) !== " *") {
        props.label = props.label + " *";
    }

    props.key = key;

    return {props, Component};

}

class Form extends React.Component {
    constructor(props, context) {

        super(props, context);

        this.state = {
            snackMessage: "",
            formData: {...JSON.parse(JSON.stringify(props.formData)) || {}}
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);

        this.addStyle = this.addStyle.bind(this);
        this.removeStyle = null;

        const {wapp} = context;
        if (wapp.target === "node"){
            this.addStyle();
        }

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.formData !== prevProps.formData) {
            this.setState({
                formData: {...JSON.parse(JSON.stringify(this.props.formData)) || {}}
            })
        }
    }
    componentDidMount() {
        this.addStyle()
    }
    componentWillUnmount() {
        if (this.removeStyle){
            this.removeStyle();
        }
    }
    addStyle() {
        if (this.removeStyle){
            this.removeStyle();
        }
        const {wapp} = this.context;
        this.removeStyle = wapp.styles.add(style);
    }
    onChange(e, key) {
        const formData = this.state.formData;
        const data = {...formData[key]};
        if (e.target.value !== data.value) {
            data.value = e.target.value;
            data.helperText = "";
            data.error = false;
            this.setState({
                formData: {
                    ...formData,
                    [key] : data
                },
                snackMessage: ""
            });
        } else if (this.state.snackMessage){
            this.setState({
                snackMessage: ""
            });
        }
    }
    handleCloseSnackbar(e, reason) {
        if (this.state.snackMessage) {
            this.setState({
                snackMessage: ""
            })
        }
    }
    async onSubmit(e) {

        const {successMessage} = this.props;

        e.preventDefault();

        const {
            onSubmit = async function onSubmit(e, formData) {
                return new Promise(async function (resolve, reject) {
                    return resolve(response);
                })
            }
        } = this.props;

        const newState = {...this.state};
        newState.formData = {...newState.formData};

        const props = this.props;

        const {
            formData,
            snackMessage
        } = newState;

        const sendData = Object.keys(formData).reduce(function (a, key, i) {
            const data = {...formData[key]};
            if (key !== "submit" && data.type !== "submit") {

                let parent = a;
                let lastKey = key;

                if (key.match(".")){
                    const names = key.split(".");
                    if (names.length > 1) {
                        names.forEach(function (name, i) {
                            if (!parent[name]){
                                parent[name] = {};
                            }
                            if (i < names.length-1) {
                                parent = parent[name];
                            }
                            lastKey = name;
                        })
                    }
                }

                parent[lastKey] = (data.value) ? data.value : (data.required) ? props.formData[key].default : null;
            }
            return a;
        }, {})

        const response = await onSubmit(e, sendData);

        if (response && response.error){

            const message = response.error.message;
            const errors = response.error.errors;

            let shouldSetState = false;

            if (errors && errors.length){
                errors.forEach(function (error) {
                    const message = error.message;
                    const path = error.path;
                    if (formData[path] && formData[path].helperText !== message){
                        formData[path].helperText = message;
                        formData[path].error = !!(formData[path].helperText);
                        shouldSetState = true;
                    }
                })
            }

            if (message && snackMessage !== message){
                newState.snackMessage = message;
                shouldSetState = true;
            }

            if (shouldSetState){
                this.setState(newState)
            }

        } else if (response){
            if (successMessage){
                newState.snackMessage = successMessage;
                this.setState(newState)
            }
        }

        return response;

    }
    render() {

        const onSubmit = this.onSubmit;
        const onChange = this.onChange;
        const handleCloseSnackbar = this.handleCloseSnackbar;

        const {
            formData,
            snackMessage
        } = this.state;

        const {
            materialStyle,
        } = this.props;

        return (
            <div className={style.formContainer}>
                <form className={style.form}
                      autoComplete={"off"}
                      noValidate
                      onSubmit={onSubmit}
                >
                    {[...Object.keys(formData).map(function(key, i) {

                        if (!formData[key].hidden) {

                            const {props, Component} = generatePropsAndSelectComponent({
                                formData,
                                key,
                                onSubmit,
                                onChange
                            });

                            return (
                                <Component {...props} />
                            )
                        }

                        return null;
                    })]}
                </form>

                <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    open={!!(snackMessage)}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={snackMessage}
                />

            </div>
        )
    }
}

Form.contextType = WappContext;

const WappComponent = withWapp(Form);

export default withMaterialStyles(materialStyle, WappComponent);
