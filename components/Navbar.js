// Next related
import Link from 'next/link';
import { useRouter } from 'next/router';
// React related
import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import MUILink from '@material-ui/core/Link';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Button,
    CircularProgress,
} from '@material-ui/core';
// Redux related
import { connect } from 'react-redux';
import { logout } from '../actions';
import ChangePassword from './ChangePassword';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        marginLeft: '50%',
        transform: 'translateX(-50%)',
        display: 'block',
        [theme.breakpoints.down('md')]: {
            display: 'block',
            marginLeft: '45%',
            transform: 'translateX(-50%)',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'block',
            marginLeft: '40%',
            transform: 'translateX(-50%)',
        },
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            marginLeft: '35%',
            transform: 'translateX(-50%)',
        },
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    links: {
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
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

function Navbar(props) {
    const classes = useStyles();

    const { loading, isLoggedIn, logout } = props;
    const router = useRouter();

    const [showError, setshowError] = useState(false);
    const [submitting, setsubmitting] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [openDialog, setopenDialog] = useState(false);
    const [formValue, setformValue] = useState(null);

    const [errorMessage, seterrorMessage] = useState('');

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const openChangeDialog = () => {
        handleMenuClose();
        handleMobileMenuClose();
        setopenDialog(true);
    };

    const handleSetFormValues = (values) => {
        setformValue(values);
        // console.log(values);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        handleMobileMenuClose();
        router.replace('/login');
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={openChangeDialog}>Change password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={openChangeDialog}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Change password</p>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <LogoutIcon />
                </IconButton>
                <p>Logout</p>
            </MenuItem>
        </Menu>
    );

    const handleCloseChangePassword = () => {
        setopenDialog(false);
    };

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h5">
                        <Link href="/">
                            <MUILink className={classes.links}>
                                Notes Pro
                            </MUILink>
                        </Link>
                    </Typography>

                    <div className={classes.grow} />
                    {isLoggedIn ? (
                        <Fragment>
                            <div className={classes.sectionDesktop}>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </div>
                            <div className={classes.sectionMobile}>
                                <IconButton
                                    aria-label="show more"
                                    aria-controls={mobileMenuId}
                                    aria-haspopup="true"
                                    onClick={handleMobileMenuOpen}
                                    color="inherit"
                                >
                                    <MoreIcon />
                                </IconButton>
                            </div>
                        </Fragment>
                    ) : null}
                </Toolbar>
            </AppBar>
            {isLoggedIn ? renderMobileMenu : null}
            {isLoggedIn ? renderMenu : null}

            <ChangePassword
                openDialog={openDialog}
                handleCloseChangePassword={handleCloseChangePassword}
            />
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
        </div>
    );
}

const mapStateToProps = (store) => ({
    loading: store.auth.loading,
    isLoggedIn: store.auth.loggedIn,
});

export default connect(mapStateToProps, { logout })(Navbar);
