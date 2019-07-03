import React from "react";
import {AppRegistry, Alert, Image, Dimensions, AsyncStorage, RefreshControl, ScrollView} from "react-native";

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
import translate from "../Utils/i18n";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const AGENTS = [{title: "Example", id: 123}, {title: "Example1"}, {title: "Example2", id: 123}
    , {title: "Example"}];
import {StackNavigator, NavigationActions} from "react-navigation";

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';
import reauthenticate from "../Utils/Reauthenticate";

export default class ManageAgentsScreen extends React.Component {
    componentDidMount() {
    }

    getAgents = (token) => {

        console.log(token + "token");
        return fetch(`http://www.semsar.city/api/agents/my-agents?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            params: JSON.stringify({token: token}),
            data: null,
            headers: {"Content-Type": "application/json"}
        }).then((apiResponse) => {
            console.log(apiResponse)
            return apiResponse.json();
        }).then((responseJson) => {
            console.log(responseJson);
            if (responseJson.my_agents != null) {
                return {message: "done", agents: responseJson.my_agents}
            }
            return {type: "Get agents", message: "Error"}
        }).catch(function (error) {
            return {type: "Get agents", message: error.message}
        })
    };


    _onRefresh() {
        console.log("refresh");
        this.getData();
    }

    constructor() {
        super();
        this.getData();
        this.state = {
            token: "",
            agents: [],
            id: "",
            password: "",
            email: "", refreshing: false
        };
        this.getData = this.getData.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                this.setState({email: await AsyncStorage.getItem('email')});
                let email = await AsyncStorage.getItem('email');
                let password = await AsyncStorage.getItem('password');
                let token = await AsyncStorage.getItem('token');
                this.setState({token: await AsyncStorage.getItem('token')});
                this.setState({id: await AsyncStorage.getItem('id')});
                this.setState({password: await AsyncStorage.getItem('password')});
                this.getAgents(token).then((res) => {
                    console.log(res);
                    if (res.message === "done") {
                        this.setState({agents: res.agents})
                    } else if (res.message.includes("token")) {
                        reauthenticate({
                            email: email,
                            password: password
                        }).then(token => {
                            this.getAgents(token)
                                .then(final_res => {
                                    console.log(final_res)
                                    if (final_res.message === "done") {
                                        this.setState({agents: final_res.agents})
                                    }
                                    if (final_res.message === "error") {
                                    } else if (final_res.message.includes("token")) {
                                    }
                                })
                        })
                    }
                })
            } else {
                console.log("fe 7aga")
            }

        } catch (error) {
            // Error retrieving data
        }
    };

    componentWillMount() {
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header style={{marginTop: -18}}>
                        <Left>
                            <Button
                                transparent
                                onPress={() => {
                                    this.props.navigation.openDrawer();
                                }}
                            >
                                <Icon name="menu"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title uppercase style={{

                            fontSize: 15,
                            color: "#000",
                        }}>{translate('manageAgents')}</Title>
                        </Body>
                    </Header>


                    <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>

                        <Content padder>
                            <ListItem
                                button
                                onPress={() => this.props.navigation.navigate("AddNewAgent")}>
                                <Icon
                                    name={"add"}
                                    style={{marginRight: 18, width: 24, height: 24, borderRadius: 12}}/>

                                <Text>{translate('addAgent')}</Text>
                            </ListItem>


                            {this.state.agents
                                .map((item, index) => {
                                        return (<Agent data={item} navigation={this.props.navigation}/>)
                                    }
                                )}
                        </Content>
                    </ScrollView>
                </Container>
            </StyleProvider>
        );
    }

}

class Agent extends React.Component {

    render() {

        const navigateAction = NavigationActions.navigate({
            routeName: 'Profile',
            params: {data: this.props.data},
            action: NavigationActions.navigate({routeName: 'Profile', params: {data: this.props.data}})
        });
        console.log(this.props.data)
        return (<ListItem button onPress={() => this.props.navigation.dispatch(navigateAction)}>
            <Image source={{uri: "https://tripppy.herokuapp.com/imgs/favicon.png"}}
                   style={{marginRight: 18, width: 24, height: 24, borderRadius: 12}}/>
            <Text>{this.props.data.name}</Text>
        </ListItem>)
    }
}