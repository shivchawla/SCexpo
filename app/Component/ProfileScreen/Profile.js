import React from "react";
import {
    AppRegistry,
    Alert,
    Image,
    Dimensions,
    ScrollView,
    AsyncStorage,
    Modal,
    Linking,
    TouchableOpacity,
    StyleSheet,
    Share
} from "react-native";
import StarRating from 'react-native-star-rating';
import ImagePicker from 'react-native-image-picker';
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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {ShareDialog, LoginButton, ShareButton, AccessToken} from 'react-native-fbsdk';
import {StackNavigator} from "react-navigation";

import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/variables';
import Popup from "../Things/Popup";
import SettingsScreen from "../SettingsScreen/SettingsScreen";
import reauthenticate from "../../Utils/Reauthenticate";
import Property from "../Things/Property";
import translate from "../../Utils/i18n";
import {Permissions, Constants} from 'expo';
import {Entypo} from '@expo/vector-icons';
import style from '../../styles/facebookLoginStyle';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        backgroundColor: "#ffffff", width: '90%', height: 150, padding: 16,
    }
});


// function login() {
//     LoginManager.logInWithReadPermissions(['public_profile']).then(
//         function(result) {
//             if (result.isCancelled) {
//                 alert('Login was cancelled');
//             } else {
//                 alert('Login was successful with permissions: '
//                     + result.grantedPermissions.toString());
//             }
//         },
//         function(error) {
//             alert('Login failed with error: ' + error);
//         }
//     );
// }

// http://www.semsar.city/api/properties/my-properties


function getUser(data) {

    return fetch(`http://www.semsar.city/api/users/me?token=${encodeURIComponent(data.token)}}`, {
        method: 'GET',
        params: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }

    }).then((apiResponse) => {
        return apiResponse.json();
        // this.setState({result: apiResponse.result});s
    }).then((responseJson) => {
        if (responseJson.name != null) {
            return {
                type: "REGISTER_USER",
                message: "done",
                result: responseJson
            }
        }
        return {
            type: "REGISTER_USER",
            message: "error"
        }

    }).catch(function (error) {
        return {
            type: "REGISTER_USER",
            message: error.message
        }
    })
}

