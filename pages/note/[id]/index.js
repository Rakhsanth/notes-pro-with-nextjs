import React from 'react';
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

    const { note } = props;
    console.log(note);

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
    // console.log(context.req.headers.cookie);
    const noteId = context.query.id;

    const getURL = `${apiBaseURL}/notes/${noteId}`;

    let response;
    let note;
    try {
        response = await axios.get(getURL, {
            headers: {
                'Content-Type': 'application/json',
                cookie: context.req ? context.req.headers.cookie : null,
            },
            withCredentials: true,
        });

        console.log(response.data);
        note = response.data.data;
        // Pass data to the page via props
    } catch (err) {
        console.log(err.response);
    }
    return { props: { note } };
}

export default Index;
