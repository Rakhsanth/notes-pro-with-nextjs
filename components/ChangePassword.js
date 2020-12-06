// Next related
// React & MUI related related
import { Grid, makeStyles, TextField } from '@material-ui/core';
// Formik and Yup
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
// Utils
import { validatePassword } from '../utils/formValidators';

const useStyles = makeStyles((theme) => ({
    gridItems: {
        width: '100%',
    },
    inputs: {
        width: '100%',
    },
}));

function ChangePassword(props) {
    const classes = useStyles();

    const { handleSetFormValues } = props;

    const initialValues = {
        currentPassword: '',
        newPassword1: '',
        newPassword2: '',
    };
    const validationSchema = Yup.object({
        currentPassword: Yup.string().required(
            'Current Password cannot be empty'
        ),
        newPassword1: Yup.string().test(
            'passwordValidator',
            'Password must have upper, lowercase, number, symbols and atleast 8 characters',
            (value) => validatePassword(value)
        ),
        newPassword2: Yup.string().test(
            'compare passwords',
            'The new passwords does not match',
            function (value) {
                return value === this.parent.newPassword1;
            }
        ),
    });
    const onSubmit = (values) => {
        if (values.currentPassword === values.newPassword1) {
            return {
                newPassword2: 'Current and new passwords should not be same',
            };
        }
        const value = {};
        value.oldPassword = values.currentPassword;
        value.newPassword = values.newPassword1;
        handleSetFormValues(value);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validate={onSubmit}
        >
            {(formik) => {
                console.log(formik);
                return (
                    <Form>
                        <Grid
                            container
                            spacing={2}
                            direction="column"
                            alignItems="flex-start"
                        >
                            <Grid className={classes.gridItems} item>
                                <Field name="currentPassword">
                                    {({ field, form }) => (
                                        <TextField
                                            className={classes.inputs}
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
                            <Grid className={classes.gridItems} item>
                                <Field name="newPassword1">
                                    {({ field, form }) => (
                                        <TextField
                                            className={classes.inputs}
                                            id="newPassword1"
                                            label="New Password"
                                            variant="outlined"
                                            type="password"
                                            {...field}
                                            error={
                                                formik.touched.newPassword1 &&
                                                Boolean(
                                                    formik.errors.newPassword1
                                                )
                                            }
                                            helperText={
                                                formik.touched.newPassword1 &&
                                                Boolean(
                                                    formik.errors.newPassword1
                                                )
                                                    ? formik.errors.newPassword1
                                                    : null
                                            }
                                        />
                                    )}
                                </Field>
                            </Grid>
                            <Grid className={classes.gridItems} item>
                                <Field name="newPassword2">
                                    {({ field, form }) => (
                                        <TextField
                                            className={classes.inputs}
                                            id="newPassword2"
                                            label="Confirm New Password"
                                            variant="outlined"
                                            type="password"
                                            {...field}
                                            error={
                                                formik.touched.newPassword2 &&
                                                Boolean(
                                                    formik.errors.newPassword2
                                                )
                                            }
                                            helperText={
                                                formik.touched.newPassword2 &&
                                                Boolean(
                                                    formik.errors.newPassword2
                                                )
                                                    ? formik.errors.newPassword2
                                                    : null
                                            }
                                        />
                                    )}
                                </Field>
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default ChangePassword;
