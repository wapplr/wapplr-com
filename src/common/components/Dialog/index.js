import React, {useEffect, useState, useContext, useRef} from "react";

import {WappContext} from "wapplr-react/dist/common/Wapp";

import MaterialDialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import {withMaterialStyles} from "../Template/withMaterial";
import materialStyle from "./materialStyle";
import style from "./style.css";
import clsx from "clsx";

function Dialog(props) {

    const context = useContext(WappContext);

    const {wapp} = context;

    wapp.styles.use(style);

    const {
        cancelText = "Cancel",
        submitText = "Submit",
        dialogTitle = "Alert",
        dialogContent = "Are you sure?"
    } = props;

    const [open, setOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [dialogProps, setDialogProps] = useState({cancelText, submitText, dialogTitle, dialogContent});

    const handleOpen = (dialogProps) => {
        if (dialogProps){
            setDialogProps(dialogProps)
        }
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
        if (dialogProps.onCancel){
            dialogProps.onCancel()
        }
    };

    const handleSubmit = async (e, formData) => {
        if (!formData && form.current){
            e.preventDefault();
            return await form.current.onSubmit(e);
        }
        if (e){
            e.preventDefault();
        }
        if (dialogProps.onSubmit){

            const response = await dialogProps.onSubmit(e, formData);

            if ((response && response.error) || (response && response.errors)){

                if (form.current){
                    return response;
                } else {
                    setOpen(false);
                }

                const message = response.error?.message || response.errors?.["0"]?.message;

                if (message && snackMessage !== message){
                    setSnackMessage(message);
                }

            } else if (response){
                if (dialogProps.successMessage){
                    setSnackMessage(dialogProps.successMessage);
                }
                setOpen(false);
            }

        } else {
            setOpen(false);
        }
    };

    const handleCloseSnackbar = function (e, reason) {
        if (snackMessage) {
            setSnackMessage("")
        }
    };

    useEffect(function () {

        const actions = {
            open: handleOpen,
            cancel: handleCancel,
            submit: handleSubmit,
        };

        if (props.effect) {
            props.effect({
                actions
            })
        }
    });

    const Form = dialogProps.Form;

    const form = useRef();

    const formSubmit = async function (e, formData) {
        return await handleSubmit(e, formData);
    };

    return (
        <>
            <MaterialDialog
                className={clsx(style.dialog, materialStyle.dialog)}
                open={open}
                onClose={handleCancel}
                aria-labelledby={"post-dialog-title"}
                aria-describedby={"post-dialog-description"}
            >
                <DialogTitle id={"post-dialog-title"}>{dialogProps.dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id={"post-dialog-description"}>
                        {dialogProps.dialogContent}
                    </DialogContentText>
                    {(Form) ?
                        <Form
                            setFormRef={form}
                            onSubmit={formSubmit}
                        />
                        : null
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} >
                        {dialogProps.cancelText}
                    </Button>
                    <Button onClick={handleSubmit} autoFocus>
                        {dialogProps.submitText}
                    </Button>
                </DialogActions>
            </MaterialDialog>
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
        </>
    )
}

export default withMaterialStyles(materialStyle, Dialog);
