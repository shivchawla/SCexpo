import React from "react";
import {AsyncStorage, ScrollView, StatusBar, Image} from "react-native";
import {
    Button,
    Text,
    Container,
    Card,
    CardItem,
    Body,
    ListItem,
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

const dataArray = [
    {title: "Search Options", content: "Lorem ipsum dolor sit amet"},
];

function searchAgent(data, name) {
    return fetch(" http://www.semsar.city/api/agents/search/" + name, {
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

export default class SearchBrokersScreen extends React.Component {


    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                this.setState({email: await AsyncStorage.getItem('email')});
                this.setState({token: await AsyncStorage.getItem('token')});
                this.setState({d: await AsyncStorage.getItem('id')});
            } else {
                alert(value)
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
            id: "",
            token: "",
            location: "",
            max_price: "",
            min_price: "",
            area: "",
            submitted: "",
            result: [],
            agent_name: ""
        };
    }


    render() {

        let renderResult = (item) => {
            return (<Property navigation={this.props.navigation} data={{
                title: item.name,
                illustration: "https://www.semsar.city/manage/img/properties/" + item.featured_image,
                avatar: "https://tripppy.herokuapp.com/imgs/favicon.png",
                name: "Semsar City",
                date: "26 APR",
                location: item.phone

            }}/>)
        }


        let renderContent = (item) => {
            return (
                <Form>
                    <Picker
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
                                   keyboardType='numeric' placeholder={"area"} onChangeText={(text) => {
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
                            }} placeholder={"sub location"}/>
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
                            }} placeholder={"min. price"}/>
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
                            }} placeholder={"max. price"}/>
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
                            }} placeholder={"bedrooms"}/>
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
                            }} placeholder={"bathrooms"}/>
                        </View>
                    </View>


                </Form>
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
                        <Title style={{color: "#000"}}>Search Brokers</Title>
                        </Body>
                    </Header>
                    <Content padder>
                        <Card noShadow style={{padding: 8, borderRadius: 8}}>

                            <Input style={{backgroundColor: "#eaeaea", borderRadius: 8}} onChangeText={(text) => {
                                this.setState({agent_name: text})
                            }} placeholder={"Agent Name"}/>

                            <Content padder>
                                <Accordion style={{border: 0}}
                                           headerStyle={{borderRadius: 8, fontSize: 12, backgroundColor: "#eaeaea"}}
                                           expandedIcon={""} dataArray={dataArray}
                                           renderContent={renderContent} expanded={false}/>

                                <Button primary full rounded noShadow
                                        onPress={() => {
                                            let data = {
                                                token: this.state.token
                                            }
                                            searchAgent(data, this.state.agent_name).then(res => {
                                                if (res.api_response.success) {

                                                    this.setState({result: [...this.state.result, res.api_response.agent]})
                                                } else {
                                                    alert(res.api_response.error)
                                                }
                                            });
                                        }}
                                        style={{flex: 1, marginTop: 8,}}>
                                    <Text uppercase={false}
                                          style={{fontSize: 12, color: "#fff"}}>Submit</Text>
                                </Button>
                            </Content>
                        </Card>
                    </Content>

                    <View style={{padding: 8}}>

                        {this.state.result.map((item, index) => {
                            return (
                                <ListItem
                                    button
                                    onPress={() => this.props.navigation.navigate('Profile')}>
                                    <Image source={{uri: "https://tripppy.herokuapp.com/imgs/favicon.png"}}
                                           style={{marginRight: 18, width: 24, height: 24, borderRadius: 12}}/>
                                    <Text>{item.name}</Text>
                                </ListItem>)
                        })}

                    </View>

                </ScrollView>
            </StyleProvider>
        );
    }
}
