import { Link } from 'next/link';
import { useRouter } from 'next/router';
// React related
import React, { Fragment, useEffect, useState } from 'react';
// API calls related
import { apiBaseURL } from '../../../config/config';
import axios from 'axios';
import { updateNote } from '../../../apis/notes';
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
// redux related
import { connect } from 'react-redux';
import { resetLoading } from '../../../actions';

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

function Edit(props) {
    const classes = useStyles();

    const { note, loading, loggedIn, resetLoading } = props;

    const router = useRouter();

    const [submitting, setsubmitting] = useState(false);

    // useEffect(() => {
    //     if (loading) {
    //     }
    //     if (!loggedIn) {
    //         router.replace('/login');
    //     }
    // }, [loading, loggedIn]);

    const initialValues = {
        title: note ? note.title : '',
        description: note ? note.description : '',
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
        await updateNote(values, note._id);
        resetLoading('notes');
        router.replace('/');
        setsubmitting(false);
    };

    const checkLoggedIn = () => {
        if (!loggedIn) {
            router.replace('/login');
        }
        return null;
    };

    return (
        <Container className={classes.container}>
            {note ? (
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
                                                                    formik
                                                                        .errors
                                                                        .title
                                                                )
                                                            }
                                                            helperText={
                                                                formik.touched
                                                                    .title &&
                                                                Boolean(
                                                                    formik
                                                                        .errors
                                                                        .title
                                                                )
                                                                    ? formik
                                                                          .errors
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
                                                                    formik
                                                                        .errors
                                                                        .description
                                                                )
                                                            }
                                                            helperText={
                                                                formik.touched
                                                                    .description &&
                                                                Boolean(
                                                                    formik
                                                                        .errors
                                                                        .description
                                                                )
                                                                    ? formik
                                                                          .errors
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
                                                disabled={
                                                    !(
                                                        formik.isValid &&
                                                        formik.dirty
                                                    )
                                                }
                                            >
                                                Save
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
            ) : null}
        </Container>
    );
}

// This gets called on every request
export async function getServerSideProps(context) {
    // console.log(context);
    // Fetch data from external API
    // console.log(context.req.headers.cookie);

    let note;
    const noteId = context.query.id;
    try {
        const res = await axios.get(`${apiBaseURL}/users/auth/me`, {
            headers: {
                'Content-Type': 'application/json',
                cookie: context.req ? context.req.headers.cookie : null,
            },
            withCredentials: true,
        });
        const data = res.data.data;

        if (!data._id) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        } else {
            const response = await axios.get(`${apiBaseURL}/notes/${noteId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    cookie: context.req ? context.req.headers.cookie : null,
                },
                withCredentials: true,
            });
            console.log(response.data);
            note = response.data.data;
        }
    } catch (err) {
        console.log(err.response);
    }
    // Pass data to the page via props
    return { props: { note } };
}

const mapStateToProps = (store) => ({
    loading: store.auth.loading,
    loggedIn: store.auth.loggedIn,
});

export default connect(mapStateToProps, { resetLoading })(Edit);
