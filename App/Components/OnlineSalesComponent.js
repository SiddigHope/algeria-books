import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {checkFile, getPermission, mainDomain, openPdf} from '../config/var';
import RNFetchBlob from 'rn-fetch-blob';
import {now} from 'moment';
import OnlineComponent from './OnlineComponent';

export default class OnlineSalesComponent extends Component {
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
      check: false,
    };
  }

  separator() {
    return (
      <View
        style={{height: 1, marginVertical: 5, backgroundColor: '#32899F'}}
      />
    );
  }

  checkFile = item => {
    const file =
      '/storage/emulated/0/receipts/order-' +
      item.order_id +
      '-golden-card.pdf';
    getPermission();
    RNFetchBlob.fs
      .exists(file)
      .then(exist => {
        // console.log(`file ${exist ? '' : 'not'} exists`);
        exist ? openPdf(file) : this.getOrderDetails(item);
      })
      .catch(error => {
        console.log(error);
      });
  };

  getOrderDetails = item => {
    getPermission();
    // console.log('sdjnchjbds');
    // function loop through all the students and return the student who belongs to this particular order
    const filtering = student => student.MatriculeElv == item.eleve;

    // getting the who ordered the books
    const student = this.props.students.filter(filtering);

    // converting the book lists object to and array of ids
    const book_list = JSON.parse(item.book_list);
    // function loop through all the book lists and return the book id only in the from of arrays
    const mapping = book => book.book_id;
    const bookIds = book_list.map(mapping);

    const {dirs} = RNFetchBlob.fs;
    // console.log(dirs)
    // return
    const downloadFileName = 'order-' + item.order_id + '-golden-card.pdf';

    // console.log(student)
    // return
    try {
      RNFetchBlob.fetch(
        'POST',
        mainDomain + 'getPdfInfo.php',
        {
          'Cache-Control': 'no-store',
        },
        [
          // to send data
          {name: 'parentId', data: String(this.props.parent.MatriculeParent)},
          {
            name: 'parentName',
            data: String(
              this.props.parent.NomArParent +
                ' ' +
                this.props.parent.PrenomArParent,
            ),
          },
          {
            name: 'parentPhone',
            data: String('0' + this.props.parent.TelMobileTutr),
          },
          {name: 'order_id', data: String(item.order_id)},
          {
            name: 'studentName',
            data: String(student[0].NomArElv + ' ' + student[0].PrenomArElv),
          },
          {name: 'divisionId', data: String(student[0].FkCdDivisionActl)},
          {name: 'studentId', data: String(student[0].MatriculeElv)},
          {name: 'division', data: String(student[0].division)},
          {name: 'institution', data: String(student[0].institution)},
          {name: 'books', data: String(bookIds)},
          {name: 'pdfType', data: String('ONLINE')},
        ],
      )
        .then(async resp => {
          // console.log(resp.data)

          let base64Str = resp.data;

          let fLocation = '/storage/emulated/0/receipts/' + downloadFileName;
          try {
            await RNFetchBlob.fs
              .writeFile(fLocation, base64Str, 'base64')
              .then(() => {
                this.props.download(true, 1);
                setTimeout(() => {
                  this.props.download(false, 0);
                  this.setState({
                    check: true,
                  });
                }, 3000);
                // RNFetchBlob.android.actionViewIntent(fLocation, 'application/pdf');
              })
              .catch(error => {
                this.props.download(true, 2);
                setTimeout(() => {
                  this.props.download(false, 0);
                }, 2000);
                console.log(error);
              });
          } catch (error) {
            this.props.download(true, 2);
            setTimeout(() => {
              this.props.download(false, 0);
            }, 2000);
            console.log(error);
          }
        })
        .catch(err => {
          this.props.download(true, 2);
          setTimeout(() => {
            this.props.download(false, 0);
          }, 2000);
          this.setState({
            setModalVisible: false,
          });
          console.log('error response');
          console.log(err);
        });
    } catch (error) {
      this.props.download(true, 2);
      setTimeout(() => {
        this.props.download(false, 0);
      }, 2000);
      console.log(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.newTopContainer,
            {backgroundColor: '#e3e3e3', height: 50},
          ]}>
          <View style={[styles.rowTopContainer]}>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'حالة الطلب'} </Text>
            </View>
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
        {this.props.loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color="rgba(50,137,159,1)" size="large" />
          </View>
        ) : (
          <FlatList
            data={this.props.data}
            keyExtractor={(item, index) => index.toString()}
            // ItemSeparatorComponent={() => this.separator()}
            renderItem={(item, index) => (
              <OnlineComponent
                item={item}
                index={index}
                checkFile={this.checkFile}
                check={this.state.check}
              />
            )}
          />
        )}
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