export default class Profile extends React.Component {
    static navigationOptions = {
        header: null,
    };


    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result);

        if (!result.cancelled) {

            const source = {uri: result.uri};
            this.getImageName(result.uri).then(res => {
                result.name = res.name;
                result.type = res.ex;
                console.log(res)

                let finalResult = {
                    name: res.name,
                    type: res.ex,
                    uri: result.uri,
                };
                this.setState({avatar: finalResult});
                Alert.alert('Upload', 'Confirm Upload',
                    [
                        {text: 'Upload', onPress: () => this.onUploadClicked()},
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
                    ],
                    {cancelable: false}
                );
            })

        }
    };

    getImageName(uri) {
        return new Promise((resolve, reject) => {
            let name = '';
            let ex = '';
            for (let i = uri.length - 1; i >= 0; i--) {
                console.log(uri[i])
                if (uri[i] !== '/') {
                    name = name + uri[i];
                } else {
                    ex = uri.toLowerCase().includes("png") ? "image/png" : "image/jpeg";
                    let arrName = name.split("");
                    arrName = arrName.reverse();
                    name = arrName.join("");
                    resolve({
                        name: name,
                        ex: ex
                    });
                    break;

                }
            }
        })

    }

    componentDidMount() {
        this.setState({show: true})
    }

    uploadImage = (data) => {

        let formData = new FormData();
        formData.append("image", {
            uri: data.image.uri,
            type: data.image.type,  // <-  Did you miss that one?
            name: data.image.name
        });
        formData.append("token", data.token);

        return fetch("http://www.semsar.city/api/agents/update/image", {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => res.json())
            .then((apiResponse) => {
                console.log("api response", apiResponse);
                return {
                    success: apiResponse.success,
                    message: apiResponse
                }
            })
            .catch(function (error) {
                return {
                    message: error.message,
                    success: false
                }
            })
    }

    componentWillMount() {
        this.setState({me: true});
    }

    getInfo() {
        if (this.state.me) {
            getUser({token: this.state.token}).then(res => {
                if (res.message === "done") {
                    this.setState({name: res.result.name})
                    this.setState({image: "1555612135-PRqC2F.jpg"})
                } else if (res.message.includes("token")) {
                    reauthenticate({email: this.state.email, password: this.state.password}).then(res => {
                        getUser({token: res.token}).then(res => {
                            if (res.message === "done") {
                                this.setState({name: res.result.name})
                                this.setState({image: res.result.image})
                            } else {
                            }
                        })
                    })
                }
            })
        }
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                this.setState({email: await AsyncStorage.getItem('email')});
                this.setState({token: await AsyncStorage.getItem('token')});
                this.setState({password: await AsyncStorage.getItem('password')});
                this.setState({name: await AsyncStorage.getItem('name')});
            } else {
                alert(value)
            }

        } catch (error) {
            alert(error.message)
            // Error retrieving data
        }
    };

    getProperties() {
        let dataApi1 = {
            token: this.state.token,
        };

        return fetch(`http://www.semsar.city/api/agents/agent-properties/${encodeURIComponent(this.props.navigation.state.params.data.name)}
        ?token=${encodeURIComponent(this.state.token)}`, {
            method: 'GET',
            params: JSON.stringify(dataApi1),
            headers: {
                'Content-Type': 'application/json'
            }

        }).then((apiResponse) => {
            return apiResponse.json();
            // this.setState({result: apiResponse.result});s
        }).then((responseJson) => {
            console.log(responseJson)
            return {success: true, listing: responseJson.agentProperties, message: "done"};
        }).catch(function (error) {
            return {
                message: error.message,
                success: false
            }
        })
    };

    onSeeListingClicked() {
        let reauthData = {
            email: this.state.email,
            password: this.state.password
        };
        this.getProperties().then(res => {
            if (res.success) {

                this.setState({listing: res.listing});
                console.log(res.listing);
                if (res.listing.length === 0) {
                    alert("This user has no listing")
                }
            } else if (res.message.includes("token")) {
                reauthenticate(reauthData).then(resultToken => {
                    this.setState({token: resultToken.token});
                    this.onSeeListingClicked();
                })
            }
        })
    }

    constructor() {
        super();
        this.state = {
            popX: 0.0,
            popY: 0.0,
            popH: 0.0,
            inpY: 0.0,
            inpX: 0.0,
            inpH: 0.0,
            showPicPop: true,
            showInputPop: true,
            email: "",
            password: "",
            token: "",
            listing: [],
            me: true,
            name: "",
            shareLinkContent: shareLinkContent,
            image: "",
            openRateModal: false,
            rate: 0,
            avatar: null
        };

        const shareLinkContent = {
            contentType: 'link',
            contentUrl: "https://facebook.com",
            contentDescription: this.state.name,
        };

        this.getProperties = this.getProperties.bind(this);
        this.onSeeListingClicked = this.onSeeListingClicked.bind(this);
        this.getData = this.getData.bind(this);
        this.openRateModal = this.openRateModal.bind(this);
        this.sendRate = this.sendRate.bind(this);
        this.submitRate = this.submitRate.bind(this);
        this.onImageClicked = this.onImageClicked.bind(this);
        this._pickImage = this._pickImage.bind(this);
        this.getData();
    }

    openRateModal() {
        this.setState({openRateModal: !this.state.openRateModal})
    };

    onStarRatingPress(rating) {
        this.setState({
            rate: rating
        });
    };

    sendRate = () => {
        let data = {
            token: this.state.token,
            agent_id: this.props.navigation.state.params.data.id,
            rate: this.state.rate + ".0"
        };
        return fetch("http://www.semsar.city/api/rate", {
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
                    return {success: apiResponse.success, message: apiResponse.rate}

                } else {
                    return {success: apiResponse.success, message: apiResponse.error}
                }
            })
            .catch(function (error) {
                return {
                    success: false,
                    message: error.message
                }
            })

    }

    submitRate = () => {
        this.sendRate().then(res => {
            if (res.success) {
                this.openRateModal();
            } else if (res.message.includes("token")) {
                reauthenticate({email: this.state.email, password: this.state.password}).then(resToken => {
                    this.setState({token: resToken.token});
                    this.submitRate();
                })
            }
        })
    };

    onImageClicked = () => {
        const options = {
            title: 'Select Avatar',
            customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

            }
        });
    };
    //
    // contentUrl: "https://facebook.com",
    // contentDescription: this.state.name,

    _shareMessage(name) {
        Share.share({
            message: "https://semsar.city/" + name
        })
            .then((res) => {
                alert("done")
            })
            .catch((error) => {

            });
    }

    onUploadClicked = () => {
        let data = {
            image: this.state.avatar
        };

        this.uploadImage({
            token: this.state.token,
            image: this.state.avatar
        }).then((res) => {
            console.log(res);
            if (!res.success) {
                console.log(res.message.errors)
                if (res.message.includes("token")) {
                    reauthenticate({email: this.state.email, password: this.state.password}).then(token => {
                        this.setState({token: token.token});
                        this.onUploadClicked();
                    })
                }
            }
        })
    };

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                                <Icon name="menu"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>{translate('page')}</Title>
                        </Body>
                        {this.state.name === this.props.navigation.state.params.data.name ? <Right>

                            <TouchableOpacity style={{
                                backgroundColor: "#0049ff",
                                padding: 4,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center"
                            }} onPress={() => {
                                this._shareMessage(this.props.navigation.state.params.data.name)
                            }}>
                                <Entypo name="share" style={style.facebookIcon}/>
                                <Text style={{fontSize: 12, fontWeight: "600", color: "white"}}>Share</Text>
                            </TouchableOpacity>
                        </Right> : null}
                    </Header>


                    <Modal visible={this.state.openRateModal}
                           transparent={true}
                           animationType={"fade"}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                            <View style={styles.containerStyle}>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    rating={this.state.rate}
                                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                                />

                                <View style={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: 8,
                                    left: 8,
                                    flexDirection: "row"
                                }}>

                                    <Button disabled={!this.state.rate > 0.0}
                                            onPress={this.submitRate}>
                                        <Text>{translate('Submit')}</Text>
                                    </Button>

                                    <Button light style={{marginLeft: 8}}
                                            onPress={this.openRateModal}>
                                        <Text>{translate('cancel')}</Text>
                                    </Button>

                                </View>
                            </View>

                        </View>


                    </Modal>
                    <Content padder>
                        <ScrollView>
                            <View>
                                <View>

                                    <TouchableOpacity
                                        disabled={this.props.navigation.state.params.data.name !== this.state.name}
                                        onPress={this._pickImage}>

                                        <Image style={{
                                            borderRadius: viewportWidth * .25,
                                            height: viewportWidth * .5,
                                            alignSelf: "center",
                                            boderStyle: "solid",
                                            borderWidth: 3,
                                            borderColor: "#69f0ae",
                                            width: viewportWidth * .5,
                                            opacity: 1,
                                        }}
                                               source={{uri: "https://i.kinja-img.com/gawker-media/image/upload/s--bIV3xkEm--/c_scale,f_auto,fl_progressive,q_80,w_800/jsprifdd1gmfy7e7nola.jpg"}}

                                        />
                                    </TouchableOpacity>


                                </View>


                                <Item onLayout={event => {
                                    const layout = event.nativeEvent.layout;
                                    this.setState({inpY: layout.y});
                                    this.setState({inpX: layout.x});
                                    this.setState({inpH: layout.height});

                                }}>
                                    <Input disabled placeholder="Display name"
                                           value={this.props.navigation.state.params.data.name}/>
                                </Item>

                                <ListItem button onPress={this.onSeeListingClicked}
                                          style={{float: "left", width: viewportWidth}}
                                >
                                    <Text style={{float: "left"}}>{translate('listing')}</Text>
                                </ListItem>
                                {this.state.name === this.props.navigation.state.params.data.name ? null :
                                    <ListItem button onPress={this.openRateModal}
                                              style={{float: "left", width: viewportWidth}}
                                    >
                                        <Text style={{float: "left"}}>{translate('rateAgent')}</Text>
                                    </ListItem>}
                            </View>

                            {this.state.listing.map(((item, indx) => {
                                return <Property data={item}/>
                            }))}
                        </ScrollView>
                    </Content>
                </Container>

            </StyleProvider>

        );
    }

}
