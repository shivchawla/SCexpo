import React from "react";
import {
    Modal,
    ScrollView,
    StatusBar,
    TouchableHighlight,
    Alert,
    AsyncStorage,
    ActivityIndicator,
    Dimensions,
    TextInput,
    AppState,
    Image,
    Platform
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
import {SQLite} from 'expo-sqlite';
import ScaledImage from "../Things/ScaledImage";
import {getCurrentLocale} from "../../Utils/i18n";
import translate from "../../Utils/i18n";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

let email, password = "";
const db = SQLite.openDatabase("SemsarCity.db");
const dataArray = [
    {title: "Search Options", content: "Lorem ipsum dolor sit amet"},
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

function getHome(data) {
    return fetch(`http://www.semsar.city/api/properties/home-properties`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }

    }).then((apiResponse) => {
        return apiResponse.json();
        // this.setState({result: apiResponse.result});s
    }).then((responseJson) => {

        if (responseJson.properties != null) {
            return {
                message: "done",
                properties: responseJson.properties
            }
        }

        return {
            type: "REGISTER_USER",
            message: "Error"
        }
    }).catch(function (error) {
        return {
            type: "REGISTER_USER",
            message: error.message
        }
    })
};


export default class HomeScreen extends React.Component {


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


    insertObjectSQLite(tx, object) {
        console.log("adding ...")
        let area = object.area;
        if (object.area === null) {
            area = 0;
        }
        let kits = object.kitchens;
        if (object.kitchens === null) {
            kits = 0;
        }
        let baths = object.bathrooms;
        if (object.bathrooms === null) {
            baths = 0;
        }
        let beds = object.bedrooms;
        if (object.bedrooms === null) {
            beds = 0;
        }
        let lat = object.lat;
        if (object.lat === null) {
            lat = 0;
        }
        let long = object.long;
        if (object.long === null) {
            long = 0;
        }
        let submitted = object.submitted;
        if (object.submitted === null) {
            submitted = 0;
        }
        let price = object.price;
        if (object.price === null) {
            price = 0;
        }
        let old_price = object.old_price;
        if (object.old_price === null) {
            old_price = 0;
        }
        let view_count = object.view_count;
        if (object.view_count === null) {
            view_count = 0;
        }
        console.log("adding ...")

        db.transaction(tx => {
            tx.executeSql('insert into home_props (id, title, user_id, location, sub_location , description ,' +
                ' featured_image , gallery, veiw_count , old_price , price , price_unit,  price_type , area , area_unit , type , status ' +
                ', bedrooms , bathrooms , kitchens , garage , pool , amenites , lat , long , submitted , negotiable , created_at ' +
                ', downloaded_image ,' +
                ' updated_at ) ' +
                'values ' +
                '( "' + object.id + '", "' +
                object.title + '","' +
                object.user_id + '", "' +
                object.location + '" , "' +
                object.sub_location + '" , "' +
                object.description + '" , "' +
                object.featured_image + '" , "' +
                object.gallery + '" ,"' +
                view_count + '","' +
                old_price + '","'
                + price + '","' + object.price_unit + '","' +
                object.price_type + '","' + area + '","' +
                object.area_unit + '","' +
                object.type + '","' + object.status + '","' +
                beds + '","' + baths + '","' +
                kits + '","' + object.garage + '","' +
                object.pool + '","' + object.amenties + '","' +

                object.lat + '","' + object.long + '","' +
                submitted + '","' +
                object.negotiable + '","'
                + object.created_at + '","'
                + "not" + '","' +
                object.updated_at + '" );',
                [],
                (_, {rows}) => {
                }, (error) => {
                });
        })
    }

    componentWillMount() {
        console.log(getCurrentLocale());
        // AppState.addEventListener('change', this._handleAppStateChange);
    }

