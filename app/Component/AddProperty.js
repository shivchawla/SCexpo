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
    ListItem,
    Radio,
    Header,
    Picker,
    Title,
    Textarea,
    Left,
    Item, Row,
    Icon,
    Right, Badge, View, Accordion
} from "native-base";

import CheckBox from 'react-native-check-box'
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';
import {StyleProvider, Input} from "native-base";
import ImagePicker from 'react-native-image-picker';
import ImageCarousel from 'react-native-image-carousel';
import {ENTRIES1} from "./PropertyScreen";
import ScaledImage from "./Things/ScaledImage";
import reauthenticate from "../Utils/Reauthenticate";
import translate from "../Utils/i18n";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const dataArray = [
    {title: translate('amenities'), content: "Lorem ipsum dolor sit amet"},
];
let name = ""
let token = ""

let formData = new FormData();

function getPropTypes(token) {
    return fetch(`http://www.semsar.city/api/dynamics/types?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        params: JSON.stringify(token),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((apiResponse) => {
            return apiResponse.json();

        }).then((responseJson) => {
            console.log(responseJson);

            if (responseJson.success) {
                return {
                    success: true,
                    types: responseJson.propertiesType,
                    message: "done"
                }
            }
            return {
                success: false,
                message: "Error"
            }
        }).catch(function (error) {
            alert(error.message)
            return {
                success: false,
                message: error.message
            }
        })
}

export default class AddProperty extends React.Component {
    _imageCarousel: ImageCarousel;

    onPressLearnMore() {
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
                const source = {uri: response.uri};
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };


                console.log(response);

                this.setState({
                    files: [...this.state.files, response]
                });
            }
        });
    }

    submitProperty = (data) => {
        console.log(data);
        formData.append("product[token]", data.token);
        formData.append("product[title]", data.title);
        formData.append("product[description]", data.description);
        formData.append("product[location]", data.location);
        formData.append("product[sub_location]", data.sub_location);

        formData.append("product[area]", data.area);
        formData.append("product[status]", data.status);
        for (let i = 0; i < this.state.files.length; i++) {

            formData.append("product[gallery]" + "[" + i + "]" + "[file]", {
                uri: this.state.files[i].uri,
                name: this.state.files[i].fileName
                , type: this.state.files[i].type
            });
        }

        formData.append("product[featured_image]" + "[" + 0 + "]" + "[file]", {});

        if (this.state.files.length > 0) {
            formData.append("product[featured_image]" + "[" + 0 + "]" + "[file]", {
                uri: this.state.files[0].uri,
                name: this.state.files[0].fileName
                , type: this.state.files[0].type
            });
        }
        formData.append("product[price]", data.price);
        formData.append("product[amenties][]", data.amenities);
        formData.append("product[garage]", data.garage);
        formData.append("product[kitchens]", data.kitchens);
        formData.append("product[pool]", data.pool);

        formData.append("product[type]", data.type);
        formData.append("product[price_unit]", data.price_unit);
        formData.append("product[bedrooms]", data.bedrooms);
        formData.append("product[area_unit]", data.area_unit);

        return fetch("http://www.semsar.city/api/properties/submit", {
            method: 'POST',
            body: formData,
            headers: {'Content-Type': 'multipart/form-data'}
        }).then((apiResponse) => {
            console.log("api response", apiResponse);
            return {
                success: apiResponse.success,
                api_response: apiResponse
            }
        }).catch(error => {
            console.log(error);
            return {
                message: error.message,
                api_response: {success: false}
            }
        })
    };


    getLocations = () => {
        return fetch(`http://www.semsar.city/api/dynamics/locations?token=${encodeURIComponent(this.state.token)}`, {
            method: 'GET',
            params: JSON.stringify({token: this.state.token}),
            headers: {
                'Content-Type': 'application/json'
            }

        }).then((apiResponse) => {
            return apiResponse.json();
            // this.setState({result: apiResponse.result});s
        }).then((responseJson) => {
            console.log(responseJson);

            if (responseJson.locations != null) {
                return {
                    message: "done",
                    locations: responseJson.locations
                }
            }

            return {
                type: "REGISTER_USER",
                message: "Error"
            }
        }).catch(function (error) {
            alert(error.message)
            return {
                type: "REGISTER_USER",
                message: error.message
            }
        })

    };

    renderAmens = (item, idx) => {
        let index = this.state.propAmenity.indexOf(item.option);
        if (index > -1) {
            return (<Amenity checked={true} checkAmenity={this.checkAmenity} text={item.option}/>);
        } else {
            return (<Amenity checked={false} checkAmenity={this.checkAmenity} text={item.option}/>);
        }
    };

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                this.setState({email: await AsyncStorage.getItem('email')});
                this.setState({token: await AsyncStorage.getItem('token')});
                this.setState({id: await AsyncStorage.getItem('id')});
                this.setState({password: await AsyncStorage.getItem('password')});
                getPropTypes(this.state.token).then((res) => {
                    if (res.success) {
                        this.setState({propTypes: res.types})
                    } else if (res.message.includes("token")) {
                        reauthenticate({email: this.state.email, password: this.state.password}).then(token => {
                            this.getData();
                        })
                    }
                })
            } else {
            }

        } catch (error) {
            alert(error.message)
            // Error retrieving data
        }
    };

    onSubmitClicked = () => {
        if (!this.state.title) {
            alert("Title is required");
            return;
        }
        let gallery = [];
        let featured_image = [];
        if (this.state.files.length > 0) {
            featured_image.push(this.state.files[0].data);
        }
        for (let i = 0; i < this.state.files.length; i++) {
            console.log(this.state.files[i]);
            gallery.push(this.state.files[i].data)
        }

        console.log("hee");

        this.submitProperty({
            token: this.state.token,
            title: this.state.title,
            location: this.state.location,
            sub_location: this.state.sub_location,
            description: this.state.description,
            gallery: gallery,
            featured_image: featured_image,
            price: this.state.price,
            price_unit: this.state.moneyType,
            status: this.state.status,
            area: this.state.area,
            type: this.state.type,
            bathrooms: this.state.bathrooms,
            garage: this.state.garage,
            area_unit: "m2",
            bedrooms: this.state.bedrooms,
            kitchens: this.state.kitchens,
            pool: this.state.pool,
            amenites: this.state.propAmenity
        }).then(res => {
            console.log(res);
            if (res.success) {
                this.props.navigation.navigate("PromoteScreen")
            } else {
                if (res.message.includes("token")) {
                    console.log("here");
                    reauthenticate({email: this.state.email, password: this.state.password}).then(token => {
                        this.setState({token: token.token});
                        this.onSubmitClicked();
                    });
                }
            }
        })
    };

    renderContent = () => {
        return (
            <View>
                {this.state.amenities.map(this.renderAmens)}
            </View>

        );
    };

    constructor() {
        super();
        this.getData();
        this.state = {
            files: [],
            propAmenity: [],
            moneyType: "EUR",
            amenities: [{option: "Air Conditioning"},
                {option: "ADSL Cable"}
                , {option: "WiFi"}
                , {option: "HiFi Audio"}
                , {option: "Fridge"}
                , {option: "Grill"}
                , {option: "Full HD TV"}
                , {option: "Digital Antenna"}
                , {option: "Kitchen With Island"}
                , {option: "Exotic Garden"}
                , {option: "Guest House"}
                , {option: "Garage"}
                , {option: "Pool"}
            ],
            type: "",
            title: "",
            description: "",
            pool: false,
            bedrooms: 0,
            bathrooms: 0,
            garage: false,
            token: "",
            location: "",
            sub_location: "",
            kitchens: 0,
            price: "",
            status: "sale",
            area: "",
            email: "",
            password: "",
            propTypes: [],
            locations: [],
            sub_locations: []
        };
        this.getLocations().then(res => {
            console.log(res)
            if (res.message === "done") {

                this.setState({locations: res.locations})
                this.setState({location: res.locations[0].title});
                this.setState({location: res.locations[0].title});
                this.setState({sub_locations: res.locations[0].locations})
                if (res.locations[0].locations) {
                    if (res.locations[0].locations.length > 0) {
                        this.setState({sub_location: res.locations[0].locations[0].title});
                    }
                }
            } else if (res.message.contains("token")) {
                reauthenticate({
                    email: this.state.email,
                    password: this.state.password
                }).then(token => {
                    this.setState({token: token.token})
                    this.getLocations()
                        .then(final_res => {
                            if (final_res.message === "done") {
                                this.setState({locations: final_res.locations})
                                this.setState({location: final_res.locations[0].title})
                                this.setState({sub_locations: final_res.locations[0].locations})
                            }
                            if (final_res.message === "error") {
                                alert("Error")
                            } else if (final_res.message.includes("token")) {
                                alert("Error")
                            }
                        })
                })
            }

        })
        // this.onSubmitClicked = this.onSubmitClicked.bind(this);
        this.submitProperty = this.submitProperty.bind(this);
    }

    renderProPros = () => {
        return (
            <View>
                <View style={{marginTop: 8}}>
                    <Row style={{height: 48, alignItems: 'center'}}>
                        <Input style={{
                            backgroundColor: "#eaeaea",
                            borderRadius: 8,
                            textAlign: "center",
                            marginRight: 2
                        }}
                               keyboardType='numeric'
                               value={this.state.area} onChangeText={(text) => {
                            this.setState({area: text})
                        }} placeholder={translate('area')}/>

                        <Input style={{
                            backgroundColor: "#eaeaea",
                            borderRadius: 8,
                            textAlign: "center",
                            marginLeft: 2
                        }}
                               keyboardType='numeric'
                               value={this.state.bathrooms}
                               onChangeText={(text) => {
                                   this.setState({bathrooms: text})
                               }}
                               placeholder={translate('bathrooms')}/>
                    </Row>
                </View>
                <View style={{marginTop: 8}}>
                    <Row style={{height: 48, alignItems: 'center'}}>
                        <Picker style={{width: 25}}
                                selectedValue={this.state.type}

                                onValueChange={(val) => {
                                    this.setState({type: val});
                                    alert(val)
                                }}
                                prompt={translate('chooseType')}
                        >
                            {this.state.propTypes ?
                                this.state.propTypes.map((item, index) => {
                                    return <Picker.Item label={item.title} value={item.title}/>
                                }) :
                                null
                            }

                        </Picker>
                        <Picker style={{width: 25}}
                                selectedValue={this.state.status}
                                onValueChange={(val) => {
                                    this.setState({status: val});
                                    alert(val)
                                }}
                                prompt={translate('saleOrRent')}
                        >
                            <Picker.Item label={translate('sale')} value={"sale"}/>
                            <Picker.Item label={translate('rent')} value={"rent"}/>

                        </Picker>

                    </Row>
                </View>
                <View style={{marginTop: 8}}>
                    <Row style={{height: 48, alignItems: 'center'}}>
                        <Input style={{
                            backgroundColor: "#eaeaea",
                            borderRadius: 8,
                            textAlign: "center",
                            marginRight: 2
                        }}
                               value={this.state.bedrooms}
                               keyboardType='numeric' onChangeText={(text) => {
                            this.setState({bedrooms: text})
                        }} placeholder={translate('bedrooms')}/>
                        <Input style={{
                            backgroundColor: "#eaeaea",
                            borderRadius: 8,
                            textAlign: "center",
                            marginLeft: 2
                        }}
                               value={this.state.kitchens}
                               keyboardType='numeric' onChangeText={(text) => {
                            this.setState({kitchens: text})
                        }} placeholder={translate('kitchens')}/>
                    </Row>
                </View>
            </View>
        )
    };

    moneyType = (val) => {
        if (val !== 0) {
            this.setState({moneyType: val});
        }
    };

    renderImages = (item, index) => {
        return (<ScaledImage uri={item.uri} width={viewportWidth}/>);
    };

    checkAmenity = (text, isChecked) => {
        let amenities = this.state.propAmenity;
        console.log(isChecked);
        if (isChecked) {
            amenities.push(text)
        } else {
            let index = amenities.indexOf(text);
            if (index > -1) {
                amenities.splice(index, 1);
            }
        }
        this.setState({propAmenity: amenities})
        console.log(this.state.propAmenity)
    };

    handleLocationChange = (val) => {
        if (val !== 0) {
            this.setState({location: val});
            let index = 0;
            for (let i = 0; i < this.state.locations.length; i++) {
                if (this.state.locations[i].title === val) {
                    index = i;
                }
            }
            this.setState({sub_locations: this.state.locations[index].locations});
            if (this.state.locations[index].locations) {
                if (this.state.locations[index].locations.length > 0) {
                    this.setState({sub_location: this.state.locations[index].locations[0].title});
                    console.log(this.state.locations[index].locations)
                }
            }
        }
    };

    handlesubLocationChange = (val) => {
        if (val !== 0) {
            this.setState({sub_location: val});
        }
    };

    render() {
        let renderLocations = (item) => {
            return (<Picker.Item label={item.title} value={item.title}/>
            )
        };
        let renderSubLocations = (item) => {
            return (<Picker.Item label={item.title} value={item.title}/>
            )
        };
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
                        <Title>{translate('addProperty')}</Title>
                        </Body>
                    </Header>

                    <Content padder>
                        <ScrollView>

                            <Item>
                                <Input placeholder={translate('title')} onChangeText={(text) => {
                                    this.setState({title: text})
                                }}/>
                            </Item>
                            <Picker
                                selectedValue={this.state.location}
                                onValueChange={this.handleLocationChange.bind(this)}
                                prompt={translate('location')}
                            >
                                {this.state.locations.map(renderLocations)}

                            </Picker>
                            <Picker
                                selectedValue={this.state.sub_location}
                                onValueChange={this.handlesubLocationChange.bind(this)}
                                prompt={translate('sub_location')}
                            >
                                {this.state.sub_locations.map(renderSubLocations)}

                            </Picker>
                            <Textarea bordered placeholder={translate('description')} onChangeText={(text) => {
                                this.setState({description: text})
                            }}/>

                            <View style={{marginBottom: -8}}>
                                <Row style={{height: 48, alignItems: 'center'}}>

                                    <Text onPress={this.onPressLearnMore.bind(this)} uppercase style={{
                                        fontSize: 13,
                                        fontWeight: "700",
                                        color: "#9c9c9c"
                                    }}>{translate('addImage')}</Text>
                                    <Button transparent onPress={this.onPressLearnMore.bind(this)}>

                                        <Icon name={"add"}/>
                                    </Button>
                                </Row>
                            </View>

                            <ImageCarousel
                                style={{maxHeight: 220, backgroundColor: "#bbffe5"}}>
                                {this.state.files.map(this.renderImages)}
                            </ImageCarousel>

                            <View>

                                <Accordion
                                    headerStyle={{
                                        textTransform: 'uppercase',
                                        borderRadius: 8, fontSize: 12, backgroundColor: "#eaeaea",
                                        fontWeight: "700",
                                        color: "#9c9c9c"
                                    }}
                                    dataArray={[{title: translate('propertyProps')}]}
                                    renderContent={this.renderProPros.bind(this)} style={{marginTop: 8}}>

                                </Accordion>

                                <Accordion style={{border: 0, marginTop: 8}}
                                           headerStyle={{
                                               textTransform: 'uppercase',
                                               borderRadius: 8, fontSize: 12, backgroundColor: "#eaeaea",
                                               fontWeight: "700",
                                               color: "#9c9c9c"
                                           }}
                                           expandedIcon={""} dataArray={dataArray}
                                           renderContent={this.renderContent.bind(this)} expanded={false}/>

                            </View>

                            <View>
                                <Item>
                                    <Input placeholder={translate('price')} keyboardType="numeric"
                                           onChangeText={(text) => {
                                               this.setState({price: text})
                                           }}/>
                                </Item>
                                <Row style={{height: 48, alignItems: 'center'}}>

                                    <Text uppercase style={{
                                        fontSize: 13,
                                        fontWeight: "700",
                                        color: "#9c9c9c"
                                    }}>{translate('moneyType')}</Text>
                                    <Picker style={{width: 25, backgroundColor: "transparent"}}
                                            selectedValue={this.state.moneyType}
                                            onValueChange={this.moneyType.bind(this)}
                                            prompt={'Money Type'}
                                    >
                                        <Picker.Item label='EGP' value='EGP'/>
                                        <Picker.Item label='USD' value='USD'/>
                                        <Picker.Item label='EUR' value='EUR'/>

                                    </Picker>
                                </Row>
                            </View>

                            <Button full rounded primary
                                    onPress={this.onSubmitClicked}
                                    style={{marginTop: 8}}>
                                <Text style={{
                                    fontSize: 13,
                                    color: "#fff",
                                    fontWeight: "700"
                                }}>
                                    {translate('Submit')}
                                </Text>
                            </Button>
                        </ScrollView>
                    </Content>
                </Container>
            </StyleProvider>
        );
    }

}

class Amenity extends React.Component {

    constructor() {
        super();
        this.state = {
            isChecked: false
        }
    }

    componentWillMount() {
        this.setState({isChecked: this.props.checked});
    }

    render() {
        return (
            <CheckBox rightText={this.props.text} onClick={() => {
                this.props.checkAmenity(this.props.text, !this.state.isChecked);
                this.setState({isChecked: !this.state.isChecked})
            }} isChecked={this.state.isChecked}/>
        )
    }
}