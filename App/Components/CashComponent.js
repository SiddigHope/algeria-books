import React, {Component} from 'react';
import {Text, StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {checkFile, getPermission, mainDomain, openPdf} from '../config/var';
import RNFetchBlob from 'rn-fetch-blob';
import {now} from 'moment';

export default class CashComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exists: false,
      first: true,
    };
  }

  componentDidMount() {
    // this.props.start()
    this.checkFile();
  }

  checkFile = async () => {
    getPermission();
    const file =
      '/storage/emulated/0/receipts/order-' +
      this.props.item.item.order_id +
      '-postoffice.pdf';
    const exists = await RNFetchBlob.fs.exists(file);

    if (exists && this.props.item.item.receipe > 0) {
      RNFetchBlob.fs.unlink(file);
      this.setState({
        exists: false,
      });
      return;
    }

    this.setState({
      exists,
    });
    // console.log(exists)
  };

  render() {
    // console.log(this.props.item.index)
    let backgroundColor = '#FFF';
    let elevation = 3;
    if (this.props.item.index % 2 == 1) {
      backgroundColor = '#FFF';
      elevation = 0;
    }
    if (this.props.check) {
      this.checkFile();
    }
    return (
      <>
        <View style={[styles.newContainer, {backgroundColor}]}>
          <View style={[styles.rowContainer]}>
            {/* <View style={styles.rowData}>
              {this.props.item.item.receipe != '0' ? (
                <Icon name="check-bold" color="#81c784" size={25} />
              ) : (
                <Icon name="close-thick" color="#ef5350" size={25} />
              )}
            </View> */}
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
              <TouchableOpacity
                onPress={() => this.props.checkFile(this.props.item.item)}>
                {this.props.first && this.props.item.index == 0 ? (
                  <Icon name="file-pdf" size={25} color={'#e80242'} />
                ) : this.props.first && this.props.item.index == 1 ? (
                  <Icon name="file-pdf" size={25} color={'#81c784'} />
                ) : (
                  <Icon
                    name="file-pdf"
                    size={25}
                    color={this.state.exists ? '#81c784' : '#e80242'}
                  />
                )}
              </TouchableOpacity>
              {/* <Text style={styles.content}> {item.item.order_id} </Text> */}
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
  active: {
    fontFamily: 'Tajawal-Regular',
    // backgroundColor: '#8f5ba6',
    backgroundColor: '#32899F',
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
  rowData: {
    height: '100%',
    flex: 1,
    // backgroundColor:'red',
    alignItems: 'center',
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
});
