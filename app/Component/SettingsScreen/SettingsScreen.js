import React from "react";
import {AppRegistry, Alert, Dimensions, AsyncStorage} from "react-native";

import {
    Text,
    Container,
    Card,
    CardItem,
    View,
    Body,
    Footer,
    Content,
    Header,
    Left,
    Right,
    Icon,
    Title,
    Button,
    H1, StyleProvider, ListItem
} from "native-base";

import {StackNavigator} from "react-navigation";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/variables';
import Logout from "../../Utils/Logout"
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import translate from "../../Utils/i18n";
import {Expo} from "expo";

export default class SettingsScreen extends React.Component {

    constructor() {
        super();
        this.getData();
        this.state = {token: ""}
    }

    async changeAppLang(lang) {

        if (lang === 'ar') {
            if (!I18nManager.isRTL) {
                await I18nManager.forceRTL(true);
            }
        } else {
            if (I18nManager.isRTL) {
                await I18nManager.forceRTL(false);
            }
        }
        Expo.Util.reload();
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                this.setState({token: await AsyncStorage.getItem('token')});
            } else {
            }

        } catch (error) {
            alert(error.message)
            // Error retrieving data
        }
    };

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header style={{marginTop: -18}}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                                <Icon name="menu"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>{translate('settings')}</Title>
                        </Body>
                    </Header>


                    <ListItem
                        button
                        onPress={() => {
                            this.props.navigation.navigate("MembershipScreen")
                        }}>
                        <Text>{translate('membership')}</Text>
                    </ListItem>

                    <ListItem button>
                        <Text>{translate('aboutUs')}</Text>
                    </ListItem>
                    <ListItem
                        button
                    >
                        <Text>{translate('reportProblem')}</Text>
                    </ListItem>

                    {I18nManager.isRTL ?
                        <ListItem button onPress={() => this.changeAppLang("en")}>
                            <Icon name={"globe"} style={{marginRight: 18}}/>
                            <Text>{translate('changeToEnglish')}</Text>
                        </ListItem> :
                        <ListItem button onPress={() => this.changeAppLang("ar")}>
                            <Icon name={"globe"} style={{marginRight: 18}}/>
                            <Text>{translate('changeToArabic')}</Text>
                        </ListItem>
                    }

                    {this.state.token ? <ListItem
                        onPress={() => {
                            Logout(this.state.token).then(res => {
                                if (res.done) {
                                    RNRestart.Restart()
                                } else {
                                    alert(res.error)
                                }
                            })
                        }}
                        button
                    >
                        <Icon name={"close"} style={{marginRight: 18}}/>
                        <Text>{translate('logOut')}</Text>
                    </ListItem> : <ListItem
                        onPress={() => {
                            this.props.navigation.navigate("Login")
                        }} button>
                        <Text>{translate('Login')}</Text>
                    </ListItem>}


                    <View style={{position: "absolute", bottom: 0, backgroundColor: "#eeeeee", width: viewportWidth}}>
                        <ListItem
                            style={{float: "left", backgroundColor: "#eeeeee"}}
                        >

                            <Text style={{fontSize: 11}}>Version 1.0</Text>
                        </ListItem>
                    </View>


                </Container>
            </StyleProvider>
        );
    }
}
SettingsScreen.navigationOptions = ({navigation}) => {
    return {
        header: (
            <StyleProvider style={getTheme(material)}>

                <Header style={{marginTop: -18}}>
                    <Left>
                        <Button transparent onPress={() => navigation.openDrawer()}>
                            <Icon name="menu"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Settings</Title>
                    </Body>

                </Header>
            </StyleProvider>

        )
    };
};
