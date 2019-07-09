import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    TouchableHighlight,
    AsyncStorage,
    Dimensions,
    ScrollView, Alert,
    TouchableOpacity,
} from 'react-native';
import translate from "../Utils/i18n"
import {Button, Text, Input, Item} from 'native-base';
import * as Facebook from 'expo-facebook';
import styles from '../styles/facebookLoginStyle';
import {Entypo} from '@expo/vector-icons';
import {LinearGradient} from 'expo';
import {Font, AppLoading} from "expo";

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

    async logIn() {
        try {
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync('353006628739135', {
                permissions: ['public_profile', 'email'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                console.log(response.json());
                this.setState({name: response.json().name})
                this.setState({email: response.json().email})
                this.setState({phone: response.json().id})
                this.setState({password: response.json().id})
                this.onRegisterClicked();
                Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
            } else {
                // type === 'cancel'
            }
        } catch ({message}) {
            alert(`Facebook Login Error: ${message}`);
        }
    }

    async componentWillMount() {

        this.setState({loading: false});
    }

    constructor(props) {
        super(props);
        this.initUser = this.initUser.bind(this);
        this.onRegisterClicked = this.onRegisterClicked.bind(this);
        this.state = {name: "", email: "", password: "", showToast: false, phone: "", loading: true}
    }

    saveUser = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, data);
        } catch (error) {
            alert(error.message)
            // Error saving data
        }
    };

    signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            alert("here");
            console.log(userInfo)
            this.setState({email: userInfo.user.email})
            this.setState({password: userInfo.user.id})
            this.setState({name: userInfo.user.name});
            this.onRegisterClicked()
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                alert("Canceled")
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                alert("In Progress")
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert("Google services not available")
            } else {
                console.log(error.message)
            }
        }
    };

    getCurrentUserInfo = async () => {
        if (this.state.phone) {
            if (this.state.phone.length === 11) {
                try {
                    const userInfo = await GoogleSignin.signInSilently();
                    alert(userInfo)
                } catch (error) {
                    if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                        alert("sign in required");
                        this.signIn();

                    } else {
                        // some other error
                    }
                }
            } else {
                alert("please add a valid phone number")

            }
        } else {
            alert("please type your phone")
        }

    };

    initUser(token, userID) {
        fetch('https://graph.facebook.com/v2.5/' + userID + '?fields=email,name,friends&access_token=' + token)
            .then((response) => response.json())
            .then((json) => {
                // Some user object has been set up somewhere, build that user here
                let user = {};
                user.name = json.name
                user.id = json.id
                user.user_friends = json.friends
                user.email = json.email;
                user.username = json.name;
                user.loading = false;
                user.loggedIn = true;
                console.log(user)
                this.setState({email: user.email});
                this.setState({password: user.id});
                this.setState({name: user.name});
                this.setState({phone: user.id});
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
        if (this.state.loading) {
            return (<AppLoading/>)
        } else {
            return (
                <ScrollView>

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
                        <TouchableOpacity onPress={this.logIn}>
                            <LinearGradient
                                colors={['#4c669f', '#3b5998', '#192f6a']}
                                style={styles.facebookButton}
                            >
                                <Entypo name="facebook" style={styles.facebookIcon}/>
                                <Text style={styles.facebookButtonText}>
                                    Sign in with Facebook
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>


                        <Text style={style.text_margin}>{translate('OrSignUpWithEmail')}</Text>


                        <Item stackedLabel>
                            <Input placeholder={translate("Email")} onChangeText={(text) => {
                                this.setState({email: text})
                            }}/>
                        </Item>
                        <Item stackedLabel>
                            <Input placeholder={translate("phone")} keyboardType={"numeric"} onChangeText={(text) => {
                                this.setState({phone: parseInt(text)})
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
                                password: this.state.password,
                                phone: this.state.phone
                            };
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
}