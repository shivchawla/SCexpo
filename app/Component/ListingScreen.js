import React from "react";
import {
    Modal,
    ScrollView,
    StatusBar,
    TouchableHighlight,
    Alert,
    AsyncStorage,
    ActivityIndicator,
    Dimensions
} from "react-native";
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
    Right, Badge, View, Accordion, Picker, Input
} from "native-base";
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';
import {StyleProvider} from "native-base";
import Property from "./Things/Property";
import reauthenticate from "../Utils/Reauthenticate";
import translate from "../Utils/i18n";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
export default class ListingScreen extends React.Component {


    getProperties = (token) => {
        return fetch(`http://www.semsar.city/api/properties/my-properties?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            params: JSON.stringify({token: token}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((apiResponse) => {
            return apiResponse.json();
            // this.setState({result: apiResponse.result});s
        }).then((responseJson) => {
            console.log(responseJson);

            if (responseJson.success) {
                return {success: responseJson.success, properties: responseJson.properties};
            } else {
                return {success: responseJson.success, properties: []};
            }

        }).catch(function (error) {
            return {
                success: false,
                message: error.message
            }
        })

    }

    getName = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                this.setState({token: await AsyncStorage.getItem('token')});
                this.setState({email: await AsyncStorage.getItem('email')});
                this.setState({password: await AsyncStorage.getItem('password')});
                this.fetchProps();
                console.log("started")
            }
        } catch (e) {
            alert(e.message)
        }
    };

    fetchProps = () => {
        this.getProperties(this.state.token).then(res => {
            if (res.success) {
                this.setState({properties: res.properties})
                if (res.properties.length === 0) {
                    alert("You don't have any listing")
                }
            } else if (res.message) {
                if (res.message.includes("token")) {
                    reauthenticate({email: this.state.email, password: this.state.password}).then(resToken => {
                        this.setState({token: resToken.token})
                        console.log("reauth");
                        this.fetchProps();
                    })
                }
            }
        });
    };

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            token: "",
            properties:[]
        };
        this.fetchProps = this.fetchProps.bind(this);
        this.getName.bind(this);
        this.getName();
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header style={{marginTop: -18}}>
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}
                            >
                                <Icon name="menu"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>{translate('myListing')}</Title>
                        </Body>

                    </Header>


                    <Content>
                        <ScrollView>

                            {this.state.properties.map((item, index) => {
                                return <Property key={index} navigation={this.props.navigation} data={item}/>
                            })}
                        </ScrollView>

                    </Content>
                </Container>
            </StyleProvider>
        );


    }

}
