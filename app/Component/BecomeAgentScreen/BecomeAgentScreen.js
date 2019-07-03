import React from "react";
import {Modal, ScrollView, StatusBar, TouchableHighlight, Alert, AsyncStorage} from "react-native";
import {
    Button,
    Text,
    Container,
    Card,
    CardItem,
    Body,
    Content,
    Header,
    Title,
    Left,
    Icon,
    Right, Badge, View, Accordion
} from "native-base";
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/variables';
import {StyleProvider} from "native-base";
import Property from "../Things/Property";
import reauthenticate from "../../Utils/Reauthenticate";

function becomeAgent(token) {
    let data = {token: token};
    return fetch("http://www.semsar.city/api/agents/be-agent", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then((apiResponse) => {
            console.log("api response", apiResponse);
            if (apiResponse.success) {
                alert(apiResponse.message)
            } else {
                alert("Error")

            }
            return {
                message: apiResponse.message,
                api_response: apiResponse
            }
        })
        .catch(function (error) {
            alert(error.message)

            return {
                message: error.message,
                api_response: {success: false}
            }
        })
}

export default class BecomeAgentScreen extends React.Component {
    constructor() {
        super();
        this.getData();
        this.state = {token: "", email: "", password: ""}

    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                this.setState({email: await AsyncStorage.getItem('email')});
                this.setState({token: await AsyncStorage.getItem('token')});
                this.setState({password: await AsyncStorage.getItem('password')});
            } else {
                alert(value)
            }

        } catch (error) {
            alert(error.message)
            // Error retrieving data
        }
    };

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <View>
                    <Header style={{marginTop: -18}}>
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.props.navigation.navigate("Home")}
                            >
                                <Icon name="arrow-back"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>Become Agent</Title>
                        </Body>
                    </Header>

                    <Button primary full rounded style={{margin: "auto"}}
                            onPress={() => {
                                becomeAgent(this.state.token).then(res => {
                                    if (res.message.includes("token")) {
                                        reauthenticate({
                                            email: this.state.email,
                                            password: this.state.password
                                        }).then(res => {
                                            if (res.token) {
                                                becomeAgent(res.token).then(res => {
                                                    if (res.message.includes("token")) {
                                                        alert("error")
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }}>
                        <Text>Agent</Text>
                    </Button>
                </View>

            </StyleProvider>
        );
    }
}