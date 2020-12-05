import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
    overrides: {
        MuiButtonBase: {
            root: {
                '&:disabled': {
                    cursor: 'not-allowed',
                    pointerEvents: 'auto',
                },
            },
        },
    },
});

export default theme;
