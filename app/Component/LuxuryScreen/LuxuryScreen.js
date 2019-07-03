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
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/variables';
import {StyleProvider} from "native-base";
import Property from "../Things/Property";
import reauthenticate from "../../Utils/Reauthenticate";
import translate from "../../Utils/i18n";

let email, password = "";
const dataArray = [
    {title: "Search Options", content: "Lorem ipsum dolor sit amet"},
];

function getHome(data) {
    return fetch(` http://www.semsar.city/api/properties/luxary-properties?token=${encodeURIComponent(data.token)}`, {
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

        if (responseJson.luxaryProperties != null) {
            return {
                message: "done",
                properties: responseJson.luxaryProperties
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

export default class LuxuryScreen extends React.Component {

    handleChangeOption = (val) => {
        if (val !== 0) {
            alert(val);
            this.setState({type: val});
        }
    };

    handleChangeOption2 = (val) => {
        if (val !== 0) {
            alert(val);
            this.setState({status: val});
        }
    };


    setModalVisible(visible, type) {
        if (type === 0) {
            this.setState({filterModal: true})
            this.setState({sortModal: false})
        } else {
            this.setState({filterModal: false})
            this.setState({sortModal: true})
        }
        this.setState({modalVisible: visible});
    }

    getData = async () => {
        this.setState({loading: true})
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                this.setState({token: await AsyncStorage.getItem('token')});
                email = await AsyncStorage.getItem('email');
                password = await AsyncStorage.getItem('password');
                getHome({token: this.state.token}).then(res => {
                    if (res.message === "done") {
                        this.setState({loading: false})
                        this.setState({result: res.properties})
                    } else if (res.message.includes("token")) {
                        this.setState({reauth: true})
                        this.setState({loading: false})

                        reauthenticate({email: email, password: password}).then(res => {
                                getHome({token: res.token}).then(res => {
                                    this.setState({reauth: false})

                                    if (res.message === "done") {
                                        this.setState({result: res.properties})
                                    } else if (res.message.includes("token")) {
                                        alert("error")
                                    } else {
                                        alert("Error")
                                    }
                                })
                            }
                        )
                    }
                })
            } else {
                alert(value)
            }

        } catch (error) {
            alert(error.message)
            // Error retrieving data
        }
    };

    constructor() {
        super();
        this.getData();
        this.state = {
            modalVisible: false,
            token: "",
            result: [],
            email: "",
            password: "",
            reauth: false
            , toLow: false,
            toHigh: false,
            sortModal: false,
            filterModal: false,
            type: null,
            status: null,
            bedrooms: 0,
            bathrooms: 0,
            sub_location: 0,
            id: "",
            location: "0",
            max_price: "0",
            min_price: "0",
            area: 220,
            submitted: "",
            loading: true

        };
    }


    render() {


        let sortResult = (to) => {
            if (to === 0) {
                for (let i = 0; i < this.state.result.length; i++) {
                    for (let j = i; j < this.state.result.length; j++) {
                        if (parseInt(this.state.result[i].price) > parseInt(this.state.result[j].price)) {
                            let temp = this.state.result[i];
                            this.state.result[i] = this.state.result[j];
                            this.state.result[j] = temp;
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.state.result.length; i++) {
                    for (let j = i; j < this.state.result.length; j++) {
                        if (parseInt(this.state.result[i].price) < parseInt(this.state.result[j].price)) {
                            let temp = this.state.result[i];
                            this.state.result[i] = this.state.result[j];
                            this.state.result[j] = temp;
                        }
                    }
                }
            }
        };

        let resetFilters = () => {
            this.getData();
            this.setState({bedrooms: 0})
            this.setState({bathrooms: 0})
            this.setState({area: ""})
            this.setState({location: ""})
            this.setState({sub_location: ""})
            this.setState({min_price: ""})
            this.setState({max_price: ""})
            this.setState({min_price: ""})
        }
        let filterResult = () => {
            for (let i = 0; i < this.state.result.length; i++) {
                if (parseInt(this.state.result[i].area) === parseInt(this.state.area)
                    // && this.state.result[i].location.toLowerCase().contains(this.state.location.toLowerCase())
                    || parseInt(this.state.result[i].price) <= parseInt(this.state.min_price)
                    && parseInt(this.state.result[i].price) >= parseInt(this.state.max_price)
                    || this.state.result[i].bedrooms === parseInt(this.state.bedrooms)
                    || this.state.result[i].bathrooms === parseInt(this.state.bathrooms)) {
                    result.push(this.state.result[i])
                }
            }
            alert(result.length);
            this.setState({result: result});

        };

        let FilterOptions = () => {
            return (<Content padder style={{minHeight: 500}}><View>
                <Picker
                    selectedValue={this.state.selectedValue}
                    onValueChange={this.handleChangeOption.bind(this)}
                    prompt={'Property type'}
                >

                    <Picker.Item label='Choose the property type' value='null'/>
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
                    prompt={'Sale/Rent'}
                >
                    <Picker.Item label='For Sale' value='sale'/>
                    <Picker.Item label='Rent' value='rent'/>

                </Picker>
                <View style={{
                    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    background: '#eaeaea',
                    marginTop: 8
                }}>

                    <View style={{flex: 1}}>
                        <Input style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                               keyboardType='numeric' value={this.state.area} placeholder={"Area"}
                               onChangeText={(text) => {
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
                               value={this.state.sub_location}
                               keyboardType='text' onChangeText={(text) => {
                            this.setState({sub_location: text})
                        }} placeholder={"Sub location"}/>
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
                               value={this.state.min_price}
                               keyboardType='numeric' onChangeText={(text) => {
                            this.setState({min_price: text})
                        }} placeholder={"Min price"}/>
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
                               keyboardType='numeric' value={this.state.max_price} onChangeText={(text) => {
                            this.setState({max_price: text})
                        }} placeholder={"Max price"}/>
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
                               keyboardType='numeric' value={this.state.bedrooms} onChangeText={(text) => {
                            this.setState({bedrooms: text})
                        }} placeholder={"Bedrooms"}/>
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
                        <Input value={this.state.bathrooms}
                               style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                               keyboardType='numeric' onChangeText={(text) => {
                            this.setState({bathrooms: text})
                        }} placeholder={"Bathrooms"}/>
                    </View>
                </View>

                <View style={{display: "flex", flexDirection: "row", marginTop: 5}}>

                    <Button light style={{marginRight: 5}} onPress={() => {
                        this.setModalVisible(false, 0);
                        resetFilters()
                    }
                    }>
                        <Text style={{color: "#000", fontSize: 12, fontWeight: "700"}}>Reset</Text>
                    </Button>
                    <Button primary onPress={() => {
                        this.setModalVisible(false, 1);
                        filterResult()
                    }
                    }>
                        <Text style={{color: "#fff", fontSize: 12, fontWeight: "700"}}>Submit</Text>
                    </Button>
                </View>

            </View>
            </Content>)

        }

        let renderResult = (item) => {
            return (<Property navigation={this.props.navigation} data={item}/>)
        }


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
                        <Title>{translate('luxuryListing')}</Title>
                        </Body>

                    </Header>

                    <Content>
                        <ScrollView>
                            {this.state.result.map(renderResult)}

                        </ScrollView>

                    </Content>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}>
                        <View>
                            <Header noShadow style={{marginTop: -18}}>
                                <Left>
                                    <Button transparent onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}><Icon style={{color: "#9c9c9c", fontSize: 22}} name={"close"}/>
                                    </Button>
                                </Left>
                                <Body><Title>{this.state.filterModal ? "Filter" : "Sort"} result</Title></Body>
                            </Header>
                            <View padder>
                                {this.state.filterModal ?
                                    <FilterOptions/>
                                    : <View>
                                        <Button primary full onPress={() => {
                                            sortResult(0);
                                            this.setModalVisible(false, 0)
                                        }} style={{marginBottom: 10}}>
                                            <Icon name={"arrow-up"}/>
                                            <Text>Lowest to highest price</Text>
                                        </Button>
                                        <Button primary full style={{textAlign: "start"}} onPress={() => {
                                            sortResult(1);
                                            this.setModalVisible(false, 0)
                                        }}>
                                            <Icon name={"arrow-down"}/>
                                            <Text uppercase={false} style={{color: "#fff"}}>Highest to lowest
                                                price</Text>
                                        </Button>
                                    </View>}
                            </View>


                        </View>
                    </Modal>
                </Container>
            </StyleProvider>
        );


    }

}
