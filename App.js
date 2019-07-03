/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {createStackNavigator, createAppContainer} from "react-navigation";
import React, {Component} from 'react';
import {AsyncStorage, Platform, StyleSheet, Text, View} from 'react-native';
import WelcomeScreenCarousel from "./app/Component/WelcomeScreenCarousel";
import RegisterScreen from "./app/Component/RegisterScreen";
import LoginScreen from "./app/Component/LoginScreen";

import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/variables';
import {StyleProvider} from "native-base";
import HomeScreen from "./app/Component/HomeScreen/index";
import SearchScreen from "./app/Component/SearchScreen";
import SplashScreen from "./app/Component/SplashScreen";
import AddProperty from "./app/Component/AddProperty";
import AgentScreen from "./app/Component/BecomeAgentScreen/BecomeAgentScreen";
import PromoteScreen from "./app/Component/PromoteScreen";
import PropertyScreen from "./app/Component/PropertyScreen";
import SearchBrokersScreen from "./app/Component/SearchBrokersScreen";
import MembershipScreen from "./app/Component/MembershipScreen";
import AddNewAgent from "./app/Component/AddNewAgent";
import ListingScreen from "./app/Component/ListingScreen";
import SQLite from "react-native-sqlite-storage";
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
let Screen = '';

type Props = {};
const setglobalvar = (v) => {
    Screen = v;
};
const rt = async (fn) => {
    try {
        const value = await AsyncStorage.getItem('email');
        if (value !== null) {
            fn("Home");
            this.props.navigation.navigate('Home')
        } else {
            fn("Welcome");
        }
    } catch (error) {
    }
};

const Route = () => {
    rt(setglobalvar);
    console.log(Screen); // value is NOT set here
    return Screen
};

class App extends Component<Props> {

    render() {

        return (
            <StyleProvider style={getTheme(material)}>

                <WelcomeScreenCarousel navigation={this.props.navigation}/>

            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eaeaea',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

const AppNavigator = createStackNavigator({
    Welcome: {screen: App},
    Register: {screen: RegisterScreen},
    Login: {screen: LoginScreen},
    Home: {screen: HomeScreen},
    Search: {screen: SearchScreen},
    SplashScreen: {screen: SplashScreen},
    AddProperty: {screen: AddProperty},
    AgentScreen: {screen: AgentScreen},
    PromoteScreen: {screen: PromoteScreen},
    PropertyScreen: {screen: PropertyScreen},
    SearchBrokersScreen: {screen: SearchBrokersScreen},
    MemberShipScreen: {screen: MembershipScreen},
    AddNewAgent: {screen: AddNewAgent},
}, {
    headerMode: 'none',
    initialRouteName: "Home",
});

export default createAppContainer(AppNavigator)