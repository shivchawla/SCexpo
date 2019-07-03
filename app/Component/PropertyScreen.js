import React from "react";
import {
    AppRegistry,
    Alert,
    TouchableWithoutFeedback,
    Image,
    ScrollView,
    Dimensions,
    Modal,
    Linking,
    StyleSheet, AsyncStorage, Platform, I18nManager
} from "react-native";

import {
    Text,
    Container,
    Card,
    CardItem,
    Body,
    Grid, Col,
    Content,
    Header,
    Left,
    Right,
    Icon,
    Row,
    Title,
    Button,
    H1, StyleProvider, View
} from "native-base";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

import {StackNavigator} from "react-navigation";
import ImageCarousel from 'react-native-image-carousel';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';
import ScaledImage from "./Things/ScaledImage";
import call from 'react-native-phone-call';
import {DownloadGallery, DownloadImage} from "../Utils/DownloadGallery";
import {SQLite} from "expo-sqlite";

import translate from "../Utils/i18n";
import reauthenticate from "../Utils/Reauthenticate";

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
        backgroundColor: "#ffffff", width: '90%', height: 250, padding: 16,
    }
});

const db = SQLite.openDatabase("SemsarCity.db");

export default class PropertyScreen extends React.Component {
    _imageCarousel: ImageCarousel;


