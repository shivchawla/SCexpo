import React, {Component} from 'react';
import {Platform, View, ScrollView, Text, StatusBar, SafeAreaView, StyleSheet} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {sliderWidth, itemWidth} from '../styles/WelcomeScreen.style';
import styles, {colors} from '../styles/Index.style';
import {ENTRIES1} from '../static/entries';
import WelcomeScreen from "./WelcomeScreen";
import {Fab, Button, Icon, Content} from 'native-base';


const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;


export default class example extends Component {


    constructor(props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }

    _renderItem({item, index}) {
        return <WelcomeScreen data={item} even={(index + 1) % 2 === 0}/>;
    }

    _renderItemWithParallax({item, index}, parallaxProps) {
        return (
            <WelcomeScreen
                data={item}
                even={(index + 1) % 2 === 0}
                parallax={true}
                parallaxProps={parallaxProps}
            />
        );
    }

    mainExample(number, title) {
        const {slider1ActiveSlide} = this.state;


        return (

            <View style={styles.exampleContainer}>

                <Text style={styles.title}>{}</Text>
                <Text style={styles.subtitle}>{title}</Text>

                <Carousel
                    ref={c => this._slider1Ref = c}
                    data={ENTRIES1}
                    renderItem={this._renderItemWithParallax}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    hasParallaxImages={true}
                    firstItem={SLIDER_1_FIRST_ITEM}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.7}
                    // inactiveSlideShift={20}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    loop={true}
                    loopClonesPerSide={2}
                    autoplay={true}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    onSnapToItem={(index) => this.setState({slider1ActiveSlide: index})}
                />
                <Pagination
                    dotsLength={ENTRIES1.length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={'#767676'}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={colors.black}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                />

            </View>

        );

    }

    render() {
        const example1 = this.mainExample(1, 'Find your property precisely');
        return (
            <View>

                {example1}

                <Button rounded block style={style2.button} onPress={() => {
                    this.props.navigation.push('Register')
                }}>
                    <Text style={{color: "#000", fontWeight: "bold"}}>Sign Up</Text>
                </Button>

                <Text style={style2.underline}>our terms and condition</Text>

            </View>
        );
    }

}
let style2 = StyleSheet.create({
    button: {
        textAlign: 'center',
        padding: 8,
        alignSelf: 'flex-end',
        marginTop: 20,
        marginRight: 30,
        marginLeft: 30,
        fontWeight: 'bold'
    },
    underline: {textDecorationLine: 'underline', textAlign: "center", marginTop: 20}
});
