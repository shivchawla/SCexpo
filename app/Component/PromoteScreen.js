import React from "react";
import {AppRegistry, Alert, Image, Dimensions} from "react-native";

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

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

import {StackNavigator} from "react-navigation";

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';

export default class PromoteScreen extends React.Component {
    componentDidMount() {
        if (this.props.navigation.state.params !== undefined) {
            Alert.alert("USER found", this.props.navigation.state.params.name);
        }
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{backgroundColor: "#bbffe5"}}>
                    <Header style={{marginTop: -18}}>
                        <Left>
                            <Button
                                transparent
                                onPress={() => {
                                    this.props.navigation.goBack();
                                    this.props.navigation.navigate("Home")
                                }}
                            >
                                <Icon name="close"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title uppercase style={{
                            fontWeight: "700",
                            fontSize: 15,
                            color: "#000",
                        }}>PROMOTE YOUR AD</Title>
                        </Body>
                    </Header>
                </Container>
            </StyleProvider>
        );
    }
}
