import React, {Component} from 'react';
import {Modal, Alert, TouchableHighlight, Text, AsyncStorage, View} from 'react-native';
import reauthenticate from "../Utils/Reauthenticate";

let name;
export default class SplashScreen extends Component {
    saveUser = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, data);
        } catch (error) {
            alert(error.message +"Splash Screen")
            // Error saving data
        }
    };

    constructor(props) {
        super(props);
        this.state = {name: "", type: ""};
        this.getName = this.getName.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    componentWillMount() {
        this.getName();
    }

    getUser = (data) => {
        return fetch("http://www.semsar.city/api/users/me", {
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
                    success: true,
                    api_response: apiResponse
                }
            })
            .catch(function (error) {
                return {
                    success: false,
                    api_response: error.message
                }
            })
    };

    getName = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(await AsyncStorage.getItem('id') + "id");
                let token = await AsyncStorage.getItem('token');
                let email = await AsyncStorage.getItem('email');
                let password = await AsyncStorage.getItem('password');
                name = await AsyncStorage.getItem('email');
                this.getUser(token).then(res => {
                    if (res.success) {
                        console.log(res.api_response.type);
                        if (res.api_response.type) {
                            this.saveUser("type", "user")
                            this.saveUser("name", res.api_response.name)
                            this.saveUser("id",res.api_response.id+"");
                        } else {
                            this.saveUser("type", "agent")
                        }
                        this.setState({name: "Home"});
                    } else if (res.api_response.includes("token")) {
                        reauthenticate({email: email, password: password}).then(ress => {
                                this.getUser({token: ress.token}).then(resss => {
                                    if (resss.success) {
                                        this.setState({type: resss.api_response.type});
                                        this.setState({name: "Home"});
                                        console.log(resss.api_response.type + "type")
                                        if (resss.api_response.type) {
                                            this.saveUser("type", "agent");
                                            this.saveUser("name",resss.api_response.name);
                                            this.saveUser("id",resss.api_response.id+"");
                                        } else {
                                            this.saveUser("type", "user")
                                        }
                                    }
                                })
                            }
                        )
                    }
                });
            } else {
                this.setState({name: "Welcome"})
            }

        } catch (error) {
            // Error retrieving data
        }
    };

    render() {

        return (
            <View>
                {this.state.name === "Home" ? this.props.navigation.goBack() : null}
                {this.state.name === "Home" ? this.props.navigation.navigate("Home") : null}
                {this.state.name === "Welcome" ? this.props.navigation.goBack() : null}
                {this.state.name === "Welcome" ? this.props.navigation.navigate("Welcome") : null}
            </View>
        )
    }
}