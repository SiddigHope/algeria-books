import React, {Component} from 'react';
import {Text, StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {checkFile, getPermission, mainDomain, openPdf} from '../config/var';
import RNFetchBlob from 'rn-fetch-blob';
import {now} from 'moment';

export default class OnlineComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        exists:false
    };
  }

  componentDidMount(){
    this.checkFile()
  }

  checkFile = async () => {
    getPermission();
    const file = '/storage/emulated/0/receipts/order-' + this.props.item.item.order_id + '-golden-card.pdf'
    const exists = await RNFetchBlob.fs.exists(file)
    this.setState({
        exists
    })
    // console.log(exists)
  };

  render() {
    let backgroundColor = '#FFF';
    let elevation = 3;
    if (this.props.item.index % 2 == 1) {
      backgroundColor = '#FFF';
      elevation = 0;
    }
    if(this.props.check){
        this.checkFile()
    }
    return (
      <>
        <View style={[styles.newContainer, {backgroundColor}]}>
          <View style={[styles.rowContainer]}>
            <View style={styles.rowData}>
              {this.props.item.item.receipe != '0' ? (
                <Icon name="check-bold" color="#81c784" size={25} />
              ) : (
                <Icon name="close-thick" color="#ef5350" size={25} />
              )}
            </View>
            <View style={styles.rowData}>
              <Text style={styles.content}>
                {' '}
                {this.props.item.item.date.slice(0, 10)}{' '}
              </Text>
            </View>
            <View style={styles.rowData}>
              <Text style={styles.content}> {this.props.item.item.price} </Text>
            </View>
            <View style={styles.rowData}>
              <TouchableOpacity onPress={() => this.props.checkFile(this.props.item.item)}>
                <Icon
                  name="file-pdf"
                  size={25}
                  color={this.state.exists ? '#81c784' : '#e80242'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e3e3e3',
    },
    title: {
      fontSize: 20,
      fontFamily: 'Tajawal-Regular',
      alignSelf: 'center',
      color: '#FFF',
      marginRight: 15,
    },
    tabStyle: {
      backgroundColor: '#32899F',
    },
    active: {
      fontFamily: 'Tajawal-Regular',
      // backgroundColor: '#8f5ba6',
      backgroundColor: '#32899F',
    },
    textInput: {
      marginVertical: 5,
      alignSelf: 'center',
      height: 50,
      width: '95%',
      justifyContent: 'center',
      borderRadius: 10,
      fontFamily: 'Tajawal-Regular',
      fontSize: 18,
      alignItems: 'center',
      // color: '#9e9e9e',
      backgroundColor: 'rgba(7,93,84,.5)',
    },
    select: {
      fontFamily: 'Tajawal-Regular',
      fontSize: 18,
      color: '#e3e3e3',
      // letterSpacing: 5
    },
    rowContainer: {
      // height: 70,
      // width: '95%',
      // backgroundColor: '#FFF',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginVertical: 5,
      marginBottom: 10,
    },
    rowTopContainer: {
      // height: 70,
      // backgroundColor: 'red',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginVertical: 5,
      marginBottom: 10,
    },
    rowData: {
      height: '100%',
      flex: 1,
      // backgroundColor:'red',
      alignItems: 'center',
    },
    rowTopData: {
      height: '100%',
      flex: 1,
    },
    textTitle: {
      fontFamily: 'Tajawal-Regular',
      textAlign: 'center',
      fontSize: 16,
      color: '#444',
    },
    content: {
      fontFamily: 'Tajawal-Regular',
      textAlign: 'center',
      fontSize: 16,
      color: '#444',
      // textAlign: 'right'
    },
    newContainer: {
      paddingVertical: 20,
      // backgroundColor: '#e3e3e3',
      // alignItems: "center",
      // justifyContent: "center",
      width: '95%',
      marginVertical: 5,
      // elevation: 3,
      alignSelf: 'center',
      borderRadius: 10,
      elevation: 3,
    },
    newTopContainer: {
      // paddingVertical: 20,
      // backgroundColor: '#e3e3e3',
      alignItems: 'center',
      justifyContent: 'center',
      width: '95%',
      marginVertical: 5,
      elevation: 3,
      flexDirection: 'row',
      alignSelf: 'center',
      borderRadius: 10,
      // elevation: 3,
    },
  });
  