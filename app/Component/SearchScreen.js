import React from "react";
import {AsyncStorage, ScrollView, StatusBar, ActivityIndicator} from "react-native";
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
    Accordion,
    Icon,
    Right, Input, View, Picker, Form
} from "native-base";
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';
import {StyleProvider} from "native-base";
import RangeSlider from 'react-native-range-slider'
import Property from "./Things/Property";
import axios from 'axios'
import reauthenticate from "../Utils/Reauthenticate";
import translate from "../Utils/i18n";

const dataArray = [
    {title: translate('searchOps'), content: "Lorem ipsum dolor sit amet"},
];

function Loading() {
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000
        }}>
            <View style={{textAlign: "center"}}>
                <ActivityIndicator size="large"/>
            </View>
        </View>
    )
}

function search(data) {

    return fetch(`http://www.semsar.city/api/properties/search?type=${encodeURIComponent(data.type)}&location=${encodeURIComponent(data.location)}&sub_location=${encodeURIComponent(data.sub_location)}&min_price=${encodeURIComponent(data.min_price)}&max_price=${encodeURIComponent(data.max_price)}&bedrooms=${encodeURIComponent(data.bedrooms)}&bathrooms=${encodeURIComponent(data.bathrooms)}&area=${encodeURIComponent(data.area)}&id=${encodeURIComponent(data.id)}&submitted=${encodeURIComponent(data.submitted)}&status=${encodeURIComponent(data.status)}`, {
        method: 'GET',
        params: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }

    }).then((apiResponse) => {
        return apiResponse.json();
        // this.setState({result: apiResponse.result});s
    }).then((responseJson) => {
        console.log(responseJson);

        if (responseJson.result != null) {
            return {
                type: "REGISTER_USER",
                message: "done",
                result: responseJson.result
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

export default class SearchScreen extends React.Component {

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
    handleChangeOption = (val) => {
        if (val !== 0) {
            this.setState({type: val});
        }
    };

    handleChangeOption2 = (val) => {
        if (val !== 0) {
            this.setState({status: val});
        }
    };
    handlesubLocationChange = (val) => {
        if (val !== 0) {
            this.setState({sub_location: val});
        }
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
            } else {
            }

        } catch (error) {
            alert(error.message)
            // Error retrieving data
        }
    };

    constructor(props) {
        super(props);
        this.getData();
        this.state = {
            type: null,
            status: null,
            bedrooms: 0,
            bathrooms: 0,
            sub_location: 0,
            sub_locations: [],
            id: "",
            token: "",
            location: "",
            locations: [],
            password: "",
            email: "",
            max_price: "",
            min_price: "",
            area: "",
            submitted: "",
            result: []

        };
        this.getLocations().then(res => {
            console.log(res)
            if (res.message === "done") {

                this.setState({locations: res.locations})
                this.setState({location: res.locations[0].title})
                this.setState({sub_locations: res.locations[0].locations})
            }else if (res.message.contains("token")){
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

    }


    render() {

        let renderResult = (item) => {
            return (<Property navigation={this.props.navigation} data={{
                title: item.title,
                subtitle: item.description,
                illustration: "https://www.semsar.city/manage/img/properties/" + item.featured_image,
                avatar: "https://tripppy.herokuapp.com/imgs/favicon.png",
                name: "Semsar City",
                date: "26 APR",
                price: item.price + " " + item.price_unit,
                type: item.type,
                location: item.location,
                gallery: item.gallery

            }}/>)
        };


        let renderPropertyType = (item) => {
            return (<Picker.Item label={item.label} value={item.label}/>
            )
        };
        let renderLocations = (item) => {
            return (<Picker.Item label={item.title} value={item.title}/>
            )
        }; let renderSubLocations = (item) => {
            return (<Picker.Item label={item.title} value={item.title}/>
            )
        }
        let renderContent = (item) => {
            return (
                <View>
                    <Picker
                        selectedValue={this.state.selectedValue}
                        onValueChange={this.handleChangeOption.bind(this)}
                        prompt={'Property type'}
                    >

                        <Picker.Item label={translate('chooseType')} value='null'/>
                        <Picker.Item label='Apartment' value='aprt'/>
                        <Picker.Item label='Furnished Apartment' value='house'/>
                        <Picker.Item label='Chalet' value='chalet'/>
                        <Picker.Item label='Villa' value='villa'/>
                        <Picker.Item label='Land' value='land'/>
                        <Picker.Item label='Building' value='building'/>
                        <Picker.Item label='Administrative' value='admin'/>
                        <Picker.Item label='Commercial' value='commercial'/>
                        <Picker.Item label='Medical' value='medical'/>
                        <Picker.Item label='Shared Room' value='shared'/>
                        <Picker.Item label='Other' value='other'/>
                    </Picker>
                    <Picker
                        selectedValue={this.state.selectedValue}
                        onValueChange={this.handleChangeOption2.bind(this)}
                        prompt={translate('saleOrRent')}
                    >
                        <Picker.Item label={translate('sale')} value='sale'/>
                        <Picker.Item label={translate('rent')} value='rent'/>

                    </Picker>
                    <View style={{
                        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        background: '#eaeaea',
                        marginTop: 8
                    }}>

                        <View style={{flex: 1}}>
                            <Input style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                                   keyboardType='numeric' placeholder={translate('area')} onChangeText={(text) => {
                                this.setState({area: text})
                            }}/>
                        </View>
                        <View style={{
                            backgroundColor: "#000",
                            width: 1,
                            height: 35,
                            marginLeft: 2,
                            marginRight: 2,
                            opacity: .3
                        }}>

                        </View>
                        <View style={{flex: 1}}>
                            <Input style={{backgroundColor: "#eaeaea", textAlign: "center", borderRadius: 8}}
                                   keyboardType='text' onChangeText={(text) => {
                                this.setState({sub_location: text})
                            }} placeholder={translate('sub_location')}/>
                        </View>
                    </View>


                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        textAlign: "center",
                        justifyContent: 'center',
                        background: '#eaeaea',
                        marginTop: 8
                    }}>

                        <View style={{flex: 1}}>
                            <Input style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                                   keyboardType='numeric' onChangeText={(text) => {
                                this.setState({min_price: text})
                            }} placeholder={translate('min_price')}/>
                        </View>
                        <View style={{
                            backgroundColor: "#000",
                            width: 1,
                            height: 35,
                            marginLeft: 2,
                            marginRight: 2,
                            opacity: .3
                        }}>

                        </View>
                        <View style={{flex: 1}}>
                            <Input style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                                   keyboardType='numeric' onChangeText={(text) => {
                                this.setState({max_price: text})
                            }} placeholder={translate('max_price')}/>
                        </View>
                    </View>


                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        textAlign: "center",
                        justifyContent: 'center',
                        background: '#eaeaea',
                        marginTop: 8
                    }}>

                        <View style={{flex: 1}}>
                            <Input style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                                   keyboardType='numeric' onChangeText={(text) => {
                                this.setState({bedrooms: text})
                            }} placeholder={translate('bedrooms')}/>
                        </View>
                        <View style={{
                            backgroundColor: "#000",
                            width: 1,
                            height: 35,
                            marginLeft: 2,
                            marginRight: 2,
                            opacity: .3
                        }}>

                        </View>
                        <View style={{flex: 1}}>
                            <Input style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                                   keyboardType='numeric' onChangeText={(text) => {
                                this.setState({bathrooms: text})
                            }} placeholder={translate('bathrooms')}/>
                        </View>
                    </View>


                </View>
            );
        };

        let renderHeader = (item) => {
            return (
                <View style={{
                    padding: 8,
                    backgroundColor: "#eaeaea",
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Text style={{fontSize: 12, flex: 1}}>{item.title}</Text>
                    <Right><Button transparent><Icon name={"arrow-down"}/></Button></Right>
                </View>
            );
        };

        return (
            <StyleProvider style={getTheme(material)}>
                <ScrollView>
                    <Header style={{backgroundColor: "#fff", marginTop: -18}}>
                        <Left>
                            <Button transparent onPress={() => {
                                this.props.navigation.goBack()
                            }}>
                                <Icon name='arrow-back'/>
                            </Button>
                        </Left>

                        <Body>
                        <Title style={{color: "#000"}}>{translate('search')}</Title>
                        </Body>
                    </Header>
                    <Content padder>
                        <Card noShadow style={{padding: 8, borderRadius: 8}}>

                            <Picker
                                selectedValue={this.state.location}
                                onValueChange={this.handleLocationChange.bind(this)}
                                prompt={'Location'}
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

                            <Content padder>
                                <Accordion style={{border: 0}}
                                           headerStyle={{borderRadius: 8, fontSize: 12, backgroundColor: "#eaeaea"}}
                                           expandedIcon={""} dataArray={dataArray}
                                           renderContent={renderContent} expanded={false}/>

                                <Button primary full rounded noShadow onPress={() => {
                                    search(this.state)
                                        .then(res => {
                                                if (res.message === "done") {
                                                    this.setState({result: res.result})
                                                } else if (res.message.includes("token")) {
                                                    reauthenticate({
                                                        email: this.state.email,
                                                        password: this.state.password
                                                    }).then(token => {
                                                        this.setState({token: token.token})
                                                        search(this.state)
                                                            .then(final_res => {
                                                                if (final_res.message === "done") {
                                                                    this.setState({result: final_res.result})
                                                                }
                                                                if (final_res.message === "error") {
                                                                    alert("Error")
                                                                } else if (final_res.message.includes("token")) {
                                                                    alert("Error")
                                                                }
                                                            })
                                                    })
                                                }
                                            }
                                        )
                                }}

                                        style={{flex: 1, marginTop: 8,}}>
                                    <Text uppercase={false}
                                          style={{fontSize: 12, color: "#fff"}}>{translate('Submit')}</Text>
                                </Button>
                            </Content>
                        </Card>
                    </Content>

                    <View style={{padding: 8}}>

                        {this.state.result.map(renderResult)}

                    </View>

                </ScrollView>
            </StyleProvider>
        );
    }
}