    insertIntoDatabase(tx, i) {
        if (i < this.state.result.length) {
            let area = this.state.result[i].area;
            if (this.state.result[i].area === null) {
                area = 0;
            }
            let kits = this.state.result[i].kitchens;
            if (this.state.result[i].kitchens === null) {
                kits = 0;
            }
            let baths = this.state.result[i].bathrooms;
            if (this.state.result[i].bathrooms === null) {
                baths = 0;
            }
            let beds = this.state.result[i].bedrooms;
            if (this.state.result[i].bedrooms === null) {
                beds = 0;
            }
            let lat = this.state.result[i].lat;
            if (this.state.result[i].lat === null) {
                lat = 0;
            }
            let long = this.state.result[i].long;
            if (this.state.result[i].long === null) {
                long = 0;
            }
            let submitted = this.state.result[i].submitted;
            if (this.state.result[i].submitted === null) {
                submitted = 0;
            }
            let price = this.state.result[i].price;
            if (this.state.result[i].price === null) {
                price = 0;
            }
            let old_price = this.state.result[i].old_price;
            if (this.state.result[i].old_price === null) {
                old_price = 0;
            }
            let view_count = this.state.result[i].view_count;
            if (this.state.result[i].view_count === null) {
                view_count = 0;
            }
            console.log("adding ...")

            db.transaction(tx => {
                tx.executeSql('INSERT INTO  home_props ("id", "title","user_id","location","sub_location","description",' +
                    '"featured_image","gallery","veiw_count","old_price","price","price_unit","price_type","area","area_unit","type","status"' +
                    ',"bedrooms","bathrooms","kitchens","garage","pool","amenites","lat","long","submitted","negotiable","created_at"' +
                    ',"downloaded_image",' +
                    '"updated_at") ' +
                    'VALUES ' +
                    '( "' + this.state.result[i].id + '", "' +
                    this.state.result[i].title + '","' +
                    this.state.result[i].user_id + '", "' +
                    this.state.result[i].location + '" , "' +
                    this.state.result[i].sub_location + '" , "' +
                    this.state.result[i].description + '" , "' +
                    this.state.result[i].featured_image + '" , "' +
                    this.state.result[i].gallery + '" ,"' +
                    view_count + '","' +
                    old_price + '","'
                    + price + '","' + this.state.result[i].price_unit + '","' +
                    this.state.result[i].price_type + '","' + area + '","' +
                    this.state.result[i].area_unit + '","' +
                    this.state.result[i].type + '","' + this.state.result[i].status + '","' +
                    beds + '","' + baths + '","' +
                    kits + '","' + this.state.result[i].garage + '","' +
                    this.state.result[i].pool + '","' + this.state.result[i].amenties + '","' +

                    this.state.result[i].lat + '","' + this.state.result[i].long + '","' +
                    submitted + '","' +
                    this.state.result[i].negotiable + '","'
                    + this.state.result[i].created_at + '","'
                    + "not" + '","' +
                    this.state.result[i].updated_at + '" );', [], (tx, results) => {

                    console.log(results, "added");
                    if (i + 1 === this.state.result.length) {
                        this.closeDatabase(db);
                    } else {
                        db.transaction(txx => {
                            this.insertIntoDatabase(txx, i + 1)
                        });
                    }
                })
            })


        } else {

        }
    }

    closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            db.close()
                .then(status => {
                    console.log("Database CLOSED");
                })
                .catch(error => {
                    console.log(error.message)
                });
        } else {
            console.log("Database was not OPENED");
        }
    };

    updateDownloadedImage = (image_path, ui, tx) => {
        return new Promise(function (resolve, reject) {
            tx.executeSql('UPDATE "home_props" SET "downloaded_image="' + image_path + '" WHERE "updated_at"=' + ui + ';', [], (tx, results) => {
                // console.log("here");
                const rows = results.rows;
                let result = [];
                // console.log("n", results);
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    result.push(row)
                    // console.log(`Prod ID: ${row.id}, Prod Name: ${row.title}, ${row.price}`)
                }
                resolve({rows: results.rows.length, data: result})
            }).catch(onRejection => {
                console.log(onRejection.message);
                reject({rows: 0})
            });
        })
    };

    selectFromDatabase = (tx) => {
        return new Promise(function (resolve, reject) {
            console.log("selecting...");
            db.transaction(tx => {
                tx.executeSql('select * from home_props', [], (tx, results) => {
                    const rows = results.rows;
                    let result = [];
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        result.push(row)
                    }
                    resolve({rows: results.rows.length, data: result})
                })

            })
        })

    };

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
        }

        this.setState({appState: nextAppState});
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

    getUser = (data) => {
        return fetch(" http://www.semsar.city/api/users/me", {
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
                    api_response: apiResponse,
                    error: "free"

                }
            })
            .catch(function (error) {
                console.log(error.message)
                return {
                    success: false,
                    api_response: error.message,
                    error: error.message
                }
            })
    };

    getName = async (token) => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                let email = await AsyncStorage.getItem('email');
                let password = await AsyncStorage.getItem('password');

                this.getUser(token).then(res => {
                    if (res.success) {
                        this.setState({type: res.api_response.id});
                        console.log(res.api_response.id)
                    } else if (res.error.includes("token")) {
                        reauthenticate({email: email, password: password})
                            .then(res => {
                                    console.log(res.token);
                                    this.getUser(res.token).then(res => {
                                        if (res.success) {
                                            this.setState({type: res.api_response.id})
                                            console.log(res.api_response.id)
                                        } else if (res.error.includes("token")) {
                                        }
                                    });
                                }
                            )
                    }
                });
            } else {

            }

        } catch (error) {
            // Error retrieving data
        }
    };

    getData = async () => {
        this.setState({loading: true})

        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                console.log(value);
                this.setState({token: await AsyncStorage.getItem('token')});
                this.setState({logged: "logged"});
                email = await AsyncStorage.getItem('email');
                password = await AsyncStorage.getItem('password');
                this.getName(this.state.token);
            } else {
                this.setState({logged: null})
            }

        } catch (error) {
            // Error retrieving data
        }
    };

    constructor() {
        super();
        this.getData();
        this.state = {
            image: null,
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
            location: 0,
            max_price: 0,
            min_price: 0,
            area: 0,
            submitted: "",
            loading: true,
            name: null,
            logged: null,
            appState: AppState.currentState
        };
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists home_props (' +
                'id STRING,' +
                'code STRING, ' +
                'title STRING, ' +
                ' user_id STRING, ' +
                ' location STRING, ' +
                ' sub_location STRING, ' +
                ' description STRING, ' +
                ' featured_image STRING, ' +
                ' gallery STRING, ' +
                ' veiw_count INTEGER, ' +
                ' old_price INTEGER, ' +
                ' price INTEGER, ' +
                ' price_unit INTEGER, ' +
                ' price_type STRING, ' +
                ' area INTEGER, ' +
                ' area_unit STRING, ' +
                ' type STRING, ' +
                ' status STRING, ' +
                ' bedrooms INTEGER, ' +
                ' bathrooms INTEGER, ' +
                ' kitchens INTEGER, ' +
                ' garage STRING, ' +
                ' pool STRING, ' +
                ' amenites STRING, ' +
                ' lat STRING, ' +
                ' long STRING, ' +
                ' submitted INTEGER, ' +
                ' negotiable INTEGER, ' +
                ' created_at STRING, ' +
                ' updated_at STRING, ' +
                ' downloaded_image STRING, ' +
                ' featured_image_downloaded STRING ' +
                ')'
            );
            console.log("done")

            this.selectFromDatabase(tx).then(res => {
                if (res.rows > 0) {
                    console.log(res);
                    this.setState({result: res.data.reverse()})
                    this.setState({loading: false});
                    let updated_res = res.data;
                    getHome().then(res => {
                        if (res.message === "done") {
                            if (res.properties.length > this.state.result.length) {

                                for (let i = 0; i < res.properties.length; i++) {
                                    let index = updated_res.findIndex(x => x.created_at === res.properties[i].created_at);
                                    console.log(index);
                                    if (index < 0) {
                                        updated_res.push(res.properties[i]);
                                        db.transaction(tx => {
                                            console.log("here")
                                            this.insertObjectSQLite(db, tx, res.properties[i]);
                                            console.log("here2")

                                        });
                                    }
                                }
                                this.setState({result: updated_res.reverse()});
                            }
                        }
                    });
                } else {
                    getHome().then(res => {
                        if (res.message === "done") {
                            this.setState({loading: false});
                            this.setState({result: res.properties});
                            db.transaction(txx => {
                                this.insertIntoDatabase(txx, 0);
                            })
                        }
                    })
                }
            });
        });
    }

    render() {
        let initial_result = this.state.result;

        let filterResult = () => {
            let result = [];
            if (
                this.state.bedrooms
                || this.state.sub_location
                || this.state.location
                || this.state.type
                || this.state.area > 0
                || this.state.bedrooms > 0
                || this.state.bathrooms > 0
                || this.state.max_price > 0
                || this.state.min_price > 0
            ) {
                for (let i = 0; i < this.state.result.length; i++) {
                    if (parseInt(this.state.result[i].area) === parseInt(this.state.area)
                        // && this.state.result[i].location.toLowerCase().contains(this.state.location.toLowerCase())
                        || parseInt(this.state.result[i].price) <= parseInt(this.state.min_price)
                        && parseInt(this.state.result[i].price) >= parseInt(this.state.max_price)
                        || this.state.result[i].bedrooms === parseInt(this.state.bedrooms)
                        || this.state.result[i].bathrooms === parseInt(this.state.bathrooms)) {
                        result.push(this.state.result[i])
                    }
                    result.push(this.state.result[i])
                }
                this.setState({result: result});
            } else {
                this.setModalVisible(!this.state.modalVisible)
            }
        };
        let resetFilters = () => {
            this.setState({bedrooms: 0});
            this.setState({bathrooms: 0});
            this.setState({area: 0});
            this.setState({location: ""});
            this.setState({sub_location: ""});
            this.setState({min_price: 0});
            this.setState({max_price: 0})
            this.setState({result:initial_result})
        };

        let renderResult = (item, idx) => {
            console.log(item);
            return (<Property key={idx} navigation={this.props.navigation} data={item}/>)
        };

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

        let onChangeOps = (name, text) => {
            console.log(text);
            if (name === "area" || name === "max_price" || name === "min_price" || name === "bedrooms" || name === "bathrooms") {
                text = parseInt(text);
                this.setState({[name]: text});
            } else {
                this.setState({[name]: text});
            }
        };

        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header>
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.props.navigation.openDrawer()}
                            >
                                <Icon name="menu"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>{translate('AppName')}</Title>
                        </Body>
                        <Right>
                            {this.state.logged ?
                                <Button transparent onPress={() => this.props.navigation.navigate('AddProperty')}>
                                    <Icon name={"add"}/>
                                </Button>
                                : <Button transparent onPress={() => this.props.navigation.navigate('Register')}>
                                    <Icon name={"person"}/>
                                </Button>
                            }

                            <Button transparent onPress={() => this.props.navigation.navigate('Search')}>

                                <Icon name={"search"}/>
                            </Button>
                        </Right>
                    </Header>

                    <Content>

                        <ScrollView>
                            {this.state.result.map(renderResult)}
                        </ScrollView>

                    </Content>



                    <ModifyResultModal setModalVisible={this.setModalVisible.bind(this)}
                                       modalVisible={this.state.modalVisible}
                                       filterModal={this.state.filterModal}
                                       sortResult={sortResult}
                                       handleChangeOption2={this.handleChangeOption2.bind(this)}
                                       handleChangeOption={this.handleChangeOption.bind(this)}
                                       onChangeOps={onChangeOps}
                                       resetFilters={resetFilters.bind(this)}
                                       filterResult={filterResult}
                                       data={this.state}
                    />
                    {this.state.loading ? <Loading/> : null}

                </Container>
            </StyleProvider>
        );


    }
}

