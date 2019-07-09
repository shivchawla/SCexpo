import { StyleSheet } from 'react-native';

const magicNumber = 11;

const colours = {
    white: '#fff'
};

const appFont = {
    fontFamily: 'open-sans'
};

export default StyleSheet.create({
    container: {
        paddingRight: magicNumber * 3,
        paddingLeft: magicNumber * 3,
        paddingTop: magicNumber * 3,
        marginTop: magicNumber * 5
    },
    welcome: {
        fontSize: magicNumber * 4,
        color: colours.white,
        ...appFont,
        backgroundColor: 'transparent',
        marginBottom: magicNumber * 2,
        textAlign: 'center'
    },
    welcomeSubtext: {
        fontSize: magicNumber * 2,
        color: colours.white,
        backgroundColor: 'transparent',
        ...appFont,
        textAlign: 'center'
    },
    facebookButton: {
        padding: magicNumber,
        alignItems: 'center',
        borderRadius: magicNumber,
        marginTop: magicNumber * 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    facebookIcon: {
        color: colours.white,
        fontSize: 29,
        backgroundColor: 'transparent'
    },
    facebookButtonText: {
        marginLeft: magicNumber * 2,
        backgroundColor: 'transparent',
        fontSize: 18,
        color: colours.white,
        ...appFont
    }
});