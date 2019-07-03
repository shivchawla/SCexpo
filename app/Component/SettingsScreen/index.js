import React, {Component} from "react";
import SettingsScreen from "./SettingsScreen.js";
import {createStackNavigator} from "react-navigation";
import LoginScreen from "../LoginScreen";

export default (DrawNav = createStackNavigator(
    {
        Settings: {screen: SettingsScreen},
        Logout: {screen: LoginScreen}

    },
    {
        initialRouteName: "Settings"
    }
));
