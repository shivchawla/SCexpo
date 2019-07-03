import React from "react";
import {
    Content,
    Text,
    Icon,
    Card,
    Row
} from "native-base";
import {View, Image, TouchableOpacity, StyleSheet, Platform, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {ParallaxImage} from 'react-native-snap-carousel';
import styles from '../../styles/WelcomeScreen.style';

const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.5;
const slideWidth = wp(95);
const itemHorizontalMargin = wp(2);
export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;

export default class Property extends React.Component {

    componentDidMount() {
        console.log(this.props.user_type + "user type ")
        if (this.props.data.user_type) {
            // get user data
            this.setState({name: "Broker name"})
            this.setState({avatar: "Broker name"})
        }
    }

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image() {
        let {data: {featured_image}, parallax, parallaxProps, even} = this.props;

        if (featured_image) {
            featured_image = "https://www.semsar.city/manage/img/properties/" + featured_image
        } else {
            featured_image = "https://bigriverequipment.com/wp-content/uploads/2017/10/no-photo-available.png"
        }

        return parallax ? (
            <ParallaxImage
                source={{uri: featured_image}}
                containerStyle={{
                    flex: 1,
                    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
                    backgroundColor: 'white'
                }}
                style={{
                    ...StyleSheet.absoluteFillObject,
                    resizeMode: 'cover'
                }}
                parallaxFactor={0.35}
                showSpinner={true}
                spinnerColor={"#000"}
                {...parallaxProps}
            />
        ) : (
            <Image
                source={{uri: featured_image}}
                style={{
                    ...StyleSheet.absoluteFillObject,
                    resizeMode: 'cover'
                }}
            />
        );
    }

    constructor() {
        super()
        this.state = {
            avatar: "https://tripppy.herokuapp.com/imgs/favicon.png",
            name: "Semsar City"
        }
    }

    render() {
        const {data: {title, price_unit, description, price, type, location, created_at, user_id, user_type}, even} = this.props;

        const uppercaseTitle = title ? (
            <Text
                style={[styles.title, even ? styles.titleEven : {}, styles.textLeft]}
                numberOfLines={2}>
                {title.toUpperCase()}
            </Text>
        ) : false;
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('PropertyScreen', {data: this.props.data})
            }}>
                <Content style={{paddingTop: 8, paddingRight: 8, paddingLeft: 8}}>

                    <Card style={{
                        height: slideHeight,
                        borderRadius: 8,
                    }}
                    >

                        <View style={{padding: 8,}}>
                            <Row style={{height: 60, alignItems: 'center'}}>
                                <Image
                                    source={{uri: this.state.avatar}}
                                    style={{
                                        height: 60, width: 60, borderRadius: 30, marginRight: 8
                                    }}
                                />
                                <View>
                                    <Text style={{
                                        fontWeight: "700",
                                        fontSize: 15,
                                        color: "#006fbc"
                                    }}>{this.state.name}</Text>
                                    <Text uppercase={true} style={{fontSize: 11}}>{created_at}</Text>
                                </View>
                            </Row>
                        </View>

                        <View style={styles.shadow}/>
                        <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                            {this.image}
                            <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]}/>
                        </View>
                        <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                            {uppercaseTitle}
                            <Text
                                style={[styles.subtitle, even ? styles.subtitleEven : {}, styles.textLeft]}
                                numberOfLines={2}>

                                {description}
                            </Text>

                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 24
                            }}>
                                <View>
                                    <Row style={{alignItems: 'center'}}>
                                        <Icon name={'home'} style={{color: "#69f0ae", marginRight: 3}}/>
                                        <Text style={{color: "#8c8c8c", fontSize: 15}}>{type}</Text>
                                    </Row>
                                </View>
                                <View>
                                    <Row style={{alignItems: 'center'}}>
                                        <Icon name={'pin'} style={{color: "#69f0ae", marginRight: 3}}/>
                                        <Text style={{color: "#8c8c8c", fontSize: 15}}>{location}</Text>
                                    </Row>
                                </View>

                                <View>
                                    <Row style={{alignItems: 'center'}}>

                                        <Icon name={'cash'} style={{color: "#69f0ae", height: 24, width: 24}}/>
                                        <Text style={{color: "#8c8c8c", fontSize: 15}}>{price + " " + price_unit}</Text>
                                    </Row>
                                </View>
                            </View>

                        </View>
                    </Card>
                </Content>
            </TouchableOpacity>

        )
    }
}