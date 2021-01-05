import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';

// Global css
import '../styles/globals.css';

// Redux store and actions
import { Provider } from 'react-redux';
import { useStore } from '../store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

// Components
import Layout from '../components/Layout';
// Actions
import { loadUser, resetLoading } from '../actions';

export default function MyApp(props) {
    const { Component, pageProps } = props;

    const store = useStore(pageProps.initialReduxState);
    const persistor = persistStore(store, {}, function () {
        persistor.persist();
    });

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        store.dispatch(resetLoading('notes'));
        store.dispatch(loadUser());
    }, []);

    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to
            build upon. */}
            <CssBaseline />
            <Provider store={store}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        </ThemeProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
