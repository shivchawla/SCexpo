import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    TouchableHighlight,
    AsyncStorage,
    Dimensions,
    ScrollView, Alert
} from 'react-native';
import translate from "../Utils/i18n"
import {Button, Text, Input, Item} from 'native-base';
import axios from 'axios';
// import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import {LoginButton, AccessToken} from 'react-native-fbsdk';

// GoogleSignin.configure({
//     // what API you want to access on behalf of the user, default is email and profile
//     webClientId: '219386919981-263o049rvlalh7110io5kvgsnpj43hll.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//     hostedDomain: '', // specifies a hosted domain restriction
//     forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
//     accountName: '', // [Android] specifies an account name on the device that should be used // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
// });


const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 15, alignItems: 'center',

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

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideWidth = wp(95);
export const sliderWidth = viewportWidth;
const itemHorizontalMargin = wp(2);
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

function registerUser(data) {
    return fetch("http://www.semsar.city/api/users/register", {
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

export default class RegisterScreen extends React.Component {


    press = () => {
        axios.post('http://semsar.city/users/register', {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }).then(function (response) {
            console.log(response)
        })
    };

    constructor(props) {
        super(props);
        this.initUser = this.initUser.bind(this);
        this.onRegisterClicked = this.onRegisterClicked.bind(this);
        this.state = {name: "", email: "", password: "", showToast: false, phone: 0}
    }

    saveUser = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, data);
        } catch (error) {
            alert(error.message)
            // Error saving data
        }
    };

    // signIn = async () => {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const userInfo = await GoogleSignin.signIn();
    //         alert("here");
    //         console.log(userInfo)
    //         this.setState({email: userInfo.user.email})
    //         this.setState({password: userInfo.user.id})
    //         this.setState({name: userInfo.user.name});
    //         this.onRegisterClicked()
    //     } catch (error) {
    //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //             // user cancelled the login flow
    //             alert("Canceled")
    //         } else if (error.code === statusCodes.IN_PROGRESS) {
    //             // operation (f.e. sign in) is in progress already
    //             alert("In Progress")
    //         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //             // play services not available or outdated
    //             alert("Google services not available")
    //
    //         } else {
    //             // some other error happened
    //             console.log(error.message)
    //         }
    //     }
    // };

    // getCurrentUserInfo = async () => {
    //     try {
    //         const userInfo = await GoogleSignin.signInSilently();
    //         alert(userInfo)
    //     } catch (error) {
    //         if (error.code === statusCodes.SIGN_IN_REQUIRED) {
    //             alert("sign in required");
    //             this.signIn();
    //
    //         } else {
    //             // some other error
    //         }
    //     }
    // };

    initUser(token, userID) {
        fetch('https://graph.facebook.com/v2.5/' + userID + '?fields=email,name,friends&access_token=' + token)
            .then((response) => response.json())
            .then((json) => {
                // Some user object has been set up somewhere, build that user here
                let user = {};
                user.name = json.name
                user.id = json.id
                user.user_friends = json.friends
                user.email = json.email
                user.username = json.name
                user.loading = false
                user.loggedIn = true
                console.log(user)
                this.setState({email: user.email})
                this.setState({password: user.id})
                this.setState({name: user.name})
                this.onRegisterClicked();
            })
            .catch(() => {
                console.log('ERROR GETTING DATA FROM FACEBOOK')
            })
    }

    onRegisterClicked = () => {
        let data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            phone: this.state.phone
        };
        if (this.state.password && this.state.email && this.state.name && this.state.phone) {
            console.log(data);
            registerUser(data)
                .then((res) => {
                    console.log(res.api_response.success);
                    if (res.api_response.success) {
                        let data = {
                            email: this.state.email,
                            password: this.state.password
                        };
                        logUser(data).then((res) => {
                            if (res.api_response.message) {
                                alert(res.api_response.data.userInfo);
                                this.saveUser("email", res.api_response.data.userInfo.email)
                                this.saveUser("name", res.api_response.data.userInfo.name);
                                this.saveUser("token", res.api_response.data.token);
                                this.saveUser("password", data.password);
                                this.saveUser("id", res.api_response.data.userInfo.id);
                                this.saveUser("phone", this.state.phone);
                                this.props.navigation.navigate('Home');
                            } else {
                                let m = "";
                                if (res.api_response.errors) {
                                    if (res.api_response.errors.password) {
                                        m += res.api_response.errors.password[0];
                                    }
                                }
                                if (res.api_response.error) {
                                    m += res.api_response.error
                                }
                                Alert.alert("Error", m);
                            }
                        });
                    } else {
                        let m = "";
                        if (res.api_response.errors.password) {
                            m += res.api_response.errors.password[0]
                        }
                        if (res.api_response.errors.email) {
                            m += res.api_response.errors.email[0]
                        }
                        alert(m)
                        if (m.includes("taken")) {
                            logUser(data).then((res) => {
                                if (res.api_response.message) {
                                    alert(res.api_response.data.userInfo);
                                    this.saveUser("email", res.api_response.data.userInfo.email)
                                    this.saveUser("name", res.api_response.data.userInfo.name);
                                    this.saveUser("token", res.api_response.data.token);
                                    this.saveUser("password", data.password);
                                    this.saveUser("id", res.api_response.data.userInfo.id);
                                    this.props.navigation.navigate('Home');
                                } else {
                                    let m = "";
                                    if (res.api_response.errors) {
                                        if (res.api_response.errors.password) {
                                            m += res.api_response.errors.password[0];
                                        }
                                    }
                                    if (res.api_response.error) {
                                        m += res.api_response.error
                                    }
                                    Alert.alert("Error", m);
                                }
                            });

                        }
                    }
                })
        } else {
            alert("data is missing")
        }

    };

    render() {

        return (
            <ScrollView scrollEnabled={false}>

                <View style={style.container}>

                    <Text style={style.instructions}>
                        {translate('Register')}
                    </Text>
                    <Text style={style.secondary}>
                        {translate('SignUpContent')}
                    </Text>
                    <Text style={style.terms}>
                        {translate('TermsAndCondition')}
                    </Text>
                    {/*<GoogleSigninButton*/}
                        {/*style={{width: viewportWidth - 20, height: 48}}*/}
                        {/*size={GoogleSigninButton.Size.Wide}*/}
                        {/*color={GoogleSigninButton.Color.Dark}*/}
                        {/*onPress={this.getCurrentUserInfo}*/}

                        {/*disabled={false}/>*/}


                    <Text style={style.text_margin}>{translate('OrSignUpWithEmail')}</Text>


                    <Item stackedLabel>
                        <Input placeholder={translate("Email")} onChangeText={(text) => {
                            this.setState({email: text})
                        }}/>
                    </Item>
                    <Item stackedLabel>
                        <Input placeholder={translate("phone")} keyboardType={"numeric"} onChangeText={(text) => {
                            this.setState({phone: text})
                        }}/>
                    </Item>
                    <Item>
                        <Input placeholder={translate("Name")} onChangeText={(text) => {
                            this.setState({name: text})
                        }}/>
                    </Item>
                    <Item last>
                        <Input secureTextEntry={true} placeholder={translate("Password")} onChangeText={(text) => {
                            this.setState({password: text})
                        }}/>
                    </Item>

                    <Button block dark style={{marginTop: 25, marginBottom: 25}} onPress={() => {

                        let data = {
                            name: this.state.name,
                            email: this.state.email,
                            password: this.state.password
                        };
                        registerUser(data)
                            .then((res) => {
                                console.log(res.api_response.success);
                                if (res.api_response.success) {
                                    let data = {
                                        email: this.state.email,
                                        password: this.state.password
                                    };
                                    logUser(data).then((res) => {
                                        if (res.api_response.message) {
                                            alert(res.api_response.data.userInfo);
                                            this.saveUser("email", res.api_response.data.userInfo.email)
                                            this.saveUser("name", res.api_response.data.userInfo.name);
                                            this.saveUser("token", res.api_response.data.token);
                                            this.saveUser("password", data.password);
                                            this.saveUser("id", res.api_response.data.userInfo.id);
                                            this.props.navigation.navigate('Home');
                                        } else {
                                            let m = "";
                                            if (res.api_response.errors) {
                                                if (res.api_response.errors.password) {
                                                    m += res.api_response.errors.password[0];
                                                }
                                            }
                                            if (res.api_response.error) {
                                                m += res.api_response.error
                                            }
                                            Alert.alert("Error", m);
                                        }
                                    });

                                } else {
                                    let m = "";
                                    if (res.api_response.errors.password) {
                                        m += res.api_response.errors.password[0]
                                    }
                                    if (res.api_response.errors.email) {
                                        m += res.api_response.errors.email[0]
                                    }
                                    alert(m)
                                }
                            })
                    }}>
                        <Text>{translate("Register")}</Text>
                    </Button>


                    <Text style={style.terms}
                          onPress={() => {
                              this.props.navigation.push('Login')
                          }}>{translate("OrSignIn")}</Text>
                </View>
            </ScrollView>
        );
    }
}