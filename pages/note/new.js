import { Link } from 'next/link';
import { useRouter } from 'next/router';
// React related
import React, { Fragment, useEffect, useState } from 'react';
// API calls related
import axios from 'axios';
import { apiBaseURL } from '../../config/config';
import { createNote } from '../../apis/notes';
// Material UI components
import {
    makeStyles,
    Container,
    Grid,
    TextField,
    Button,
    TextareaAutosize,
    Dialog,
    CircularProgress,
    Typography,
} from '@material-ui/core';
//Form and formik, Yup related
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// redux and actions related
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'relative',
        marginTop: '5rem',
        minHeight: '20rem',
        width: '60vw',
        backgroundColor: 'white',
        boxShadow: '0.25rem 0.25rem 3rem #B4B4B4',
        borderRadius: '1rem',
        [theme.breakpoints.down('xs')]: {
            marginTop: '1rem',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            borderRadius: 'none',
        },
    },
    grid: {
        margin: '0 auto',
        padding: '2rem 0',
    },
    gridItem: {
        width: '75%',
    },
    textField: {
        width: '100% !important',
    },
    btn: {
        margin: '0 50%',
        transform: 'translateX(-50%)',
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

function New(props) {
    const classes = useStyles();

    const { loading, loggedIn } = props;

    const router = useRouter();

    const [submitting, setsubmitting] = useState(false);

    useEffect(() => {
        if (!loggedIn) {
            router.replace('/login');
        }
    }, [loading, loggedIn]);

    const initialValues = {
        title: '',
        description: '',
    };
    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Note title cannot be empty')
            .max(100, 'Title must have atmost 100 characters'),
        description: Yup.string()
            .required('Note description cannot be empty')
            .max(3000, 'Title must have atmost 3000 characters'),
    });
    const onSubmit = async (values, onSubmitProps) => {
        // console.log(values);
        setsubmitting(true);
        createNote(values);
        router.replace('/');
        setsubmitting(false);
    };

    return (
        <Container className={classes.container}>
            <Fragment>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(formik) => {
                        // console.log(formik);
                        return (
                            <Form>
                                <Grid
                                    className={classes.grid}
                                    alignItems="center"
                                    container
                                    direction="column"
                                    spacing={2}
                                >
                                    <Grid item className={classes.gridItem}>
                                        <Field name="title">
                                            {(fieldProps) => {
                                                const {
                                                    field,
                                                    form,
                                                } = fieldProps;
                                                return (
                                                    <TextField
                                                        className={
                                                            classes.textField
                                                        }
                                                        id="title"
                                                        label="Title"
                                                        variant="outlined"
                                                        {...field}
                                                        error={
                                                            formik.touched
                                                                .title &&
                                                            Boolean(
                                                                formik.errors
                                                                    .title
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched
                                                                .title &&
                                                            Boolean(
                                                                formik.errors
                                                                    .title
                                                            )
                                                                ? formik.errors
                                                                      .title
                                                                : null
                                                        }
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </Grid>
                                    <Grid item className={classes.gridItem}>
                                        <Field name="description">
                                            {(fieldProps) => {
                                                const {
                                                    field,
                                                    form,
                                                } = fieldProps;
                                                return (
                                                    <TextField
                                                        className={
                                                            classes.textField
                                                        }
                                                        multiline
                                                        rows={1}
                                                        rowsMax={10}
                                                        id="description"
                                                        {...field}
                                                        placeholder="Short Description"
                                                        error={
                                                            formik.touched
                                                                .description &&
                                                            Boolean(
                                                                formik.errors
                                                                    .description
                                                            )
                                                        }
                                                        helperText={
                                                            formik.touched
                                                                .description &&
                                                            Boolean(
                                                                formik.errors
                                                                    .description
                                                            )
                                                                ? formik.errors
                                                                      .description
                                                                : null
                                                        }
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </Grid>
                                    <Grid item className={classes.gridItem}>
                                        <Button
                                            className={classes.btn}
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                        >
                                            Create
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        );
                    }}
                </Formik>
                <Dialog
                    className={classes.dialog}
                    open={submitting}
                    aria-labelledby="simple-dialog-title"
                >
                    <CircularProgress />
                </Dialog>
            </Fragment>
        </Container>
    );
}

const mapStateToProps = (store) => ({
    loading: store.auth.loading,
});

// This gets called on every request
export async function getStaticProps(context) {
    // Fetch data from external API
    // console.log(context.req.headers.cookie);
    // const noteId = context.query.id;

    const getURL = `${apiBaseURL}/users/auth/me`;

    let response;
    let data;
    try {
        response = await axios.get(getURL, {
            headers: {
                'Content-Type': 'application/json',
                cookie: context.req ? context.req.headers.cookie : null,
            },
            withCredentials: true,
        });

        data = response.data.data;
        // Pass data to the page via props
    } catch (err) {
        // console.log(err.response);
    }
    return { props: { loggedIn: true } };
}

export default connect(mapStateToProps)(New);
