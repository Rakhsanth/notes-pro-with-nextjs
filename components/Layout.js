import { Fragment } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

function Layout({ children }) {
    return (
        <Fragment>
            <Head>
                <title>Notes Pro</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <Navbar />
            {children}
        </Fragment>
    );
}

export default Layout;
