// Next related
import { useRouter } from 'next/router';
// React stuff
import React, { useState, useEffect } from 'react';
// API related
import axios from 'axios';
import { apiBaseURL } from '../../../config/config';
// Material UI related
import {
    Card,
    CardHeader,
    Container,
    CardContent,
    Grid,
    makeStyles,
    Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// redux related
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: '5rem',
        paddingTop: '2rem',
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
    card: {},
    title: {
        textAlign: 'center',
    },
}));

function Index(props) {
    const classes = useStyles();

    const { noteId, notes, loading, loggedIn } = props;

    const [note, setnote] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (!loading && !loggedIn) {
            router.replace('/login');
        } else {
            const currentNote = notes.find((note) => note._id === noteId);
            setnote(currentNote);
        }
    }, [notes, loading]);

    return (
        <Container className={classes.container}>
            {note ? (
                <Card className={classes.card}>
                    <CardHeader
                        title={
                            <Typography className={classes.title} variant="h6">
                                {note.title}
                            </Typography>
                        }
                    />
                    <CardContent>
                        <Typography variant="body1">
                            {note.description}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <CircularProgress />
            )}
        </Container>
    );
}

// This gets called on every request
export async function getServerSideProps(context) {
    // Fetch data from external API
    // console.log(context);
    // console.log(context.req);
    console.log(context.req.headers);
    console.log(context.req.cookies);
    const noteId = context.params.id;
    // let note;
    // try {
    //     const response = await axios.get(`${apiBaseURL}/notes/${noteId}`, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             cookie: context.req ? context.req.headers.cookie : undefined,
    //         },
    //         withCredentials: true,
    //     });

    //     console.log(response.data);
    //     note = response.data.data;
    // } catch (err) {
    //     console.log(err);
    //     return {
    //         props: { note },
    //     };
    // }
    // Pass data to the page via props
    return {
        // props: { note },
        props: { noteId },
    };
}

const mapStateToProps = (store) => ({
    loading: store.auth.loading,
    loggedIn: store.auth.loggedIn,
    notes: store.notes.notes,
});

export default connect(mapStateToProps)(Index);
