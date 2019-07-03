import React, {Component} from "react";
import HomeScreen from "./HomeScreen.js";
import ProfileScreen from "../ProfileScreen/Profile";
import SideBar from "../SideBar/SideBar.js";
import SettingsScreen from "../SettingsScreen/SettingsScreen";
import {createDrawerNavigator} from "react-navigation";
import ManageAgentsScreen from "../ManageAgentsScreen";
import LuxuryScreen from "../LuxuryScreen/LuxuryScreen";
import ListingScreen from "../ListingScreen";
import MembershipScreen from "../MembershipScreen";

import {I18nManager} from 'react-native';
const HomeScreenRouter = createDrawerNavigator(
    {
        Listing: {screen: HomeScreen},
        Settings: {screen: SettingsScreen},
        Profile: {screen: ProfileScreen},
        ManageAgentsScreen: {screen: ManageAgentsScreen},
        Luxury: {screen: LuxuryScreen},
        ListingScreen: {screen: ListingScreen},
        MembershipScreen: {screen: MembershipScreen}
    }
    , {
        drawerPosition: I18nManager.isRTL ? 'right' : 'left',
        contentComponent: props => <SideBar {...props} />
    }
);
export default HomeScreenRouter;
