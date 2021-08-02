import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, View, Text } from 'react-native';
import React, { Component, useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerItems } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// screen import>
import Login from './app/Login.jsx';
import SingUp from './app/SingUp.jsx';
import Home from './app/Home.jsx';
import Cart from './app/Cart.jsx';
import OrderDetails from './app/OrderDetails.jsx';
import MapToGo from './app/MapToGo.jsx';
import KitchenManagerOrder from './app/KitchenManagerOrder.jsx';
import KitchenManagerAddProduct from './app/KitchenManagerAddProduct.jsx';
import KitchenManagerDelProduct from './app/KitchenManagerDelProduct.jsx';
import KitchenManagerUpdateProduct from './app/KitchenManagerUpdateProduct.jsx';
import KitchenManagerUpdateProductP2 from './app/KitchenManagerUpdateProductP2.jsx';
import KitchenManagerHome from './app/KitchenManagerHome.jsx';
import ManagerAddCustomer from './app/ManagerAddCustomer.jsx';
import ManagerAddDeliveryPerson from './app/ManagerAddDeliveryPerson.jsx';
import ManagerAddKitchenManager from './app/ManagerAddKitchenManager.jsx';
import ManagerDelCustomer from './app/ManagerDelCustomer.jsx';
import ManagerDelDeliveryPerson from './app/ManagerDelDeliveryPerson.jsx';
import ManagerDelKitchenManager from './app/ManagerDelKitchenManager.jsx';
import ManagerUpdateCustomer from './app/ManagerUpdateCustomer.jsx';
import ManagerUpdateDeliveryPerson from './app/ManagerUpdateDeliveryPerson.jsx';
import ManagerUpdateKitchenManager from './app/ManagerUpdateKitchenManager.jsx';
import ManagerUpdateCustomer2 from './app/ManagerUpdateCustomer2.jsx';
import ManagerUpdateDeliveryPerson2 from './app/ManagerUpdateDeliveryPerson2.jsx';
import ManagerUpdateKitchenManager2 from './app/ManagerUpdateKitchenManager2.jsx';
import ManagerHome from './app/ManagerHome.jsx';
import DeliveryPersonHome from './app/DeliveryPersonHome.jsx';
import DeliveryPersonOrders from './app/DeliveryPersonOrders.jsx';
import MapToResturant from './app/MapToResturant.jsx';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const CustomDrwerContent = (props) => {
  const [user, setUser] = useState()
  const [uObj, setUObj] = useState({})

  useEffect(() => {//מפעיל בעת כל שימוש בפונקציה את הפעולה שבודקת אם משתמש מחובר
    checkLogIN()
  },[props])

  const getData = async (key) => {//פעולה שמקבלת מידע מהאסיינסטורג
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      // read error
    }
  }
  const removeValue = async (key) => { // פעולה שמוחקת מידע מהאסיינסטורג
    try {
      await AsyncStorage.removeItem(key)
      console.log(`true`)
    } catch (e) {
      console.log(`e`, e)
    }
    console.log('Done.')
  }
  const checkLogIN = async () => { // בדיקה  אם קיים משתמש מחובר כדי לדעת אם להעלים את כפתור ההרשמה וההתחברות
    let u = await getData("user")
    if (u == undefined) {
      await setUser(false)
      return
    }
    else {
      await setUser(true)
      setUObj(u);
      return
    }
  }
  const logOut = async () => { //פעולה שמתנתקת מהאפליקציה ומוחקת מהאססינססטורג את פרטי המשתמש והעגלה שלו
    await removeValue("user")
    await removeValue("cart")
    setUObj("")
    props.navigation.navigate("loginScreen");
    props.navigation.closeDrawer();
  }


  return (
    <View style={styles.drower}>
      {/* מה שמוצג בדרווור נאביגיישן */}
      <View style={styles.drowerHedear}>
        <LinearGradient style={{ width: '100%' }}
          colors={['#4A3F34', '#090706']}>
          <Image source={require('./pic/logo.png')} style={{ height: 80, width: 270, marginTop: 70, }} />
        </LinearGradient>
      </View>
      <DrawerContentScrollView >
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >מסך בית</Text>)} onPress={() => { props.navigation.navigate("HomeScreen"); props.navigation.closeDrawer(); }}></DrawerItem>
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >עגלת קניות</Text>)} onPress={() => { props.navigation.navigate("CartScreen", []); props.navigation.closeDrawer(); }}></DrawerItem>
        {user ? null : <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >הרשם</Text>)} onPress={() => { props.navigation.navigate("SingUpScreen"); props.navigation.closeDrawer(); }}></DrawerItem>}
        {user ? null : <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >התחבר</Text>)} onPress={() => { props.navigation.navigate("loginScreen"); props.navigation.closeDrawer(); }}></DrawerItem>}
        {user ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >התנתק</Text>)} onPress={() => logOut()}></DrawerItem> : null}
        <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >ניווט</Text>)} onPress={() => { props.navigation.navigate("MapToResturantScreen"); props.navigation.closeDrawer(); }}></DrawerItem>
        {user && uObj.KitchenManagersCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >הזמנות</Text>)} onPress={() => { props.navigation.navigate("KitchenManagerOrderScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.KitchenManagersCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >הוספת מוצר</Text>)} onPress={() => { props.navigation.navigate("KitchenManagerAddProductScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.KitchenManagersCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >מחיקת מנה</Text>)} onPress={() => { props.navigation.navigate("KitchenManagerDelProductScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.KitchenManagersCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >עריכת מנה</Text>)} onPress={() => { props.navigation.navigate("KitchenManagerUpdateProductScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.KitchenManagersCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >ממשק מנהל מטבח</Text>)} onPress={() => { props.navigation.navigate("KitchenManagerHomeScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >הוספת לקוח</Text>)} onPress={() => { props.navigation.navigate("ManagerAddCustomerScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >הוספת שליח</Text>)} onPress={() => { props.navigation.navigate("ManagerAddDeliveryPersonScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >הוספת מנהל מטבח</Text>)} onPress={() => { props.navigation.navigate("ManagerAddKitchenManagerScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >מחיקת לקוח</Text>)} onPress={() => { props.navigation.navigate("ManagerDelCustomerScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >מחיקת שליח</Text>)} onPress={() => { props.navigation.navigate("ManagerDelDeliveryPersonScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >מחיקת מנהל מטבח</Text>)} onPress={() => { props.navigation.navigate("ManagerDelKitchenManagerScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >עריכת לקוח</Text>)} onPress={() => { props.navigation.navigate("ManagerUpdateCustomerScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >עריכת שליח</Text>)} onPress={() => { props.navigation.navigate("ManagerUpdateDeliveryPersonScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >עריכת מנהל מטבח</Text>)} onPress={() => { props.navigation.navigate("ManagerUpdateKitchenManagerScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.ManagerCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >ממשק בעל הבית</Text>)} onPress={() => { props.navigation.navigate("ManagerHomeScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.DeliveryPersonCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >ממשק שליח</Text>)} onPress={() => { props.navigation.navigate("DeliveryPersonHomeScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
        {user && uObj.DeliveryPersonCode ? <DrawerItem style={styles.signup} label={() => (<Text style={styles.signupT} >הזמנות לשליחה</Text>)} onPress={() => { props.navigation.navigate("DeliveryPersonOrdersScreen"); props.navigation.closeDrawer(); }}></DrawerItem> : null}
      </DrawerContentScrollView>
      <View style={styles.drowerfooter}>
      </View>
    </View>

  )
}

function MyDrawer() {
  return (

    <Drawer.Navigator
      initialRouteName="loginScreen"
      drawerPosition="right"
      drawerStyle={styles.container1}
      drawerContent={(props) => (<CustomDrwerContent {...props} />)}
    >
      <Drawer.Screen
        name="CartScreen"
        component={Cart}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="HomeScreen"
        component={Home}
        options={{
          title: 'sss',
        }}
      />

      <Drawer.Screen
        name="loginScreen"
        component={Login}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="SingUpScreen"
        component={SingUp}
        options={{ drawerLabel: 'Second Page' }}
      />
      <Drawer.Screen
        name="OrderDetailsScreen"
        component={OrderDetails}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="MapToGoScreen"
        component={MapToGo}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="KitchenManagerOrderScreen"
        component={KitchenManagerOrder}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="KitchenManagerAddProductScreen"
        component={KitchenManagerAddProduct}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="KitchenManagerDelProductScreen"
        component={KitchenManagerDelProduct}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="KitchenManagerUpdateProductScreen"
        component={KitchenManagerUpdateProduct}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="KitchenManagerUpdateProductP2Screen"
        component={KitchenManagerUpdateProductP2}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="KitchenManagerHomeScreen"
        component={KitchenManagerHome}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerAddCustomerScreen"
        component={ManagerAddCustomer}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerAddDeliveryPersonScreen"
        component={ManagerAddDeliveryPerson}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerAddKitchenManagerScreen"
        component={ManagerAddKitchenManager}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerDelCustomerScreen"
        component={ManagerDelCustomer}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerDelDeliveryPersonScreen"
        component={ManagerDelDeliveryPerson}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerDelKitchenManagerScreen"
        component={ManagerDelKitchenManager}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerUpdateCustomerScreen"
        component={ManagerUpdateCustomer}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerUpdateDeliveryPersonScreen"
        component={ManagerUpdateDeliveryPerson}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerUpdateKitchenManagerScreen"
        component={ManagerUpdateKitchenManager}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerUpdateCustomer2Screen"
        component={ManagerUpdateCustomer2}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerUpdateDeliveryPerson2Screen"
        component={ManagerUpdateDeliveryPerson2}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerUpdateKitchenManager2Screen"
        component={ManagerUpdateKitchenManager2}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="ManagerHomeScreen"
        component={ManagerHome}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="DeliveryPersonHomeScreen"
        component={DeliveryPersonHome}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="DeliveryPersonOrdersScreen"
        component={DeliveryPersonOrders}
        options={{
          title: 'sss',
        }}
      />
      <Drawer.Screen
        name="MapToResturantScreen"
        component={MapToResturant}
        options={{
          title: 'sss',
        }}
      />

    </Drawer.Navigator>
  );
}


export default function App() {


  
  return (
    <NavigationContainer>
      {/* stack navigition */}
      <MyDrawer >
        <Stack.Navigator initialRouteName="loginScreen" headerMode="none"  >
          <Stack.Screen name="loginScreen" component={Login} />
          <Stack.Screen name="SingUpScreen" component={SingUp} />
          <Stack.Screen name="HomeScreen" component={Home} />
          <Stack.Screen name="CartScreen" component={Cart} />
          <Stack.Screen name="OrderDetailsScreen" component={OrderDetails} />
          <Stack.Screen name="MapToGoScreen" component={MapToGo} />
          <Stack.Screen name="KitchenManagerOrderScreen" component={KitchenManagerOrder} />
          <Stack.Screen name="KitchenManagerAddProductScreen" component={KitchenManagerAddProduct} />
          <Stack.Screen name="KitchenManagerDelProductScreen" component={KitchenManagerDelProduct} />
          <Stack.Screen name="KitchenManagerUpdateProductScreen" component={KitchenManagerUpdateProduct} />
          <Stack.Screen name="KitchenManagerUpdateProductP2Screen" component={KitchenManagerUpdateProductP2} />
          <Stack.Screen name="KitchenManagerHomeScreen" component={KitchenManagerHome} />
          <Stack.Screen name="ManagerAddCustomerScreen" component={ManagerAddCustomer} />
          <Stack.Screen name="ManagerAddDeliveryPersonScreen" component={ManagerAddDeliveryPerson} />
          <Stack.Screen name="ManagerAddKitchenManagerScreen" component={ManagerAddKitchenManager} />
          <Stack.Screen name="ManagerDelCustomerScreen" component={ManagerDelCustomer} />
          <Stack.Screen name="ManagerDelDeliveryPersonScreen" component={ManagerDelDeliveryPerson} />
          <Stack.Screen name="ManagerDelKitchenManagerScreen" component={ManagerDelKitchenManager} />
          <Stack.Screen name="ManagerUpdateCustomerScreen" component={ManagerUpdateCustomer} />
          <Stack.Screen name="ManagerUpdateDeliveryPersonScreen" component={ManagerUpdateDeliveryPerson} />
          <Stack.Screen name="ManagerUpdateKitchenManagerScreen" component={ManagerUpdateKitchenManager} />
          <Stack.Screen name="ManagerUpdateCustomer2Screen" component={ManagerUpdateCustomer2} />
          <Stack.Screen name="ManagerUpdateDeliveryPerson2Screen" component={ManagerUpdateDeliveryPerson2} />
          <Stack.Screen name="ManagerUpdateKitchenManager2Screen" component={ManagerUpdateKitchenManager2} />
          <Stack.Screen name="ManagerHomeScreen" component={ManagerHome} />
          <Stack.Screen name="DeliveryPersonHomeScreen" component={DeliveryPersonHome} />
          <Stack.Screen name="DeliveryPersonOrdersScreen" component={DeliveryPersonOrders} />
          <Stack.Screen name="MapToResturantScreen" component={MapToResturant} />
        </Stack.Navigator>
      </MyDrawer>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container1: {
    borderBottomRightRadius: 80,

  },
  drower: {
    flex: 1,
    backgroundColor: '#FADAB5',
    borderBottomRightRadius: 80,

  },
  drowerHedear: {
    height: 200,
    backgroundColor: '#493E33',
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  signup: {
    backgroundColor: '#FADAB5',
    borderColor: "#F8D1A5",
    borderWidth: 0.4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  signupT: {
    marginLeft: 20,
    textAlign: 'center',
    color: '#56493C',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
