// Next related
// React & MUI related related
import { Grid, makeStyles, TextField } from '@material-ui/core';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Button,
    CircularProgress,
    Typography,
} from '@material-ui/core';
// Formik and Yup
import { Formik, Form, Field } from 'formik';
import { Fragment, useState } from 'react';
import * as Yup from 'yup';
// API calls
import { changePassword } from '../apis/user';
// Utils
import { validatePassword } from '../utils/formValidators';

const useStyles = makeStyles((theme) => ({
    gridItems: {
        width: '100%',
    },
    inputs: {
        width: '100%',
    },
    dialogProgress: {
        '& .MuiDialog-paperWidthSm': {
            width: '3rem',
            height: '3rem',
            backgroundColor: 'transparent',
            boxShadow: 'none',
        },
    },
    dialogMsg: {
        '& .MuiDialog-paperWidthSm': {
            padding: '2rem',
            width: '50%',
        },
    },
    dialog: {
        '& .MuiDialog-paperWidthSm': {
            width: '50%',
        },
    },
    errorMsg: {
        color: '#3F51B5',
    },
}));

function ChangePassword(props) {
    const classes = useStyles();

    const { openDialog, handleCloseChangePassword } = props;

    const [showError, setshowError] = useState(false);
    const [submitting, setsubmitting] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');

    const initialValues = {
        currentPassword: '',
        newPassword1: '',
        newPassword2: '',
    };
    const validationSchema = Yup.object({
        currentPassword: Yup.string().required(
            'Current Password cannot be empty'
        ),
        newPassword1: Yup.string()
            .test(
                'passwordValidator',
                'Password must have upper, lowercase, number, symbols and atleast 8 characters',
                (value) => validatePassword(value)
            )
            .test(
                'prevCurrentPassMatch',
                'Old and new password should not be same',
                function (value) {
                    return value !== this.parent.currentPassword;
                }
            ),
        newPassword2: Yup.string()
            .test(
                'compare passwords',
                'The new passwords does not match',
                function (value) {
                    return (
                        value &&
                        value.length !== 0 &&
                        value === this.parent.newPassword1
                    );
                }
            )
            .required('Confirm password cannot be blank'),
    });
    const onSubmit = async (values) => {
        const value = {};
        value.oldPassword = values.currentPassword;
        value.newPassword = values.newPassword1;
        setsubmitting(true);
        const data = await changePassword(value);
        if (data.success) {
            seterrorMessage('SuccessFully Changed');
            setshowError(true);
            setTimeout(() => {
                setshowError(false);
                setsubmitting(false);
                handleCloseChangePassword();
            }, 2000);
        } else {
            const message = data.data;
            seterrorMessage(message);
            setshowError(true);
            // console.log(data);
            setTimeout(() => {
                setshowError(false);
                setsubmitting(false);
            }, 2000);
        }
    };

    return (
        <Fragment>
            <Dialog
                className={classes.dialog}
                open={openDialog}
                onClose={() => handleCloseChangePassword()}
            >
                <DialogTitle>Change password</DialogTitle>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => {
                        // console.log(formik);
                        return (
                            <Form>
                                <DialogContent dividers>
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="column"
                                        alignItems="flex-start"
                                    >
                                        <Grid
                                            className={classes.gridItems}
                                            item
                                        >
                                            <Field name="currentPassword">
                                                {({ field, form }) => (
                                                    <TextField
                                                        className={
                                                            classes.inputs
                                                        }
                                                        id="currentPassword"
                                                        label="Current Password"
                                                        variant="outlined"
                                                        type="password"
                                                        {...field}
                                                        error={
                                                            formik.touched
                                                                .currentPassword &&
                                                            Boolean(
                                                                formik.errors
                                                                    .currentPassword
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched
                                                                .currentPassword &&
                                                            Boolean(
                                                                formik.errors
                                                                    .currentPassword
                                                            )
                                                                ? formik.errors
                                                                      .currentPassword
                                                                : null
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                                        <Grid
                                            className={classes.gridItems}
                                            item
                                        >
                                            <Field name="newPassword1">
                                                {({ field, form }) => (
                                                    <TextField
                                                        className={
                                                            classes.inputs
                                                        }
                                                        id="newPassword1"
                                                        label="New Password"
                                                        variant="outlined"
                                                        type="password"
                                                        {...field}
                                                        error={
                                                            formik.touched
                                                                .newPassword1 &&
                                                            Boolean(
                                                                formik.errors
                                                                    .newPassword1
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched
                                                                .newPassword1 &&
                                                            Boolean(
                                                                formik.errors
                                                                    .newPassword1
                                                            )
                                                                ? formik.errors
                                                                      .newPassword1
                                                                : null
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                                        <Grid
                                            className={classes.gridItems}
                                            item
                                        >
                                            <Field name="newPassword2">
                                                {({ field, form }) => (
                                                    <TextField
                                                        className={
                                                            classes.inputs
                                                        }
                                                        id="newPassword2"
                                                        label="Confirm New Password"
                                                        variant="outlined"
                                                        type="password"
                                                        {...field}
                                                        error={
                                                            formik.touched
                                                                .newPassword2 &&
                                                            Boolean(
                                                                formik.errors
                                                                    .newPassword2
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched
                                                                .newPassword2 &&
                                                            Boolean(
                                                                formik.errors
                                                                    .newPassword2
                                                            )
                                                                ? formik.errors
                                                                      .newPassword2
                                                                : null
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button type="submit" color="primary">
                                        Change
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            handleCloseChangePassword()
                                        }
                                        color="secondary"
                                        autoFocus
                                    >
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Form>
                        );
                    }}
                </Formik>
            </Dialog>
            <Dialog
                className={classes.dialogProgress}
                open={submitting}
                aria-labelledby="simple-dialog-title"
            >
                <CircularProgress />
            </Dialog>
            <Dialog
                className={classes.dialogMsg}
                open={showError}
                aria-labelledby="simple-dialog-title"
            >
                <Typography className={classes.errorMsg} variant="body2">
                    {errorMessage}
                </Typography>
            </Dialog>
        </Fragment>
    );
}

export default ChangePassword;
