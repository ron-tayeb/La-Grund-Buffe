import React, { Component, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';





export default function KitchenManagerDelProduct({ navigation, route }) {
    
    const [menuInSrartApp, setMenu] = useState(false)// בדיקה איזה מנות להציג בעת הפעלת האפליקציה
    const [cart, setCart] = useState([]) //שמירת המנות הנבחרות לעגלת קניות
    const [item, setitem] = useState([ //מנות קבועות בעת הפעלת האפליקציה
    ]);
    const [render, setRender] = useState(false)

    const storeData = async (key, value) => {//פעולה המאחסנת באסיינסטורג מידע
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            console.log(`e`, e)
        }
    }
    const getData = async (key) => {//פעולה המקבלת מידע מהאסיינסטורג
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }
    const removeValue = async (key) => {//פעולה המוחקת מידע מהאסיינסטורג
        try {
            await AsyncStorage.removeItem(key)
        } catch (e) {
            // remove error
        }

        console.log('Done.')
    }
    function ServerApi() {// הלוקל הוסט
        const api = `http://ruppinmobile.tempdomain.co.il/site23`
        return api
    }
    useEffect(() => {//רינדור הדף והאזנה לכניסה מחדש לאותו מסך
        const unsubscribe = navigation.addListener('focus', () => {//מאזין כל פעם שהוא נכנס לדף ומפעיל את הפונקציות הנבחרות
            async function renderCart() {//כיוון שבעת מעבר העגלה נמחקת מהסטייט ..אז כאן היא מתרנדרת לפי האסיינסטורג
                let c = await getData("cart")
                console.log(`c`, c)
                if (c == null) {
                    await setCart([])
                }
                else { await setCart(c) }
            }
            renderCart()
            GetMenu('meet')
        });

        return unsubscribe
    }, [])
    const GetMenu = async (category) => { // משיכת התמנות לפי קטגוריה
        fetch(`${ServerApi()}/api/getMenu`, {
            method: 'POST',
            body: JSON.stringify(category),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                setitem(result)
                setMenu(true)

            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת שליפת הנתונים אנא נסה שוב מאוחר יותר")
                })


    }
    const deleteProduct = async (item) => {
        let idProduct = item.ProductCode
        await fetch(`${ServerApi()}/api/deletProduct`, {
            method: 'POST',
            body: JSON.stringify(idProduct),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                console.log("fetch POST=", result)
                Alert.alert("ברכות", "מוצר זה הוסר בהצלחה")
            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת מחיקת המנה אנא נסה שוב מאוחר יותר")
                })
        setRender(true)

    }
    useEffect(() => {
        setRender(false)
        GetMenu("meet")
    }, [render])

    return (
        <View style={styles.container}>
            {/* המבורגר , לוגו , עגלת קניות */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Feather
                        name="menu"
                        size={30}
                        style={styles.menu}
                    />
                </TouchableOpacity>
                <Image
                    source={require('../assets/logos/12.png')}
                    resizeMode='contain'
                    style={{
                        marginTop: 70,
                        width: '50%',
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
            {/* קטגוריות */}
            <View style={styles.catgor}>
                <TouchableOpacity onPress={() => { GetMenu('chicken') }}>
                    <Image
                        source={require('../assets/LOGOOF.png')}
                        resizeMode="contain"
                        style={{
                            width: 100,
                            height: 100,
                            marginTop: 20,
                            padding: 15,
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { GetMenu('meet') }}>
                    <Image
                        source={require('../assets/LOGOBA.png')}
                        resizeMode="contain"
                        style={{
                            width: 100,
                            height: 100,
                            marginTop: 20,
                            padding: 15,
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { GetMenu('fish') }}>
                    <Image
                        source={require('../assets/LOGODG.png')}
                        resizeMode='contain'
                        style={{
                            width: 100,
                            height: 100,
                            marginTop: 20,
                            padding: 15,
                        }}
                    />
                </TouchableOpacity>
            </View>
            {/* הצגת מנות */}
            <ScrollView style={{ marginBottom: 40 }}>
                {item.map((item, index) => (
                    <View key={index}>
                        <View>
                            <View>
                                <Image
                                    source={{ uri: `${item.Image}` }}
                                    resizeMode="cover"
                                    style={{
                                        width: "92%",
                                        height: 120,
                                        marginRight: 15,
                                        marginLeft: 15,
                                        borderRadius: 18,
                                        margin: 15,
                                    }}
                                ></Image>
                                <TouchableOpacity style={styles.price} onPress={() => deleteProduct(item)}>
                                    <View>
                                        <Text style={{ fontWeight: 'bold', fontSize: 13, color: "#FFF" }}><MaterialCommunityIcons
                                            name="delete"
                                            size={25}
                                            color={"#FFF"}
                                        />מחק מנה</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.name_stars}>
                            <Text style={styles.name}>{item.Name}</Text>
                            {item.Rating == 1 ?
                                <View style={styles.stars}>
                                    <FontAwesome
                                        name="star-o"
                                        size={17}
                                        style={styles.star}
                                    />
                                    <FontAwesome
                                        name="star-o"
                                        size={17}
                                        style={styles.star}
                                    />
                                    <FontAwesome
                                        name="star-o"
                                        size={17}
                                        style={styles.star}
                                    />
                                    <FontAwesome
                                        name="star-o"
                                        size={17}
                                        style={styles.star}
                                    />
                                    <FontAwesome
                                        name="star"
                                        size={17}
                                        style={styles.star}
                                    />
                                </View>
                                : item.Rating == 2 ?
                                    <View style={styles.stars}>
                                        <FontAwesome
                                            name="star-o"
                                            size={17}
                                            style={styles.star}
                                        />
                                        <FontAwesome
                                            name="star-o"
                                            size={17}
                                            style={styles.star}
                                        />
                                        <FontAwesome
                                            name="star-o"
                                            size={17}
                                            style={styles.star}
                                        />
                                        <FontAwesome
                                            name="star"
                                            size={17}
                                            style={styles.star}
                                        />
                                        <FontAwesome
                                            name="star"
                                            size={17}
                                            style={styles.star}
                                        />
                                    </View> : item.Rating == 3 ?
                                        <View style={styles.stars}>
                                            <FontAwesome
                                                name="star-o"
                                                size={17}
                                                style={styles.star}
                                            />
                                            <FontAwesome
                                                name="star-o"
                                                size={17}
                                                style={styles.star}
                                            />
                                            <FontAwesome
                                                name="star"
                                                size={17}
                                                style={styles.star}
                                            />
                                            <FontAwesome
                                                name="star"
                                                size={17}
                                                style={styles.star}
                                            />
                                            <FontAwesome
                                                name="star"
                                                size={17}
                                                style={styles.star}
                                            />
                                        </View> : item.Rating == 4 ?
                                            <View style={styles.stars}>
                                                <FontAwesome
                                                    name="star-o"
                                                    size={17}
                                                    style={styles.star}
                                                />
                                                <FontAwesome
                                                    name="star"
                                                    size={17}
                                                    style={styles.star}
                                                />
                                                <FontAwesome
                                                    name="star"
                                                    size={17}
                                                    style={styles.star}
                                                />
                                                <FontAwesome
                                                    name="star"
                                                    size={17}
                                                    style={styles.star}
                                                />
                                                <FontAwesome
                                                    name="star"
                                                    size={17}
                                                    style={styles.star}
                                                />
                                            </View> : item.Rating == 5 ?

                                                <View style={styles.stars}>
                                                    <FontAwesome
                                                        name="star"
                                                        size={17}
                                                        style={styles.star}

                                                    />
                                                    <FontAwesome
                                                        name="star"
                                                        size={17}
                                                        style={styles.star}
                                                    />
                                                    <FontAwesome
                                                        name="star"
                                                        size={17}
                                                        style={styles.star}
                                                    />
                                                    <FontAwesome
                                                        name="star"
                                                        size={17}
                                                        style={styles.star}
                                                    />
                                                    <FontAwesome
                                                        name="star"
                                                        size={17}
                                                        style={styles.star}
                                                    />
                                                </View>
                                                : null
                            }
                        </View>
                        <Text style={styles.desc}>{item.Description} </Text>
                    </View>
                ))}</ScrollView>
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
    catgor: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    price: {

        position: 'absolute',
        bottom: 15,
        marginLeft: "68.2%",
        height: 50,
        width: 75,
        backgroundColor: "red",
        borderBottomRightRadius: 18,
        borderTopLeftRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,

    },
    desc: {
        fontWeight: 'bold', fontSize: 15, color: "#9A7759",
        marginLeft: 20,
        marginTop: -20

    },
    name_stars: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: -15,


    },
    name: {
        fontWeight: 'bold', fontSize: 20, color: "#9A7759",
        marginLeft: 20,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    star: {
        color: "gold",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    stars: {
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    userlogin: {
        fontWeight: 'bold', fontSize: 22, color: "#9A7759",
        marginLeft: 20,
    }


})
