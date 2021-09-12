import React, { PureComponent, Component } from 'react';
import {
    Dimensions,
    FlatList,
    View,
    Text,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from "jwt-decode";

const Screen = Dimensions.get('window');
const { width, height } = Dimensions.get('window');

export default class Feeds extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            source: '',
            dataSource: ['الدرس الاول', 'الدرس الثاني', 'الدرس الثالث', 'الدرس الرابع', 'الدرس الخامس', 'الدرس السادس'],
            data: '',
            isLoading: false,
            feed: 'قل هل ننبئكم بالأخسرين أعمالا(103) الذين ضل سعيهم في الحياة الدنيا وهم يحسبون أنهم يحسنون صنعا(104) أولئك الذين كفروا بآيات ربهم ولقائه فحبطت أعمالهم فلا نقيم لهم يوم القيامة وزنا(105) ذلك جزاؤهم جهنم بما كفروا واتخذوا آياتي ورسلي هزوا(106) إن الذين آمنوا وعملوا الصالحات كانت لهم جنات الفردوس نزلآ(107) خالدين فيها لا يبغون عنها حولا(108) قل لو كان البحر مدادآ لكلمات ربي لنفد البحر قبل أن تنفد كلمات ربي ولو جئنا بمثله مددا(109) قل إنما أنا بشر مثلكم يوحى إلي أنما إلهكم إله واحد فمن كان يرجو لقاء ربه فليعمل عملآ صالحآ ولا يشرك بعبادة ربه أحدآ(110)'
        }
    }

    componentDidMount() {
        this.getFeeds()
    }

    getFeeds = async() => {
        try {
            const userId = await AsyncStorage.getItem('teacherId')
            RNFetchBlob.fetch('POST', 'http://educjijel18.com/server/getFeeds.php', {
                // Authorization: "Bearer access-token",
                // otherHeader: "foo",
                'Content-Type': 'multipart/form-data',
            }, [
                // // to send data
                // { name: 'imei', data: String(imeiList[0]) },
                { name: 'teacherId', data: String(userId) },
            ]).then((res) => {
                const data = JSON.parse(res.data)
                const token = data.data //"Don't touch this shit" 
                const jwt = jwt_decode(token)
                // console.log(jwt.data.data)
                this.setState({
                    data: JSON.parse(jwt.data.data),
                    setModalVisible: true,
                })
            }).catch((err) => {
                console.log('error response')
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    details= (item, image) => {
        this.props.navigation.navigate('Details',{navigation: this.props.navigation, item, image,})
    }

    render() {
        // console.log(this.state.data)
        let data = this.state.dataSource

        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                {this.state.data == '' ? (
                    <View style={{ height: height - 200, width, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator color='#32899F' size='large' />
                    </View>
                ) : (
                        <FlatList
                            data={this.state.data}
                            renderItem={(item, index) => this.renderRow(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    )}
            </View>
        );
    }

    renderRow(item, index) {
        const image = item.item.image != '' ? { uri: 'http://educjijel18.com/api_livre/public/images/'+item.item.image } : require('./../Assets/feed.png')
        return (
            <TouchableOpacity onPress={() => this.details(item,image)} style={styles.container}>
                <View style={styles.itemImage}>
                    <Image source={image} style={styles.feedImg} />
                </View>
                <View style={styles.itemText}>
                    <Text style={styles.title}>
                        {item.item.title}
                    </Text>
                    <Text style={styles.content}>
                        {item.item.topic_ar}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 200,
        elevation: 5,
        width: width - 10,
        alignSelf: "center",
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginVertical: 5,
        justifyContent: 'space-evenly',
        alignItems: "center"
    },
    itemText: {
        height: '95%',
        // backgroundColor: 'grey',
        width: '50%',
        borderRadius: 10
    },
    itemImage: {
        borderRadius: 10,
        height: '95%',
        // backgroundColor: '#e3e3e3',
        width: '40%'
    },
    title: {
        textAlign: 'right',
        color: '#000',
        fontFamily: 'Tajawal-Bold',
        fontSize: 12,
        // backgroundColor: 'red',
        maxHeight: '20%'
    },
    content: {
        textAlign: 'justify',
        color: '#444',
        fontSize: 14,
        maxHeight: '80%',
    },
    feedImg: {
        backgroundColor: '#e3e3e3',
        height: '100%',
        width: '100%',
        borderRadius: 10
    }
})
