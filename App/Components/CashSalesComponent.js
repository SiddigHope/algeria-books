import React, {Component} from 'react';
import {Text, StyleSheet, View, FlatList} from 'react-native';

export default class CashSalesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      day: '',
      class: 'إختر الفوج',
      setModalVisible: false,
      classes: [],
      students: [],
      studentsClone: [],
      search: false,
      id: '',
    };
  }

  separator() {
    return (
      <View
        style={{height: 1, marginVertical: 5, backgroundColor: '#32899F'}}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.newTopContainer,
            {backgroundColor: '#e3e3e3', height: 50},
          ]}>
          <View style={[styles.rowTopContainer]}>
            {/* <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'حالة الطلب'} </Text>
            </View> */}
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'التاريخ'} </Text>
            </View>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'الاجمالي'} </Text>
            </View>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'رقم العملية'} </Text>
            </View>
          </View>
        </View>
        <FlatList
          data={this.props.data}
          keyExtractor={(item, index) => index.toString()}
          // ItemSeparatorComponent={() => this.separator()}
          renderItem={(item, index) => {
            // console.log(item.index)
            let backgroundColor = '#FFF';
            let elevation = 3;
            if (item.index % 2 == 1) {
              backgroundColor = '#FFF';
              elevation = 0;
            }
            return (
              <>
                <View style={[styles.newContainer, {backgroundColor}]}>
                  <View style={[styles.rowContainer]}>
                    {/* <View style={styles.rowData}>
                      {item.item.receipe != '0' ? (
                        <Icon name="check-bold" color="#81c784" size={25} />
                      ) : (
                        <Icon name="close-thick" color="#ef5350" size={25} />
                      )}
                    </View> */}
                    <View style={styles.rowData}>
                      <Text style={styles.content}>
                        {' '}
                        {item.item.date.slice(0, 10)}{' '}
                      </Text>
                    </View>
                    <View style={styles.rowData}>
                      <Text style={styles.content}> {item.item.price} </Text>
                    </View>
                    <View style={styles.rowData}>
                      <Text style={styles.content}> {item.item.order_id} </Text>
                    </View>
                  </View>
                </View>
              </>
            );
          }}
        />
      </View>
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
