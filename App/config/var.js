import { PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

// export const mainDomain = 'http://192.168.43.148/server/';

export const mainDomain = 'https://educjijel18.com/api1/';
export const assetsDomain = 'https://educjijel18.com/';
export const newsAssetsDomain = 'https://educjijel18.com/news_image/';

/* *** ***** **** **** ** this is for the second server that contains information about students, books and parents ** *** **** *** **** ****  */

export const mainDomain2 = 'https://educjijel18.com/api2/';
export const assetsDomain2 = 'https://educjijel18.com/';
export const newsAssetsDomain2 = 'https://educjijel18.com/news_image/';

/* 
*************

  mainDomain variable contains the following endpoints

    -- getSoldBooks
    -- bookOrder
    -- getOrdersStatus
    -- insertIntoOrder
    -- getOrders

  mainDomain2 variable contains the following endpoints

    -- getParentData
    -- insertParentImei
    -- getMyChildren
    -- getStudentBooks
    -- getPdfInfo

*************
*/


// export const mainDomain = 'http://41.201.0.26/abdessalam/server/';
// export const assetsDomain = 'http://41.201.0.26/abdessalam/';
// export const newsAssetsDomain = 'http://41.201.0.26/abdessalam/news_image/';

export const getPermission = async file => {
  if (Platform.OS == 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Download Files',
        message: 'Use your storage to download data',
      },
    );
  }
};

export const openPdf = file => {
  RNFetchBlob.android.actionViewIntent(file, 'application/pdf');
};

// console.log(item.index)
//    let backgroundColor = '#FFF';
//    let elevation = 3;
//    if (item.index % 2 == 1) {
//      backgroundColor = '#FFF';
//      elevation = 0;
//    }

//    const exists = await checkFile('/storage/emulated/0/receipts/order-' + item.item.order_id + '-golden-card.pdf')
//    console.log(exists)
//    return (
//      <>
//        <View style={[styles.newContainer, {backgroundColor}]}>
//          <View style={[styles.rowContainer]}>
//            <View style={styles.rowData}>
//              {item.item.receipe != '0' ? (
//                <Icon name="check-bold" color="#81c784" size={25} />
//              ) : (
//                <Icon name="close-thick" color="#ef5350" size={25} />
//              )}
//            </View>
//            <View style={styles.rowData}>
//              <Text style={styles.content}>
//                {' '}
//                {item.item.date.slice(0, 10)}{' '}
//              </Text>
//            </View>
//            <View style={styles.rowData}>
//              <Text style={styles.content}> {item.item.price} </Text>
//            </View>
//            <View style={styles.rowData}>
//              <TouchableOpacity
//                onPress={() => this.checkFile(item.item)}>
//                <Icon name="file-pdf" size={25} color={exists?"#81c784":"#e80242"} />
//              </TouchableOpacity>
//            </View>
//          </View>
//        </View>
//      </>
//    );