    selectFromDatabase = (tx, ui) => {
        return new Promise(function (resolve, reject) {
            tx.executeSql('SELECT downloaded_image FROM home_props where created_at="'
                + ui + '"', [], (tx, results) => {
                // console.log("here");
                const rows = results.rows;
                let result = [];
                // console.log("n", results);
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    result.push(row)
                    console.log(row)
                }
                resolve({rows: results.rows.length, data: result})
            })
        })

    };

    componentDidMount() {
        (this: any)._renderHeader = this._renderHeader.bind(this);
        let enhance = [];
        if (db) {
            console.log("Database open!");
            console.log(db)
        }
        db.transaction(tx => {
            this.selectFromDatabase(tx, this.props.navigation.state.params.data.created_at).then(res => {
                if (res.rows > 0) {
                    if (res.data[0].downloaded_image !== "not" && res.data[0].downloaded_image) {
                        try {
                            for (let i = 0; i < res.data[0].downloaded_image.split(",").length; i++) {

                                if (Platform.OS === 'android') {
                                    enhance.push('file://' + res.data[0].downloaded_image.split(",")[i])
                                } else {
                                    enhance.push(res.data[0].downloaded_image.split(",")[i])
                                }
                            }
                        } catch (e) {
                            console.log(e.message);
                            enhance.push("https://bigriverequipment.com/wp-content/uploads/2017/10/no-photo-available.png")
                        } finally {
                            this.setState({gallery: enhance});
                        }

                    } else {
                        try {
                            // this.setState({gallery: this.props.navigation.state.params.data.gallery.split(",")});
                            for (let i = 0; i < this.props.navigation.state.params.data.gallery.split(",").length; i++) {
                                if (this.props.navigation.state.params.data.gallery.split(",")[i].toLowerCase().includes("png") ||
                                    this.props.navigation.state.params.data.gallery.split(",")[i].toLowerCase().includes("jpg")) {

                                    enhance.push("https://www.semsar.city/manage/img/properties/" + this.props.navigation.state.params.data.gallery.split(",")[i])
                                }
                            }
                        } catch (e) {
                            console.log(e.message);
                            enhance.push("https://bigriverequipment.com/wp-content/uploads/2017/10/no-photo-available.png")
                        } finally {
                            if (enhance.length === 0) {
                                enhance.push("https://bigriverequipment.com/wp-content/uploads/2017/10/no-photo-available.png")
                            }
                            this.setState({gallery: enhance});
                            if (this.props.navigation.state.params.data.downloaded_image === "not") {
                                console.log("started");
                                if (enhance.length > 0) {
                                    console.log("lngth");
                                    DownloadGallery(enhance,
                                        this.props.navigation.state.params.data.created_at
                                    );
                                } else {
                                    console.log("not")
                                }
                            }
                        }
                    }

                }
            });
        });


        let amens = [];
        try {
            this.setState({amenties: this.props.navigation.state.params.data.amenties.split(",")})
        } catch (e) {
            amens.push(translate('notSpecified'))
            this.setState({amenties: amens})
        }
    }

    _renderHeader() {
        return (
            <TouchableWithoutFeedback onPress={this._imageCarousel.close}>
                <View>
                    <Text>Exit</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    getContact = () => {
        console.log(this.props.navigation.state.params.data);
        return fetch("http://www.semsar.city/api/get/user/" + this.props.navigation.state.params.data.user_id + "?token=" + this.state.token, {
            method: 'GET',
            params: JSON.stringify({token: this.state.token}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resApi => {
            return resApi.json();
        }).then((apiResJson) => {
            return apiResJson
        }).catch(function (error) {
            return {
                type: "REGISTER_USER",
                message: error.message
            }
        })
    };

    static _renderContent(idx) {
        alert(idx.url);
        return (
            <Image style={{minHeight: 120}} source={{uri: idx.url}}/>
        )
    }

    constructor() {
        super();
        this.state = {
            gallery: [],
            name: "Semsar City",
            amenties: [],
            openContactModal: false,
            type: "",
            owner_email: "semsar@semsar.city",
            phone: "01156044886",
            website: "semsar.city",
            token: "",
            email: "",
            password: ""
        };
        this.getName = this.getName.bind(this);
        this.getName();
        this.getContact = this.getContact.bind(this);
    }

    call = () => {
        //handler to make a call
        const args = {
            number: '01156044886',
            prompt: false,
        };
        call(args).catch(console.error);
    };

    getName = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                let token = await AsyncStorage.getItem('token');
                let type = await AsyncStorage.getItem('type');
                let email = await AsyncStorage.getItem('email');
                let password = await AsyncStorage.getItem('password');
                this.setState({type: type});
                this.setState({token: token});
                this.setState({email: email});
                this.setState({password: password});
                if (type === "agent") {
                    this.getContact().then(res => {
                        console.log(res)
                        if (res.success) {
                            console.log(res);
                            this.setState({phone: res.phone});
                            this.setState({owner_email: res.email});
                            this.setState({name: res.name});
                            this.setState({image: res.image});
                            this.setState({image: res.image});
                            this.setState({website: "http://semsar.city/" + this.props.navigation.state.params.data.user_id});
                        } else if (res.message.includes("token")) {
                            console.log(res);
                            reauthenticate({email: this.state.email, password: this.state.password}).then(token => {
                                this.setState({token: token.token});
                                console.log(token)
                                this.getContact();
                            })
                        }
                    })
                }
            }
        } catch (e) {
            alert(e.message)
        }
    };

    render() {
        let renderImages = (item, index) => {
            return (<ScaledImage uri={item} width={viewportWidth}/>);
        };
        let _renderFooter = () => {
            return (
                <Text style={{height: 48}}>Footer!</Text>
            );
        };
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header style={{marginTop: -18}}>
                        <Left style={{margin: 0}}>
                            <Button transparent onPress={() => {
                                this.props.navigation.goBack()
                            }}>
                                <Icon name='arrow-back' color={"#000"}/>
                            </Button>
                        </Left>

                        <Body>
                        <Title style={{
                            color: "#000"
                        }}>{this.props.navigation.state.params.data.title}</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => {
                                this.props.navigation.goBack()
                            }}>
                            </Button>
                        </Right>
                    </Header>
                    <Modal visible={this.state.openContactModal}
                           transparent={true}
                           animationType={"fade"}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                            <View style={styles.containerStyle}>
                                <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                    <Icon name={"call"} style={{fontSize: 20, marginRight: 8}}/>
                                    <Text onPress={this.call}>{this.state.phone}</Text>
                                </View>
                                <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                    <Icon name={"mail"} style={{fontSize: 20, marginRight: 8}}/>
                                    <Text selectable={true}>{this.state.owner_email}</Text>
                                </View>
                                <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                    <Icon name={"globe"} style={{
                                        fontSize: 20, marginRight: 8, textAlign: 'center'
                                    }}/>
                                    <Text style={{
                                        marginRight: 8, textAlign: 'center',
                                        color: "#5972ff",
                                        textDecorationLine: 'underline'
                                    }} onPress={() => {
                                        Linking.openURL(this.state.website)
                                    }}>{this.state.website}</Text>
                                </View>

                                <Button bordered style={{position: "absolute", bottom: 16, left: 16}}
                                        onPress={() => {
                                            this.setState({openContactModal: false})
                                        }}>
                                    <Text uppercase style={{fontSize: 12, fontWeight: "600"}}>Close</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>

                    <ScrollView>
                        <View>

                            <ImageCarousel
                                renderFooter={_renderFooter}
                                style={{minHeight: 120}}>
                                {this.state.gallery.length > 0 ? this.state.gallery.map(renderImages) : null}
                            </ImageCarousel>
                            <View style={{padding: 8}}>
                                <Text uppercase style={{
                                    fontSize: 13,
                                    fontWeight: "700",
                                    color: "#9c9c9c"
                                }}>{translate('description')}</Text>
                                {I18nManager.isRTL
                                    ? <Text
                                        style={{textAlign: "left"}}>{this.props.navigation.state.params.data.description}</Text>

                                    : <Text>{this.props.navigation.state.params.data.description}</Text>

                                }
                            </View>

                            <View style={{padding: 8}}>
                                <Text uppercase style={{
                                    fontSize: 13,
                                    fontWeight: "700",
                                    color: "#9c9c9c"
                                }}>{translate('location')}</Text>
                                {I18nManager.isRTL ? <Text uppercase
                                                           style={{
                                                               fontSize: 12,
                                                               textAlign: "left"
                                                           }}>
                                        {this.props.navigation.state.params.data.location + ", " + this.props.navigation.state.params.data.sub_location}</Text>
                                    : <Text uppercase
                                            style={{fontSize: 12}}>{this.props.navigation.state.params.data.location + ", " + this.props.navigation.state.params.data.sub_location}</Text>
                                }
                            </View>
                            <View style={{padding: 8}}>
                                <Text uppercase style={{
                                    fontSize: 13,
                                    fontWeight: "700",
                                    color: "#9c9c9c"
                                }}>{translate('propertyProps')}</Text>

                                <View style={{flexDirection: "row"}}>
                                    <View style={{marginRight: 8}}>
                                        {this.props.navigation.state.params.data.type ?
                                            <Text uppercase style={{fontSize: 12}}>

                                                • type: {this.props.navigation.state.params.data.type}

                                            </Text>
                                            :
                                            null
                                        }
                                        {this.props.navigation.state.params.data.area ?
                                            <Text uppercase style={{fontSize: 12}}>
                                                • area: {this.props.navigation.state.params.data.area} m2
                                            </Text>
                                            :
                                            null
                                        }
                                        {this.props.navigation.state.params.data.bedrooms ?
                                            <Text uppercase style={{fontSize: 12}}>•
                                                bedrooms: {this.props.navigation.state.params.data.garage}</Text>
                                            : null
                                        }
                                        {this.props.navigation.state.params.data.bathrooms ?
                                            <Text uppercase style={{fontSize: 12}}>•
                                                bathrooms: {this.props.navigation.state.params.data.bathrooms}</Text>
                                            : null
                                        }
                                    </View>
                                    <View>

                                        {this.props.navigation.state.params.data.garage ?
                                            <Text uppercase style={{fontSize: 12}}>
                                                • garage: {this.props.navigation.state.params.data.garage}
                                            </Text>
                                            :
                                            null
                                        }
                                        {this.props.navigation.state.params.data.kitchens ?
                                            <Text uppercase style={{fontSize: 12}}>
                                                • kitchens: {this.props.navigation.state.params.data.kitchens}
                                            </Text>
                                            :
                                            null
                                        }
                                        {this.props.navigation.state.params.data.status ?
                                            <Text uppercase style={{fontSize: 12}}>
                                                • status: {this.props.navigation.state.params.data.status}
                                            </Text>
                                            :
                                            null
                                        }
                                    </View>

                                </View>
                            </View>


                            <View style={{padding: 8}}>
                                <Text uppercase style={{
                                    fontSize: 13,
                                    fontWeight: "700",
                                    color: "#9c9c9c",

                                }}>{translate('price')}</Text>
                                {this.props.navigation.state.params.data.price ?
                                    <View style={{flexDirection: "row", display: "flex", alignItems: "center"}}>
                                        {this.props.navigation.state.params.data.price ?
                                            <Text uppercase>
                                                {this.props.navigation.state.params.data.price + " "}
                                                {
                                                    this.props.navigation.state.params.data.price_unit ?
                                                        this.props.navigation.state.params.data.price_unit + " "
                                                        : null
                                                }
                                            </Text>
                                            :
                                            null
                                        }

                                        {this.state.type === "agent" ? <Text uppercase
                                                                             style={{
                                                                                 textDecorationLine: 'line-through',
                                                                                 textDecorationStyle: 'solid'
                                                                             }}>

                                            {this.props.navigation.state.params.data.old_price ?
                                                <Text uppercase style={{fontSize: 15, color: "gray"}}>

                                                    {this.props.navigation.state.params.data.old_price + " "}
                                                    {
                                                        this.props.navigation.state.params.data.price_unit ?
                                                            this.props.navigation.state.params.data.price_unit
                                                            : null
                                                    }
                                                </Text>
                                                :
                                                null
                                            }
                                        </Text> : <Text uppercase
                                                        style={{
                                                            fontSize: 11,
                                                            fontWeight: "600",
                                                            margin: 6,
                                                            color: "red"
                                                        }}>
                                            {translate('negotiable')}
                                        </Text>}


                                    </View>
                                    :
                                    <Text style={{fontSize: 12}}>• {translate('notSpecified')}</Text>
                                }

                            </View>

                            <View style={{padding: 8}}>

                                <Text uppercase style={{
                                    fontSize: 13,
                                    fontWeight: "700",
                                    color: "#9c9c9c"

                                }}>{translate("amenities")}</Text>

                                <View>

                                    {this.state.amenties.map((item, index) => {
                                        return <Text style={{fontSize: 12}}>• {item}</Text>
                                    })}
                                </View>

                            </View>

                            <View style={{
                                padding: 8,
                                justifyContent: "center",
                                alignSelf: 'center',
                                alignItems: 'center',
                                marginBottom: 30
                            }}>

                                <Button primary full rounded onPress={() => {
                                    this.setState({openContactModal: true})
                                }}>
                                    <Text style={{
                                        fontSize: 13,
                                        color: "#fff",
                                        fontWeight: "700"
                                    }}>Contact {this.state.name}</Text>
                                </Button>

                            </View>
                        </View>

                    </ScrollView>
                </Container>

            </StyleProvider>
        );
    }
}