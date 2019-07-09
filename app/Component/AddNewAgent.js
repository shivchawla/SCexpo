import React, {Component, PropTypes} from "react";
import {Modal, ScrollView, StatusBar, TouchableHighlight, Alert, Image, Dimensions, AsyncStorage} from "react-native";
import {
    Button,
    Text,
    Container,
    Card,
    CardItem,
    Body,
    Content,
    CheckBox,
    ListItem,
    Radio,
    Header,
    Picker,
    Title,
    Textarea,
    Left,
    Item, Row,
    Form,
    Icon,
    Right, Badge, View, Accordion
} from "native-base";

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';
import {StyleProvider, Input} from "native-base";
import {ENTRIES1} from "./PropertyScreen";
import translate from "../Utils/i18n";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default class AddNewAgent extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            token: "",
            phone: "",
            location: "",
            sub_location: "",
        };
        this.getData = this.getData.bind(this);
        this.onSubmitClicked = this.onSubmitClicked.bind(this);
        this.addAgentRequest = this.addAgentRequest.bind(this);
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
    };

    async onSubmitClicked() {
        if (this.state.phone.length !== 11) {
            alert("Phone is not valid")
        }
        else if (!this.state.name || !this.state.email || !this.state.location || !this.state.sub_location || !this.state.password) {
            alert("Please fill all the data correctly!")
        }
        else {
            this.getData().then(res => {
                if (res.success) {
                    this.props.navigation.navigate("MemberShipScreen", {data: this.state});
                }
            })
        }

    }

    addAgentRequest() {
        console.log(JSON.stringify(this.state))
        return fetch(" http://www.semsar.city/api/agents/add-agent", {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((apiResponse) => {
                console.log("api response", apiResponse);
                return apiResponse
            })
            .catch(function (error) {
                console.log(error.message)
                return {success: false, error: [error.message]}
            })

    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
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
                        <Title>{translate("addAgent")}</Title>
                        </Body>
                    </Header>

                    <Content padder>
                        <ScrollView>
                            <Form>
                                <Input placeholder={translate('Name')} style={{
                                    marginBottom: 5, borderRadius: 25, padding: 5, borderStyle: "solid",
                                    borderWidth: 1, borderColor: "#eaeaea"
                                }}
                                       onChangeText={(text) => {
                                           this.setState({name: text})
                                       }}/>
                                <Input placeholder={translate('Email')} style={{
                                    marginBottom: 5, borderRadius: 25, padding: 5, borderStyle: "solid",
                                    borderWidth: 1, borderColor: "#eaeaea"
                                }}
                                       onChangeText={(text) => {
                                           this.setState({email: text})
                                       }}/>
                                <Input placeholder={translate('Password')} style={{
                                    marginBottom: 5, borderRadius: 25, padding: 5, borderStyle: "solid",
                                    borderWidth: 1, borderColor: "#eaeaea"
                                }}
                                       onChangeText={(text) => {
                                           this.setState({password: text})
                                       }}/>
                                <Input placeholder={translate('phone')} keyboardType={"numeric"} style={{
                                    marginBottom: 5, borderRadius: 25, padding: 5, borderStyle: "solid",
                                    borderWidth: 1, borderColor: "#eaeaea"
                                }}
                                       onChangeText={(text) => {
                                           this.setState({phone: text})
                                       }}/>
                                <Input placeholder={translate('location')} style={{
                                    marginBottom: 5, borderRadius: 25, padding: 5, borderStyle: "solid",
                                    borderWidth: 1, borderColor: "#eaeaea"
                                }}
                                       onChangeText={(text) => {
                                           this.setState({location: text})
                                       }}/>
                                <Input placeholder={translate('sub_location')} style={{
                                    marginBottom: 5, borderRadius: 25, padding: 5, borderStyle: "solid",
                                    borderWidth: 1, borderColor: "#eaeaea"
                                }}
                                       onChangeText={(text) => {
                                           this.setState({sub_location: text})
                                       }}/>

                                <Button primary full rounded onPress={this.onSubmitClicked}>
                                    <Text uppercase
                                          style={{
                                              fontWeight: "600",
                                              color: "#fff",
                                              fontSize: 12
                                          }}>{translate('Submit')}</Text>
                                </Button>

                            </Form>

                        </ScrollView>
                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}