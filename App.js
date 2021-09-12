import React, {Component} from 'react';
import {View, StatusBar, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator} from '@react-navigation/stack';
import Tabs from './App/config/router';
import SplashScreen from './App/screens/SplashScreen';
import Login from './App/screens/Login';
import Payment from './App/screens/Payment';
import Sales from './App/screens/Sales';
import CartItems from './App/screens/CartItems';
import Home from './App/screens/Home';
import MyStudents from './App/screens/MyStudents';
import ForSale from './App/screens/ForSale';
import Cart from './App/screens/Cart';
import Details from './App/Components/Details';
import Results from './App/Components/Results';
import Reception from './App/Components/Reception';
import TimeTable from './App/Components/TimeTable';
import Exams from './App/Components/Exams';
import Absence from './App/Components/Absence';
import AddStudent from './App/Components/AddStudent';
import Messages from './App/Components/Messages';
import Guidence from './App/Components/Guidence';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#32899F" />
        <SplashScreen navigation={this.props.navigation} />
      </View>
    );
  }
}

const Stack = createStackNavigator();

function Stacks() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="App"
        component={App}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Sales"
        component={Sales}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyStudents"
        component={MyStudents}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'تفاصيل الموضوع'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="Results"
        component={Results}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'النتائج الفصلية'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="ForSale"
        component={ForSale}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'الكتب المتاحة'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'متابعة الشراء'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'سلة المستريات'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="CartItems"
        component={CartItems}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'عناصر السلة'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="TimeTable"
        component={TimeTable}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'الاستعمال الزمني'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="Reception"
        component={Reception}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'مواعيد الاستقبال'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="Absence"
        component={Absence}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'العيابات و الملاحظات'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="AddStudent"
        component={AddStudent}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'اضافة تلميد'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="Exams"
        component={Exams}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'اضافة تلميذ'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'الرسائل'}{' '}
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="Guidence"
        component={Guidence}
        options={{
          headerShown: true,
          // headerTitleAlign:'center',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#32899F',
          },
          headerBackTitleStyle: {alignSelf: 'flex-start'},
          title: (
            <Text style={{fontFamily: 'Tajawal-Regular', color: '#FFF'}}>
              {' '}
              {'التوجيه المدرسي'}{' '}
            </Text>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function MainScreen() {
  return (
    <NavigationContainer>
      <Stacks />
    </NavigationContainer>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#000',
    fontWeight: 'bold',
  },
  logo: {
    height: 220,
    width: '100%',
    marginBottom: 40,
    marginTop: 20,
  },
  btn: {
    width: '60%',
    height: 50,
    borderRadius: 20,
    backgroundColor: '#ff5b77',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    elevation: 15,
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});
