// Next related
import Link from 'next/link';
import { useRouter } from 'next/router';
// React related
import React, { useState, Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
// import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import { red } from '@material-ui/core/colors';
// Formik
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// Redux and actions
import { connect } from 'react-redux';
import { loginUser } from '../../actions';
// custom css file
// import styles from './login.module.css';
// Utils
import { validatePassword } from '../../utils/formValidators';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '20vh auto',
        maxWidth: 345,
        borderRadius: '1rem',
    },
    textFieldRoot: {
        '& .MuiOutlinedInput-input': {
            padding: '1.1rem 1rem',
        },
        '&:nth-last-of-type(1)': {
            marginTop: '1rem',
            marginBottom: '1rem',
        },
    },
    btn: {
        padding: '1rem',
        marginBottom: '1rem',
    },
    title: {
        display: 'inline-block',
        marginLeft: '50%',
        transform: 'translateX(-50%)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'center',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    links: {
        margin: '0 auto',
        cursor: 'pointer',
    },
    dialog: {
        '& .MuiDialog-paperWidthSm': {
            width: '3rem',
            height: '3rem',
            backgroundColor: 'transparent',
            boxShadow: 'none',
        },
    },
}));

const initialValues = {
    userName: '',
    password: '',
};
const validationSchema = Yup.object({
    userName: Yup.string().required('Username is mandatory'),
    password: Yup.string().test(
        'passwordValidator',
        'Password must have upper, lowercase, number, symbols and atleast 8 characters',
        (value) => validatePassword(value)
    ),
});

function Login(props) {
    const classes = useStyles();

    const router = useRouter();

    const { loginUser, loading, isLoggedIn } = props;
    // let isLoggedIn = false;

    const [isSubmitting, setisSubmitting] = useState(false);
    // console.log(isSubmitting);

    useEffect(() => {
        if (!loading && isLoggedIn) {
            router.replace('/');
        }
    }, [loading, isLoggedIn]);

    const onSubmit = (values, onSubmitProps) => {
        setisSubmitting(true);
        loginUser(values);
        setisSubmitting(false);
        router.replace('/');
    };

    return (
        <Fragment>
            <Card className={classes.root}>
                <CardHeader
                    title={
                        <Typography variant="h5" className={classes.title}>
                            Login
                        </Typography>
                    }
                />
                <CardContent className={classes.cardContent}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {(formik) => {
                            // console.log(formik);
                            return (
                                <Form className={classes.cardContent}>
                                    <Field name="userName">
                                        {({ field, form }) => {
                                            return (
                                                <TextField
                                                    {...field}
                                                    className={
                                                        classes.textFieldRoot
                                                    }
                                                    id="username"
                                                    label="Username"
                                                    type="search"
                                                    variant="outlined"
                                                    error={
                                                        formik.touched
                                                            .userName &&
                                                        Boolean(
                                                            formik.errors
                                                                .userName
                                                        )
                                                    }
                                                    helperText={
                                                        formik.touched
                                                            .userName &&
                                                        Boolean(
                                                            formik.errors
                                                                .userName
                                                        )
                                                            ? formik.errors
                                                                  .userName
                                                            : null
                                                    }
                                                />
                                            );
                                        }}
                                    </Field>
                                    <Field name="password">
                                        {({ field, form }) => {
                                            return (
                                                <TextField
                                                    className={
                                                        classes.textFieldRoot
                                                    }
                                                    {...field}
                                                    id="password"
                                                    label="Password"
                                                    type="password"
                                                    variant="outlined"
                                                    error={
                                                        formik.touched
                                                            .password &&
                                                        Boolean(
                                                            formik.errors
                                                                .password
                                                        )
                                                    }
                                                    helperText={
                                                        formik.touched
                                                            .password &&
                                                        Boolean(
                                                            formik.errors
                                                                .password
                                                        )
                                                            ? formik.errors
                                                                  .password
                                                            : null
                                                    }
                                                />
                                            );
                                        }}
                                    </Field>
                                    <Button
                                        className={classes.btn}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Login
                                    </Button>
                                </Form>
                            );
                        }}
                    </Formik>

                    <Typography className={classes.links}>
                        <Link href="/register">
                            <MuiLink>
                                Not a user yet? Please register here !!!
                            </MuiLink>
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
            <Dialog
                className={classes.dialog}
                open={isSubmitting}
                aria-labelledby="simple-dialog-title"
            >
                <CircularProgress />
            </Dialog>
        </Fragment>
    );
}

const mapStateToProps = (store) => ({
    loading: store.auth.loading,
    isLoggedIn: store.auth.loggedIn,
});

export default connect(mapStateToProps, { loginUser })(Login);
