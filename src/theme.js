import { createTheme } from '@material-ui/core/styles';

const jayPurple = "#4e0166";
const jayAqua = "#ebfffc";
const jayBlue = "#007d93";
const jayWhite = "#ffffff";
const jayGray = "#5e5e5e";
const jayLightGray = "#cccccc";
const jayOrange = "#ff6f00";
const jayLightOrange = "#ffe4bf";
const jayRed = "#d43f35";
const jayGreen = "#07c700";
const jayBlack = "#1f1f1f";

export default createTheme({
    palette: {
        common: {
            purple: `${jayPurple}`,
            aqua: `${jayAqua}`,
            white: `${jayWhite}`,
            gray: `${jayGray}`,
            blue: `${jayBlue}`,
            orange: `${jayOrange}`,
            lightOrange: `${jayLightOrange}`,
            lightGray: `${jayLightGray}`,
            red: `${jayRed}`,
            green: `${jayGreen}`,
            black: `${jayBlack}`
        },
        primary: {
            main: `${jayBlue}`
        },
        secondary: {
            main: `${jayPurple}`
        }
    },
    typography: {
        fontSize: 12,
        fontFamily: [
            'Roboto',
            // 'Inconsolata',
            // 'Lexend Exa',
            // 'Mate SC',
            // 'Unica One'
        ].join(','),
        h3: {
            fontWeight: 1000
        }
    },
    button: {
        
    },
    overrides: {
        MuiLink: {
            root: {
                "&:hover": {
                    cursor: "pointer"
                }
            }
        }
    }
});