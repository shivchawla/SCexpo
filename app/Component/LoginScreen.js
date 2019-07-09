import React, {Component} from 'react';
import {TextInput, StyleSheet, TouchableHighlight,Alert} from 'react-native';
import {View, Header, Left, Icon, Body, Right, Title, Text, Button, Label, Input, Item} from 'native-base';
import axios from 'axios'
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';
import {StyleProvider} from "native-base";
import {AsyncStorage} from 'react-native';
import translate from "../Utils/i18n";

function logUser(data) {
    return fetch("http://www.semsar.city/api/users/login", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then((apiResponse) => {
            console.log("api response", apiResponse);
            return {
                type: "REGISTER_USER",
                api_response: apiResponse
            }
        })
        .catch(function (error) {
            return {
                type: "REGISTER_USER",
                api_response: {success: false}
            }
        })
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 15

    },
    secondary: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        fontSize: 24,
        margin: 25,
        fontWeight: 'bold',
    },
    terms: {
        textAlign: 'center',
        color: "#000",
        fontSize: 18,
        textDecorationLine: 'underline',
        marginBottom: 25
    },
    f_button: {width: "100%", backgroundColor: "#4267b2", marginBottom: 5},
    g_button: {width: "100%", backgroundColor: "#b20012", marginTop: 15},
    text_margin: {
        margin: 15,
        fontSize: 18,
        color: '#000000',
        textAlign: 'center'
    },
    b_button: {
        width: "100%", backgroundColor: "#000000", marginTop: 25
    }
});


export default class LoginScreen extends React.Component {
    saveUser = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, data);
        } catch (error) {
            // Error saving data
        }
    };

    render() {
        return (
            <View>

                <StyleProvider style={getTheme(material)}>
                    <View>
                        <Header style={{backgroundColor: "#fff"}}>
                            <Left>
                                <Button transparent onPress={() => {
                                    this.props.navigation.goBack()
                                }}>
                                    <Icon name='arrow-back' color={"#000"}/>
                                </Button>
                            </Left>
                            <Body>
                            <Title style={{color: "#000"}}>{translate('Login')}</Title>
                            </Body>
                        </Header>
                        <View style={style.container}>
                            <Item inlineLabel>
                                <Input placeholder={translate('Email')} onChangeText={(text) => {
                                    this.setState({email: text})
                                }}/>
                            </Item>
                            <Item inlineLabel last>
                                <Input secureTextEntry={true} placeholder={translate('Password')} onChangeText={(text) => {
                                    this.setState({password: text})
                                }}/>
                            </Item>
                            <Button block rounded onPress={() => {

                                let data = {email: this.state.email, password: this.state.password};
                                logUser(data).then((res) => {
                                    if (res.api_response.message) {
                                        this.saveUser("email", res.api_response.data.userInfo.email)
                                        this.saveUser("name", res.api_response.data.userInfo.name);
                                        this.saveUser("password", data.password);
                                        this.saveUser("token", res.api_response.data.token);
                                        this.saveUser("id", res.api_response.data.userInfo.id);
                                    } else {

                                        let m = "Error: ";
                                        if (res.api_response.errors) {

                                            if (res.api_response.errors.password) {
                                                m += res.api_response.errors.password[0];
                                            }
                                        }
                                        if (res.api_response.error) {
                                            m += res.api_response.error
                                        }

                                        Alert.alert("Error",m);
                                    }
                                });

                            }} style={{marginTop: 15}}>
                                <Text>{translate('Login')}</Text>
                            </Button>
                        </View>
                    </View>
                </StyleProvider>
            </View>

        );
    }

}