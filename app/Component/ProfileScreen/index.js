import React, {Component} from "react";
import Profile from "./Profile.js";
import {createStackNavigator} from "react-navigation";

export default (DrawNav = createStackNavigator(
    {
        Profile: {screen: Profile},
    },
    {
        initialRouteName: "Profile",
    }
));