class ModifyResultModal extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedValue: "Apartment",

        }
    }

    render() {


        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                    this.props.setModalVisible(!this.props.modalVisible);
                }}>
                <View>
                    <Header noShadow style={{marginTop: -18}}>
                        <Left>

                            <Button transparent onPress={() => {
                                this.props.setModalVisible(!this.props.modalVisible);
                            }}><Icon style={{color: "#9c9c9c", fontSize: 22}} name={"close"}/>
                            </Button>
                        </Left>
                        <Body><Title>{this.props.filterModal ? translate('filter') : translate('sort')} {translate('result')}</Title></Body>
                    </Header>

                    <View padder>
                        {this.props.filterModal ?
                            <Content padder style={{minHeight: 500}}><View>
                                <Picker
                                    selectedValue={this.state.selectedValue}
                                    onValueChange={this.props.handleChangeOption.bind(this)}
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
                                    selectedValue={this.props.selectedValue}
                                    onValueChange={this.props.handleChangeOption2.bind(this)}
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
                                        <Input
                                            style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                                            keyboardType='numeric' value={this.props.data.area}
                                            placeholder={translate('area')}
                                            onChangeText={(text) => {
                                                this.props.onChangeOps("area", text);
                                            }}
                                        />
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
                                        <Input
                                            style={{backgroundColor: "#eaeaea", textAlign: "center", borderRadius: 8}}
                                            value={this.props.data.sub_location}
                                            keyboardType='text' onChangeText={(text) => {
                                            this.props.onChangeOps("sub_location", text)
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
                                        <Input
                                            style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                                            value={this.props.data.min_price}
                                            keyboardType='numeric' onChangeText={(text) => {
                                            this.props.onChangeOps("min_price", text)
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
                                        <Input
                                            style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                                            keyboardType='numeric' value={this.props.data.max_price}
                                            onChangeText={(text) => {
                                                this.props.onChangeOps("max_price", text)
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
                                        <Input
                                            style={{backgroundColor: "#eaeaea", borderRadius: 8, textAlign: "center"}}
                                            keyboardType='numeric' value={this.props.data.bedrooms}
                                            onChangeText={(text) => {
                                                this.props.onChangeOps("bedrooms", text)
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
                                        <Input value={this.props.data.bathrooms}
                                               style={{
                                                   backgroundColor: "#eaeaea",
                                                   borderRadius: 8,
                                                   textAlign: "center"
                                               }}
                                               keyboardType='numeric' onChangeText={(text) => {
                                            this.props.onChangeOps("bathrooms", text)
                                        }} placeholder={translate('bathrooms')}/>
                                    </View>
                                </View>

                                <View style={{display: "flex", flexDirection: "row", marginTop: 5}}>

                                    <Button light style={{marginRight: 5}} onPress={() => {
                                        this.props.setModalVisible(false, 0);
                                        this.props.resetFilters()
                                    }
                                    }>
                                        <Text style={{
                                            color: "#000",
                                            fontSize: 12,
                                            fontWeight: "700"
                                        }}>{translate('reset')}</Text>
                                    </Button>
                                    <Button primary onPress={() => {
                                        this.props.setModalVisible(false, 1);
                                        this.props.filterResult()
                                    }}>
                                        <Text style={{
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: "700"
                                        }}>{translate('Submit')}</Text>
                                    </Button>
                                </View>

                            </View>
                            </Content>
                            : <View>
                                <Button primary full onPress={() => {
                                    this.props.sortResult(0);
                                    this.props.setModalVisible(false, 0)
                                }} style={{marginBottom: 10}}>
                                    <Icon name={"arrow-up"}/>
                                    <Text>Lowest to highest price</Text>
                                </Button>
                                <Button primary full style={{textAlign: "start"}} onPress={() => {
                                    this.props.sortResult(1);
                                    this.props.setModalVisible(false, 0)
                                }}>
                                    <Icon name={"arrow-down"}/>
                                    <Text uppercase={false} style={{color: "#fff"}}>Highest to lowest
                                        price</Text>
                                </Button>
                            </View>}
                    </View>
                </View>
            </Modal>
        )
    }
}

// {
//     <View
//         style={{
//             height: 36,
//             marginBottom: 50,
//             justifyContent: "center",
//             position: 'absolute',
//             flex: 1,
//             flexDirection: "row",
//             bottom: 0,
//             alignSelf: 'center',
//             alignItems: 'center',
//             backgroundColor: 'transparent',
//             minWidth: 72,
//             display:"none"
//
//         }}>
//         <Button style={{
//             backgroundColor: "#69f0ae",
//             borderBottomStartRadius: 18,
//             height: 36,
//             borderTopStartRadius: 18,
//             borderBottomEndRadius: 0,
//             borderTopEndRadius: 0,
//         }} transparent onPress={() => {
//             this.setModalVisible(true, 0);
//         }}>
//
//             <Text style={{fontSize: 8, color: "#000", fontWeight: "700"}}>{translate('filter')}</Text>
//         </Button>
//         <View style={{width: 1, backgroundColor: "#000"}}/>
//         <Button style={{
//             backgroundColor: "#69f0ae",
//             borderBottomEndRadius: 18,
//             height: 36,
//             borderBottomStartRadius: 0,
//             borderTopStartRadius: 0,
//             borderTopEndRadius: 18
//         }} onPress={() => {
//             this.setModalVisible(true, 1);
//         }} transparent>
//             <Text style={{fontSize: 8, color: "#000", fontWeight: "700"}}>{translate('sort')}</Text>
//         </Button>
//
//     </View>
//
// }