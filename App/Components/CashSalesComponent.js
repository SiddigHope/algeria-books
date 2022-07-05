import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { getPermission, mainDomain2, openPdf } from '../config/var';
import CashComponent from './CashComponent';
import { data } from '../config/data';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import AsyncStorage from '@react-native-community/async-storage';

const { width, height } = Dimensions.get('window');

const CopilotText = walkthroughable(View);

class CashSalesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '',
      class: 'إختر الفوج',
      setModalVisible: false,
      classes: [],
      students: [],
      studentsClone: [],
      search: false,
      check: false,
      id: '',
      first: false,
    };
  }

  componentDidMount() {
    this.checkIfFirst();
  }

  checkIfFirst = async () => {
    // AsyncStorage.removeItem("first_time")
    const first = await AsyncStorage.getItem('first_time');
    if (first == null) {
      this.setState({
        first: true,
      });
      AsyncStorage.setItem('first_time', 'yes');
      this.props.copilotEvents.on('stop', () => {
        this.setState({
          first: false,
        });
        // console.log("its finished")
        // Copilot tutorial finished!
      });
      this.props.start();
    }
  };

  separator() {
    return (
      <View
        style={{ height: 1, marginVertical: 5, backgroundColor: '#32899F' }}
      />
    );
  }

  checkFile = item => {
    const file =
      '/storage/emulated/0/receipts/order-' + item.order_id + '-postoffice.pdf';
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
    const sorryText = 'عذرا لا يمكنك طباعة الوصل بعد عملية الشراء';
    if (item.receipe > 0) {
      ToastAndroid.show(sorryText, ToastAndroid.LONG);
      return;
    }
    this.props.download(true, 0);

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

    const { dirs } = RNFetchBlob.fs;
    // console.log(dirs.DownloadDir)
    const downloadFileName = 'order-' + item.order_id + '-postoffice.pdf';

    // console.log(student[0].FkCdDivisionActl)
    // return
    try {
      RNFetchBlob.fetch(
        'POST',
        mainDomain2 + 'getPdfInfo.php',
        {
          'Cache-Control': 'no-store',
        },
        [
          // to send data
          { name: 'parentId', data: String(this.props.parent.MatriculeParent) },
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
          { name: 'order_id', data: String(item.order_id) },
          {
            name: 'studentName',
            data: String(student[0].NomArElv + ' ' + student[0].PrenomArElv),
          },
          { name: 'divisionId', data: String(student[0].FkCdDivisionActl) },
          { name: 'studentId', data: String(student[0].MatriculeElv) },
          { name: 'division', data: String(student[0].division) },
          { name: 'institution', data: String(student[0].institution) },
          { name: 'books', data: String(bookIds) },
          { name: 'pdfType', data: String('CASH') },
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
            { backgroundColor: '#e3e3e3', height: 50 },
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
        {this.props.loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="rgba(50,137,159,1)" size="large" />
          </View>
        ) : (
          <FlatList
            data={
              this.state.first
                ? this.props.data.length > 1
                  ? this.props.data
                  : data
                : this.props.data
            }
            keyExtractor={(item, index) => index.toString()}
            // ItemSeparatorComponent={() => this.separator()}
            renderItem={(item, index) => (
              <CashComponent
                item={item}
                first={this.state.first}
                index={index}
                checkFile={this.checkFile}
                check={this.state.check}
              />
            )}
          />
        )}
        {this.state.first ? (
          <View style={styles.walkthroughCont}>
            <View style={[styles.firstContainer, { marginBottom: 10 }]}></View>
            <CopilotStep
              text="يمكنك تحميل الوصل من هذه الايقونة الحمراء"
              order={1}
              name="hello">
              <CopilotText style={styles.firstContainer}>
                <View style={{ height: 25, width: 25 }} />
                {/* <Icon name="file-pdf" size={25} color={'#e80242'} /> */}
              </CopilotText>
            </CopilotStep>
            {/* <View style={[styles.secondContainer, {marginBottom:10}]}> */}
            {/* <Icon name="file-pdf" size={25} color={'#e80242'} /> */}
            {/* </View> */}
            <CopilotStep
              text="بعد تحميله يمكنك فتحة من هذه الايقونة الخضراء او بالدخول على مجلد 'receipts' على الذاكرة الداخلية للهاتف"
              order={2}
              name="icon2">
              <CopilotText style={styles.secondContainer}>
                <View style={{ height: 25, width: 25 }} />
                {/* <Icon name="file-pdf" size={25} color={'#81c784'} /> */}
              </CopilotText>
            </CopilotStep>
          </View>
        ) : null}
      </View>
    );
  }
}

export default copilot({
  overlay: 'svg', // or 'view'
  animated: true, // or false
  labels: {
    previous: 'السابق',
    next: 'التالي',
    skip: 'تخطي',
    finish: 'انهاء',
  },
  backdropColor: 'rgba(50,137,159,0.9)',
})(CashSalesComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e3e3',
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
  firstContainer: {
    // backgroundColor: '#FFF',
    alignItems: 'flex-end',
    width: 25,
    marginRight: 54,
    marginVertical: 25,
    marginBottom: 35,
  },
  secondContainer: {
    // backgroundColor: '#FFF',
    alignItems: 'flex-end',
    width: 25,
    marginRight: 54,
    marginVertical: 30,
    justifyContent: 'center',
  },
  walkthroughCont: {
    // backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    width: '100%',
    top: (height * 8.8) / 100,
    alignItems: 'flex-end',
  },
});
