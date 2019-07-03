import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {View, Text} from 'native-base';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const hw = 10;
const style = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: '#000000',
        opacity: 0.5,
        borderStyle: 'solid',
        borderLeftWidth: 50,
        borderRightWidth: 50,
        borderBottomWidth: 100,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'red'
    }, rectangle: {
        width: 100 * 2,
        position: "absolute",
        padding: 8,
        backgroundColor: '#000',
        opacity: 1
    },
    text: {
        opacity: 1,
        color: "#fff",
        fontSize: 13
    }
});
export default class Popup extends React.Component {

    constructor() {
        super();
        this.state = {
            show: true
        }
    }


    render() {
        console.log("X" + this.props.popX);
        console.log(this.props.message);
        return (
            <View onPress={() => {
                this.setState({show: false})
            }} style={{
                zIndex: 1,
                position: "absolute",
                width: 150,
                left: this.props.popX - hw,
                margin: 8,
                opacity: 1,
                top: this.props.popY + this.props.popH
            }}>
                {this.state.show ? <View onPress={() => {
                        this.setState({show: false})
                    }} style={{
                        backgroundColor: "#000",
                        padding: 8
                    }}>

                        <Text onPress={() => {
                            this.setState({show: false})
                        }} style={style.text}>{this.props.message}</Text>


                        {/*<Icon style={{position:"absolute", right:0,margin :2}} name="close" size={15} color="#fff"/>*/}


                        <View style={{
                            width: 0,
                            height: 0,
                            borderStyle: 'solid',
                            borderLeftWidth: hw / 2,
                            borderRightWidth: hw / 2,
                            borderBottomWidth: hw,
                            left: hw + 4 - 8,
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                            borderBottomColor: 'black',
                            position: "absolute",
                            top: -hw
                        }}/>
                    </View>
                    : null}


            </View>
        );
    }
}