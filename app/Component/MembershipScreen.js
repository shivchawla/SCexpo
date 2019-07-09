import React from "react";
import {AppRegistry, Alert, Image, Dimensions, ScrollView, AsyncStorage} from "react-native";

import {
    Text,
    Container,
    ListItem,
    View,
    Card,
    CardItem,
    Body,
    Content,
    Header,
    Left,
    Right,
    Item,
    Input,
    Icon,
    Title,
    Button,
    H1, StyleProvider
} from "native-base";
import {StackNavigator} from "react-navigation";

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';
import Profile from "./ProfileScreen/Profile";

import translate from "../Utils/i18n";
import reauthenticate from "../Utils/Reauthenticate";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');


export default class MembershipScreen extends React.Component {
    componentDidMount() {
        this.setState({show: true});
        this.getOffers(this.props.navigation.state.params.data.token).then(res => {
            console.log(res)
            if (res.success) {
                this.setState({current: res.currentOffer});
                this.setState({packages: res.agentPackages});
            }
        });
    }

    constructor() {
        super();
        this.state = {
            current: {},
            packages: []
        }
    }

    addAgentRequest(item) {
        console.log(JSON.stringify(this.state));

        let data = this.props.navigation.state.params.data;
        console.log(data);
        return fetch("http://www.semsar.city/api/agents/add-agent/" + item.id + "/" + this.state.current.id, {
            method: 'POST',
            body: JSON.stringify(data),
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
                let email = await AsyncStorage.getItem('email');
                let password = await AsyncStorage.getItem('password');
                let token = await AsyncStorage.getItem('token');
                this.setState({token: await AsyncStorage.getItem('token')});
                return {success: true, password: password, email: email}
            } else {
                return {success: false}
            }
        } catch (error) {
            return {success: false}
        }
    }

    async onSelectClicked(item) {
        this.getData().then(res => {
            this.addAgentRequest(item).then(res1 => {
                console.log(res1)
                if (res1.success) {
                    alert("added")
                } else if (res1.error) {
                    if (res1.error[0].includes("token")) {
                        reauthenticate({email: res.email, password: res.password}).then(token => {
                            this.setState({token: token.token});
                            console.log(this.state.token);
                            this.onSelectClicked(item);
                        })
                    }
                } else if (res1.errors) {
                    let m = "Error: ";
                    if (res1.errors) {
                        console.log(res1.errors)
                        if (res1.errors.password) {
                            m += res1.errors.password[0];
                        }
                        if (res1.errors.email) {
                            m += res1.errors.email[0];
                        }
                        if (res1.errors.name) {
                            m += res1.errors.name[0];
                        }
                        console.log(m)
                        alert(m);
                    }
                }
            })

        })

    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>

                    <Header style={{marginTop: -18}}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-back"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>{translate('membership')}</Title>
                        </Body>

                    </Header>

                    <Content padder>
                        <ScrollView>
                            <View>
                                <Text uppercase={true} style={{
                                    fontSize: 15,
                                    color: "#69f0ae",
                                    marginTop: 10,
                                    marginBottom: 10,
                                    fontWeight: "600"
                                }}>{translate("currentOffer")}</Text>

                                <Card button style={{
                                    justifyContent: "center",
                                    padding: 8
                                }}>
                                    <Text>{translate("endDate")} : {this.state.current.end_date} </Text>
                                </Card>

                                <Text uppercase={true} style={{
                                    fontSize: 15,
                                    color: "#69f0ae",
                                    marginTop: 10,
                                    marginBottom: 10,
                                    fontWeight: "600"
                                }}>{translate("packages")}</Text>

                                {this.state.packages.map((item, i) => {
                                    return <Card button style={{
                                        justifyContent: "center",
                                        padding: 8
                                    }}>
                                        <Text>{translate("become")} : {item.to_be} </Text>
                                        <Text>{translate("listing")} : {item.listings} </Text>
                                        <Text>{translate("durability")} : {item.months} Months </Text>
                                        <Text>{translate('price')} : {item.price} LE </Text>
                                        <Button style={{height: 30, marginTop: 8}} onPress={() => {
                                            this.onSelectClicked(item)
                                        }}>
                                            <Text>{translate("select")}</Text>
                                        </Button>
                                    </Card>
                                })}

                            </View>
                        </ScrollView>
                    </Content>

                </Container>
            </StyleProvider>

        );
    }
}