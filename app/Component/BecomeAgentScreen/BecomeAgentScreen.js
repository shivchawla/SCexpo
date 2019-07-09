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
import translate from "../../Utils/i18n";

function becomeAgent(token, item) {
    let data = {token: token};
    return fetch("http://www.semsar.city/api/packages/be-agent/" + item.id, {
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
                alert(apiResponse.message || apiResponse.error)
            } else {
                alert(apiResponse.error)

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
        this.state = {token: "", email: "", password: "", current: {}, packages: []}

    }

    getOffers(token) {
        return fetch("http://www.semsar.city/api/packages/all/packages?token=" + token, {
            method: 'GET',
            params: JSON.stringify(token),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then((apiResponse) => {
                console.log("api response", apiResponse);
                return apiResponse
            })
            .catch(function (error) {
                console.log(error.message)
                return {success: false, error: [error.message]}
            })
    }


    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                this.setState({email: await AsyncStorage.getItem('email')});
                this.setState({token: await AsyncStorage.getItem('token')});
                this.setState({password: await AsyncStorage.getItem('password')});
                this.getOffers(this.state.token).then(res => {
                    if (res.success) {
                        this.setState({current: res.currentOffer});
                        this.setState({packages: res.agentPackages});
                    }
                })
            } else {
                alert("You need to login first")
                // Error retrieving data

                this.props.navigation.goBack();
                this.props.navigation.navigate("Register")
            }

        } catch (error) {
            alert("You need to login first")// Error retrieving data
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


                    {this.state.packages.map((item, i) => {
                        return <Card button style={{
                            justifyContent: "center",
                            padding: 8
                        }}>
                            <Text>Become : {item.to_be} </Text>
                            <Text>Listing : {item.listings} </Text>
                            <Text>Durability : {item.months} Months </Text>
                            <Text>{translate('price')} : {item.price} LE </Text>
                            <Button style={{height: 30, marginTop: 8}} onPress={() => {
                                becomeAgent(this.state.token, item).then(res => {
                                    if (res.message.includes("token")) {
                                        reauthenticate({
                                            email: this.state.email,
                                            password: this.state.password
                                        }).then(res => {
                                            if (res.token) {
                                                becomeAgent(res.token, item).then(res => {
                                                    if (res.message.includes("token")) {
                                                        alert("error")
                                                    } else {
                                                        alert(res.message)
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        alert(res.message)
                                    }
                                })

                            }}>
                                <Text>Select</Text>
                            </Button>
                        </Card>
                    })}

                </View>

            </StyleProvider>
        );
    }
}