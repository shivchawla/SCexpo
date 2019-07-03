import React from "react";
import {AppRegistry, Alert, Image, Dimensions, ScrollView} from "react-native";

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
import {StackNavigator} from "react-navigation";

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/variables';
import Profile from "./ProfileScreen/Profile";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');


export default class MembershipScreen extends React.Component {
    componentDidMount() {
        this.setState({show: true})
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>

                    <Header style={{marginTop: -18}}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-back"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>Membership details</Title>
                        </Body>

                    </Header>

                    <Content padder>
                        <ScrollView>
                            <View>
                                <ListItem button selected style={{backgroundColor: "#ebffff"}}>
                                    <Text>Free(current)</Text>
                                </ListItem>

                                <ListItem button>
                                    <Text>24 Months</Text>
                                </ListItem>

                                <ListItem button>
                                    <Text>12 Months</Text>
                                </ListItem>

                                <ListItem button>
                                    <Text>6 Months</Text>
                                </ListItem>
                            </View>
                        </ScrollView>
                    </Content>

                </Container>
            </StyleProvider>

        );
    }
}