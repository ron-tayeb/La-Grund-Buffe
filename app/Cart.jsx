import React, { Component, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    Animated,
    Dimensions,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';





export default function Cart({ navigation, route }) {

    const scrollX = new Animated.Value(0)
    const [items, setitems] = React.useState([]);
    const [orderCopy, setOrderCopy] = React.useState([]);
    const [order, setOrder] = React.useState([]);
    const [order2, setOrder2] = React.useState([]);
    const [sum, setSum] = React.useState(0);
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;



    const storeData = async (key, value) => {//פונציקה לאחסנת מידע באסיינסטורג
        console.log(`value`, value)
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
            console.log("ok")
        } catch (e) {
            console.log(`e`, e)
        }
    }
    const getData = async (key) => {//פונקציה לקבלת מידע מהאסיינסטורג
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }
    const removeValue = async (key) => {//פונקציה למחיקת מידע מהאסיינסטורג
        try {
            await AsyncStorage.removeItem(key)
            console.log(`true`)
        } catch (e) {
            console.log(`e`, e)
        }
        console.log('Done.')
    }
    function ServerApi() {// הלוקל הוסט
        const api = `http://ruppinmobile.tempdomain.co.il/site23`
        return api
    }
    useEffect(() => {//בדיקה שהעגלה ריקה במידה ולא מעדכן אותה בסטייט ובנוסף מאתחל את המספרי כמות של כל אייטם
        console.log("=====================start useEffect===========================")
        if (route.params == undefined || Object.keys(route.params).length === 0 && route.params.constructor === Object) {
            Alert.alert("אופס", "אנא הכנס מוצרים לעגלה ובדוק שנית")
            navigation.navigate("HomeScreen")
        }
        else {
            let items = route.params.c
            setitems(items)
            setOrderCopy(items)
            sumOrder()
            amountOfItems()
            console.log(2222222222222)
        }
        (async function () {
            let amount = await getData('amount')
            console.log(`amount`, amount)
            if (amount == null) {
                let arr = [];
                for (let i = 0; i < items.length; i++) {
                    arr[i] = 1;
                }
                setSum(arr)
                storeData('amount', arr)
            }
            else {
                if (sum === 0) {
                    let arr = [];
                    for (let i = 0; i < items.length; i++) {
                        arr[i] = 1;
                    }
                    setSum(arr)
                    storeData('amount', arr)
                }
                else if (sum.length < items.length) {
                    let arr = [];
                    for (let i = 0; i < items.length; i++) {
                        if (i >= sum.length) {
                            arr[i] = 1;
                        }
                        else { arr[i] = sum[i]; }

                    }
                    setSum(arr)
                    await storeData('amount', arr)
                }
            }
        })();
    })
    const del = async (index) => {//מוחקת מוצר מהעגלת קניות
        if (sum[index] != 1) {
            alert("אנא הורד כמות מוצר למינימום לפני מחיקה")
        }
        else {
            let cart = items.splice(index, 1);
            console.log(`cart`, cart)
            let arrySUM = sum;
            arrySUM.splice(index, 1)
            console.log(`NewSum`, arrySUM)
            await setSum(arrySUM)
            await storeData('amount', arrySUM)
            await setitems(cart)
            await setOrderCopy(cart)
            let v = items
            await removeValue("cart")
            await storeData("cart", v)
            Alert.alert("ברכות לך רעות לנו", "לקוח יקר מוצר זה הוסר ההצלחה")

        }

    }
    const sumMenuOrder = async (x, item, index) => {//פעולה שמוסיפה או מורידה מכמות המוצרים בסל בהתאם לערך הנשלח ומעדכנת את ההזמנה
        if (x == "+") {
            let order1 = sum;
            order1[index] = order1[index] + 1;
            setSum(order1)
            await storeData('amount', order1)
            setOrder(old => [...old, item])
            sumOrder()
        }
        if (x == "-") {
            if (sum[index] === 1) {
                alert("אתה נמצא בכמות הזמנה מינימלית , כדי להסיר את המנה לחץ על האיקס")
            }
            else {
                let order1 = sum;
                order1[index] = order1[index] - 1;
                setSum(order1)
                await storeData('amount', order1)
                // let t = order.filter(a => a.ProductCode == item.ProductCode)
                if (order.length === 1) {
                    setOrder([])
                }
                else {
                    // for (let p = 0; p <= order.length; p++) {
                    //     if (order[p].ProductCode == item.ProductCode) {
                    //         let newOrder = order.splice(p, 1);
                    //         // setOrder(order.splice(p, 1))
                    //         sumOrder()
                    //         useEffect()
                    //         break;
                    //     }
                    // }
                    let newOrder = order.splice(order.findIndex(e => e.ProductCode == item.ProductCode), 1);
                    // let newOrder = order.splice(i, 1);
                    setOrder2([])
                    sumOrder()
                }

            }
        }
    }
    const sumOrder = () => {//פעולה שמחזירה את עלות סהכ המוצרים שבעגלה
        console.log(`order`, order)
        console.log(`orderCopy`, orderCopy)
        let completOrder = order.concat(orderCopy)
        let total = completOrder.reduce((prev, current) => prev + current.Price, 0)
        completOrder="";
        return total
    }
    const amountOfItems = () => {// פעולה שמחזירה את סהכ המוצרים שבעגלה
        let completOrder = order.concat(orderCopy)
        let amount = completOrder.length
        completOrder="";
        console.log(`completOrdehhhhhr`, completOrder)
        return amount
    }
    const sendOrder = async () => {//פעולה ששולחת את העגלה המעודכנת לדף פרטי הזמנה
        if (items.length == 0) {
            Alert.alert("אופס", "אנא הוסף מוצרים לפני שתתקדם")
            navigation.navigate("HomeScreen")
            return
        }
        let endOrder = order.concat(orderCopy)
        let total = endOrder.reduce((prev, current) => prev + current.Price, 0)
        await storeData("cart", endOrder)
        await storeData("price", total)
        setOrder([])
        setOrderCopy([])
        navigation.navigate("OrderDetailsScreen", { endOrder, total })
    }


    return (
        <View>
            <ScrollView>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Feather
                        name="menu"
                        size={30}
                        style={styles.menu}
                    />
                </TouchableOpacity>
                <Image
                    source={require('../assets/logos/cart.png')}
                    resizeMode='contain'
                    style={{
                        marginTop: 50,
                        width: '55%',
                        height: 90,
                    }}
                />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={30}
                        style={styles.shoppingCart}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={70}
                snapToAlignment='center'
                showsHorizontalScrollIndicator={false}

            >
                {items.map((item, index) => (
                    <View
                        key={index}
                        style={{ alignItems: "center" }}>
                        <View style={{ height: 265  }}>
                            <Image

                                source={{ uri: `${item.Image}` }}
                                resizeMode="cover"
                                style={{
                                    width: winW,
                                    height: 240
                                }} />

                            <View style={
                                {
                                    marginLeft: '31%',
                                    position: 'absolute',
                                    bottom: 0,
                                    width: 80,
                                    height: 50,
                                    justifyContent: "center",
                                    flexDirection: 'row',
                                }} >
                                <TouchableOpacity style={{
                                    width: 50,
                                    backgroundColor: '#FFF',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopLeftRadius: 25,
                                    borderBottomLeftRadius: 25
                                }}
                                    onPress={() => sumMenuOrder('+', item, index)}>
                                    <Text style={styles.textPM}>+</Text>

                                </TouchableOpacity>

                                <View style={{
                                    width: 50,
                                    backgroundColor: "#fff",
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={styles.textPM}>{sum[index]}</Text>
                                </View>

                                <TouchableOpacity style={{
                                    width: 50,
                                    backgroundColor: '#fff',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderBottomRightRadius: 25,
                                    borderTopRightRadius: 25,
                                }}
                                    onPress={() => sumMenuOrder('-', item, index)}>
                                    <Text style={styles.textPM}>-</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View style={{
                            width: winW,
                            alignItems: 'center',
                            marginTop: 5,
                            paddingHorizontal: 15,

                        }}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 20
                            }}>{item.Name} -  {item.Price}₪ </Text>
                            <Text style={{ fontSize: 15 }}>{item.Description}</Text>
                        </View>

                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}>

                            <Text style={{ marginTop: 5, fontWeight: "bold" }}>{item.Calories} קלוריות</Text>
                            <MaterialCommunityIcons
                                name="fire"
                                size={25}
                            />
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row'
                        }}>
                            <Text style={{ marginTop: 5 }}>להסרת המנה לחץ     </Text>
                            <TouchableOpacity onPress={() => { del(index) }}>
                                <Foundation
                                    name='x'
                                    size={25}
                                    color='red'
                                />
                            </TouchableOpacity>


                        </View>
                    </View>


                ))}
            </ScrollView>
            
            <View style={{
                marginTop: 30,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#EECCA4',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.00,

                elevation: 24,
                backgroundColor: '#fff',
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                paddingBottom: '100%'

            }}>
                <View style={{
                    flexDirection: "column",
                    justifyContent: 'space-between',
                    paddingVertical: 20,
                    paddingHorizontal: 30,
                    marginTop:'7%'
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 15
                    }}>סך כל החשבון - {sumOrder() + ".00₪"} </Text>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 15,
                        marginTop: 10
                    }}>סך כל הפריטים - {amountOfItems()} </Text>
                </View>
                <TouchableOpacity onPress={() => { sendOrder() }}>
                    <View style={styles.button} >
                        <LinearGradient
                            colors={['#EECCA4', '#F7C891']}
                            style={[styles.logina, {
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,

                            }]}>
                            <Text style={styles.textlogin}>המשך הזמנה</Text>
                        </LinearGradient >
                    </View>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View >

    )


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFF',

    },
    menu: {
        marginTop: 50,
        color: 'black',
        backgroundColor: "#fff"
    },
    shoppingCart: {
        marginTop: 50,
        color: 'black'
    },
    cotert: {
        marginLeft: 45,
        fontSize: 30,
    },
    textPM: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    button: {
        alignItems: 'center',
        marginTop: "12%",
    },
    logina: {
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },

    textlogin: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white"
    },

})
