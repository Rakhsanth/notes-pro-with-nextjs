import Head from 'next/head';
import { Link } from 'next/link';
import { useRouter } from 'next/router';
// React related
import { useEffect, useState, Fragment } from 'react';
// Redux related
import { connect } from 'react-redux';
import { getNotes } from '../actions';
// Material UI components
import {
    Button,
    Card,
    Grid,
    makeStyles,
    Typography,
    ButtonBase,
    Dialog,
    CircularProgress,
} from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

// API related
import axios from 'axios';
import { apiBaseURL } from '../config/config';
import { deleteNote } from '../apis/notes';

import styles from '../styles/Home.module.css';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: '5rem',
        marginBottom: '5rem',
        minHeight: '20rem',
        width: '95vw',
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
    card: {
        borderRadius: '1rem',
        padding: '1rem',
        width: '95%',
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto',
        },
    },
    title: {
        marginLeft: '0.5rem',
        fontSize: '1.1rem',
    },
    btn: {
        marginLeft: '1rem',
    },
    deleteButton: {
        padding: '0.5rem',
        backgroundColor: '#9A0036',
        marginLeft: 'auto',
        borderRadius: '50%',
    },
    deleteIcon: {
        fill: 'white',
    },
    addIcon: {
        position: 'fixed',
        bottom: '5vh',
        right: '5%',
        backgroundColor: '#E0E0E0',
        padding: '0.5rem',
        borderRadius: '50%',
    },
}));

function Index(props) {
    const classes = useStyles();

    const { loading, isLoggedIn, user, getNotes, notes } = props;

    const router = useRouter();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.replace('/login');
        }
    }, [loading, isLoggedIn]);
    useEffect(() => {
        if (user) {
            getNotes(null, 'all');
        }
    }, [loading, isLoggedIn]);

    const handleNoteDelete = async (noteId) => {
        await deleteNote(noteId);
        getNotes(null, 'all');
    };
    const handleAddButton = () => {
        router.push('/note/new');
    };

    return (
        <Fragment>
            <Container className={classes.container}>
                <Grid container spacing={3}>
                    {notes.totalCount !== 0 ? (
                        notes.notes.map((note) => {
                            console.log(note._id);
                            return (
                                <Grid key={note._id} item sm={12} md container>
                                    <Card className={classes.card}>
                                        <Grid
                                            item
                                            sm={12}
                                            container
                                            direction="column"
                                            spacing={2}
                                        >
                                            <Grid item>
                                                <Typography
                                                    className={classes.title}
                                                    variant="h6"
                                                >
                                                    {note.title}
                                                </Typography>
                                            </Grid>
                                            <Grid item container>
                                                <Button
                                                    component={Link}
                                                    href={`/note/${note._id}`}
                                                    variant="contained"
                                                    color="default"
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    href={`/note/${note._id}/edit`}
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.btn}
                                                >
                                                    Edit
                                                </Button>

                                                <ButtonBase
                                                    className={
                                                        classes.deleteButton
                                                    }
                                                    onClick={() =>
                                                        handleNoteDelete(
                                                            note._id
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon
                                                        className={
                                                            classes.deleteIcon
                                                        }
                                                    />
                                                </ButtonBase>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            );
                        })
                    ) : (
                        <Typography variant="h6">
                            No created notes yet !!!
                        </Typography>
                    )}
                </Grid>
                <ButtonBase
                    className={classes.addIcon}
                    onClick={handleAddButton}
                >
                    <AddIcon
                        color="primary"
                        style={{ width: '3rem', height: '3rem' }}
                    />
                </ButtonBase>
            </Container>
        </Fragment>
    );
}

const mapStateToProps = (store) => ({
    loading: store.auth.loading,
    isLoggedIn: store.auth.loggedIn,
    user: store.auth.user,
    loadingNotes: store.notes.loading,
    notes: store.notes,
});

export default connect(mapStateToProps, { getNotes })(Index);
