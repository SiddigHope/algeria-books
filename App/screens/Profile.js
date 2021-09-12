import React, { Component } from 'react'
import { StatusBar, ScrollView, Image, View, StyleSheet, BackHandler, Text, Dimensions, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Container, Body, Header, Left, Right, Drawer, Tab, Tabs } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob'
// import jwt_decode from "jwt-decode";

const { width, height } = Dimensions.get('window');

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            userRank: '',
        }
    }

    componentDidMount() {
        this.getUser()
    }

    getUser = async () => {
        const user = await AsyncStorage.getItem('teacherInfo')
        if (user != null) {
            this.setState({
                user: JSON.parse(user)
            })
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Header style={{ backgroundColor: '#075D54' }} androidStatusBarColor="#075D54">
                    <Right>
                        <Text style={[styles.title,{flex:1}]}>{"بيانات الأستاذ"}</Text>
                    </Right>
                </Header>
                
                <View style={styles.avatarContainer}>
                    <Image source={require('./../Assets/teacherAvatar.png')} style={styles.avatar} />
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.rowData}>
                        <Text style={styles.textTitle}> {'الإسم واللقب'} </Text>
                        <Text style={styles.content}>{this.state.user.NomArF + '' + this.state.user.PrenomArF}</Text>
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.rowData}>
                        <Text style={styles.textTitle}> {'الرتبة'} </Text>
                        <Text style={styles.content}> {this.state.user.LibArGrade} </Text>
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.rowData}>
                        <Text style={styles.textTitle}> {'مادة التدريس'} </Text>
                        <Text style={styles.content}> {this.state.user.libmatierear} </Text>
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.rowData}>
                        <Text style={styles.textTitle}> {'التاريخ'} </Text>
                        <Text style={styles.content}> {this.state.user.dateNa} </Text>
                    </View>
                    <View style={styles.rowData}>
                        <Text style={styles.textTitle}> {'النقطة الإدارية'} </Text>
                        <Text style={styles.content}> {this.state.user.notea} </Text>
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.rowData}>
                        <Text style={styles.textTitle}> {'التاريخ'} </Text>
                        <Text style={styles.content}> {this.state.user.dnoteP} </Text>
                    </View>
                    <View style={styles.rowData}>
                        <Text style={styles.textTitle}> {'النقطة التربوية'} </Text>
                        <Text style={styles.content}> {this.state.user.notep} </Text>
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.rowData}>
                        <Text style={styles.textTitle}> {'التاريخ'} </Text>
                        <Text style={styles.content}> {this.state.user.datech} </Text>
                    </View>
                    <View style={styles.rowData}>
                        <Text style={styles.textTitle}> {'الدرجة'} </Text>
                        <Text style={styles.content}> {this.state.user.echlon} </Text>
                    </View>
                </View>

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    title: {
        fontSize: 20,
        fontFamily: 'Tajawal-Regular',
        alignSelf: "center",
        color: '#FFF',
        marginRight: 15,
    },
    rowContainer: {
        height: 70,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: "center",
        marginVertical: 5,
        elevation: 3
    },
    rowData: {
        flex: 1,
        height: '100%',
        // backgroundColor: '#e3e3e3',
        marginHorizontal: 3,
        // borderRadius: 20
    },
    textTitle: {
        fontFamily: 'Tajawal-Regular',
        fontSize: 16,
        color: '#444'
    },
    content: {
        fontFamily: 'Tajawal-Bold',
        fontSize: 16,
        color: '#444',
        textAlign: 'right'
    },
    avatarContainer: {
        // height: 170,
        // width: 130,
        alignSelf: "center",
        marginTop: 10 ,
        backgroundColor: '#FFF',
        // elevation: 10,
        borderRadius: 75,
        alignItems: "center",
        justifyContent: "center",
    },
    avatar: {
        height: 170,
        width: 130,
        // alignSelf: "center",
        // marginTop: 10,
        backgroundColor: '#FFF',
        borderRadius: 65,
    },
})
