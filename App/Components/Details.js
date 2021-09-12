import React, { PureComponent, Component } from 'react';
import {
    Dimensions,
    TouchableWithoutFeedback,
    Modal,
    ActivityIndicator,
    FlatList,
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image
} from 'react-native';
import { Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash'

const Screen = Dimensions.get('window');
const { width, height } = Dimensions.get('window');

class Details extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            source: '',
            scrollY: new Animated.Value(0),
            dataSource: ['its one1', 'its one2', 'its one3', 'its one4', 'its one5', 'its one'],
            data: null,
        }
    }

    componentDidMount() {
        this.setState({
            data: this.props.route.params.item,
            image: this.props.route.params.image
        })

            // console.log(this.props.route.params.item)
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.Image
                    style={[styles.backgroundImage, {
                        opacity: this.state.scrollY.interpolate({
                            inputRange: [0, 250],
                            outputRange: [1, 0]
                        }),
                        transform: [{
                            scale: this.state.scrollY.interpolate({
                                inputRange: [-200, 0, 1],
                                outputRange: [1.4, 1, 1]
                            })
                        }]
                    }]}
                    source={this.state.image}
                />
                {this.state.data != null ?
                    (<FlatList
                        data={[this.state.data.item]}
                        renderItem={(item, index) => this.renderRow(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={(item) => this.renderHeader(item)}
                        renderScrollComponent={(item) => this.renderScroll(item)}
                    />)
                    :
                    (<ActivityIndicator style={{ marginTop: Screen.width / 900 * 900 }} animating color='#e3e3e3' size='large' />)}
            </View>
        );
    }
    renderEmpty() {
        return (
            <>
                <View style={{ alignSelf: "center", backgroundColor: '#ff5b77', borderColor: '#e3e3e3', width: width - 50, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: "center", paddingVertical: 20 }}>
                    <Text style={{ fontFamily: 'Tajawal-Regular', fontSize: 18, color: '#e3e3e3' }} >{'لا توجد صوتيات في هذة الجزئية'}</Text>
                </View>
            </>
        )
    }

    renderRow(item, index) {
        // console.log('item.item')
        // console.log(item.item)
        return (
            <View style={{justifyContent:"center", alignItems: "center"}}>
                <View style={{ width: '100%', paddingHorizontal:20}}>
                    <Text style={styles.title}> {item.item.title != null ? item.item.title : item.item.titre} </Text>
                    <Text style={styles.topic}> {item.item.topic_ar != null ? item.item.topic_ar : item.item.article} </Text>
                </View>
            </View>
        );
    }
    renderHeader() {
        return (
            <>
                <View style={styles.header} />
                {/* <Text style={styles.title}> {'vnhdfbv'} </Text> */}
            </>
        )
    }
    renderScroll(props) {
        return (
            <Animated.ScrollView
                {...props}
                scrollEventThrottle={16}
                onScroll={
                    Animated.event([{
                        nativeEvent: { contentOffset: { y: this.state.scrollY } }
                    }], {
                        useNativeDriver: true
                    })
                }
            />
        );
    }
}

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    backgroundImage: {
        width: Screen.width - 20,
        alignSelf: 'center',
        height: Screen.width / 750 * 700,
        position: 'absolute',
        borderRadius: 20,
        marginTop: 10,
    },
    img: {
        height: '100%',
        width: '100%',
        // alignItems: "center",
        justifyContent: "flex-end",
    },
    header: {
        height: Screen.width / 750 * 700,
        marginBottom: 10
    },
    title: {
        fontFamily: 'Tajawal-Bold',
        fontSize: 16,
        textAlign: "right",
        color: '#444',
        width:'100%',
        marginBottom: 10,
    },
    topic: {
        // fontFamily: 'Tajawal-Regular',
        fontSize: 18,
        textAlign: "justify",
        color: '#444',
        width: '100%',
        marginBottom: 10,
    },
});
