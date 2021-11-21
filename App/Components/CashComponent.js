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
    };
  }

  componentDidMount() {
    this.checkFile();
  }

  checkFile = async () => {
    getPermission();
    const file =
      '/storage/emulated/0/receipts/order-' +
      this.props.item.item.order_id +
      '-golden-card.pdf';
    const exists = await RNFetchBlob.fs.exists(file);
    this.setState({
      exists,
    });
    // console.log(exists)
  };

  render() {
    // console.log(item)
    let backgroundColor = '#FFF';
    let elevation = 3;
    if (this.props.item.index % 2 == 1) {
      backgroundColor = '#FFF';
      elevation = 0;
    }
    return (
      <>
        <View style={[styles.newContainer, {backgroundColor}]}>
          <View style={[styles.rowContainer]}>
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
                <Icon name="file-pdf" size={25} color={this.state.exists ? '#81c784' : '#e80242'} />
              </TouchableOpacity>
              {/* <Text style={styles.content}> {item.item.order_id} </Text> */}
            </View>
          </View>
        </View>
      </>
    );
  }
}
