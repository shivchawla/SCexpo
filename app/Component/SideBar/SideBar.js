import React from "react";
import {AppRegistry, Image, Dimensions, StyleSheet, StatusBar} from "react-native";
import {
    Button,
    Text,
    Container,
    List,
    ListItem,
    Content,
    Item,
    Row,
    View,
    Icon, Footer, Card, CardItem, Body, Right, Left
} from "native-base";
import {AsyncStorage} from 'react-native';
import reauthenticate from "../../Utils/Reauthenticate";
import {NavigationActions} from "react-navigation";
import translate from "../../Utils/i18n";
import I18n from "ex-react-native-i18n";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const routes = [
    {title: translate('listing'), icon: "list", color: "grey", onClick: "Listing"},
    {title: translate('settings'), icon: "settings", color: "grey", onClick: "Settings"},
];
// {title: translate('luxuryListing'), icon: "star", color: "orange", onClick: "Luxury"},


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    absolute: {
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
    },
    text: {
        marginLeft: 4, color: "#fff", fontFamily: "rubik", fontFamily: "monospace", fontSize: 11, fontWeight: '700'
    },
});
let name = "";
let token = "";

export default class SideBar extends React.Component {
    saveUser = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, data);
        } catch (error) {
            alert(error.message + "Splash Screen")
            // Error saving data
        }
    };

    constructor(props) {
        super(props);
        this.state = {type: "", routes: routes, name: ""};
        this.getName = this.getName.bind(this);
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
                this.setState({logged: "logged"});
                this.getUser(token).then(res => {
                    if (res.success) {
                        console.log(res.api_response.type);
                        if (res.api_response.type) {
                            this.saveUser("type", res.api_response.type)
                            this.saveUser("name", res.api_response.name)
                            this.saveUser("id", res.api_response.id + "");
                            this.setState({type: resss.api_response.type});
                            this.setState({name: resss.api_response.name});
                        } else {
                            this.saveUser("type", "user");
                            this.setState({type: "user"});
                        }
                    } else if (res.api_response.includes("token")) {
                        reauthenticate({email: email, password: password}).then(ress => {
                                this.getUser({token: ress.token}).then(resss => {
                                    if (resss.success) {
                                        this.setState({type: resss.api_response.type});
                                        this.setState({name: resss.api_response.name});
                                        this.setState({logged: "logged"});
                                        console.log(resss.api_response.type + "type")
                                        if (resss.api_response.type) {
                                            this.saveUser("type", resss.api_response.type);
                                            this.setState({agent: resss.api_response.type});

                                            this.saveUser("name", resss.api_response.name);
                                            this.saveUser("id", resss.api_response.id + "");
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
                this.setState({logged: null})
            }

        } catch (error) {
            // Error retrieving data
        }
    };

    render() {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Profile',
            params: {data: this.props.data},
            action: NavigationActions.navigate({routeName: 'Profile', params: {data: {name: this.state.name}}})
        });
        return (
            <Container>
                <Image
                    source={{uri: "https://d12dkjq56sjcos.cloudfront.net/pub/media/wysiwyg/New-York-Skyline-Big-Bus-Tours-Jan-2018.jpg"}}
                    style={{position: "absolute", right: 0, left: 0, top: 0, bottom: 0, height: 120}}/>
                <View style={{
                    minHeight: 120,
                    backgroundImage: "https://tripppy.herokuapp.com/imgs/favicon.png",
                    lineHeight: 40
                }}>
                    <Row style={{height: 40, alignItems: 'center', padding: 8, marginTop: 8}}>
                        <Image style={{borderRadius: 20, height: 40, width: 40}}
                               source={{uri: "https://tripppy.herokuapp.com/imgs/favicon.png"}}/>
                        <Text style={styles.text}>Welcome to SemsarCity</Text>

                    </Row>
                </View>
                <Content>
                    <List dataArray={this.state.routes}
                          renderRow={data => {
                              if (data.navigationData) {
                                  return (
                                      <ListItem
                                          button
                                          onPress={() => this.props.navigation.navigate(data.onClick, {data: data.navigationData})}
                                      >
                                          <Icon name={data.icon} style={{marginRight: 18, color: data.color}}/>
                                          <Text>{data.title}</Text>
                                      </ListItem>
                                  );
                              }
                              return (
                                  <ListItem
                                      button
                                      onPress={() => this.props.navigation.navigate(data.onClick)}
                                  >
                                      <Icon name={data.icon} style={{marginRight: 18, color: data.color}}/>
                                      <Text>{data.title}</Text>
                                  </ListItem>
                              );

                          }}
                    />

                    {this.state.logged ?
                        <ListItem
                            button
                            onPress={() => this.props.navigation.navigate("ListingScreen")}>
                            <Icon name={"md-contact"} style={{marginRight: 18, color: "grey"}}/>
                            <Text>{translate('myListing')}</Text>
                        </ListItem>
                        : null
                    }

                    {this.state.type === "agent" || this.state.type === "broker" ?
                        <View>

                            <ListItem
                                button
                                onPress={() => this.props.navigation.navigate("ManageAgentsScreen")}>
                                <Icon name={"md-contact"} style={{marginRight: 18, color: "grey"}}/>
                                <Text>{translate('manageAgent')}</Text>
                            </ListItem>

                            <ListItem
                                disabled={!this.state.name}
                                button
                                onPress={() => this.props.navigation.navigate("Profile", {data: {name: this.state.name}})}>
                                <Icon name={"md-contact"} style={{marginRight: 18, color: "grey"}}/>
                                <Text>{translate('page')}</Text>
                            </ListItem>
                        </View>
                        : null
                    }

                </Content>
                <Item/>

                {this.state.type === "agent" ? null :
                    <ListItem button
                              onPress={() => {
                                  this.props.navigation.navigate('AgentScreen')
                              }}
                    >
                        <Icon name={"star"} style={{marginRight: 18}}/>
                        <Text>{translate('becomeAgent')}</Text>
                    </ListItem>
                }
            </Container>
        );
    }
}
