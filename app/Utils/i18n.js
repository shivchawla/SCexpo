import I18n from 'ex-react-native-i18n'; // You can import i18n-js as well if you don't want the app to set default locale from the device locale.
import en from '../locales/en';
import ar from '../locales/ar';
import {I18nManager} from 'react-native';
I18n.fallbacks = true; // If an English translation is not available in en.js, it will look inside hi.js
I18n.missingBehaviour = 'guess'; // It will convert HOME_noteTitle to "HOME note title" if the value of HOME_noteTitle doesn't exist in any of the translation files.

I18n.translations = {
    ar,
    en
};


const currentLocale = I18n.currentLocale();
console.log(I18nManager.isRTL);
// Is it a RTL language?
export const isRTL = currentLocale.indexOf('ar') === 0;


// I18nManager.allowRTL(I18n.locale in I18n.translations);
export const setLocale = (locale) => {
    console.log(locale, "changed");
    I18n.locale = locale;
};

I18n.locale = I18nManager.isRTL ? "ar" : "en";
export const getCurrentLocale = () => I18n.locale; // It will be used to define intial language state in reducer.

/* translateHeaderText:
 screenProps => coming from react-navigation (defined in app.container.js)
 langKey => will be passed from the routes file depending on the screen.(We will explain the usage later int the coming topics)
*/
export const translateHeaderText = (langKey) => ({screenProps}) => {
    const title = I18n.translate(langKey, screenProps.language);
    return {title};
};

export default I18n.translate.bind(I18n);