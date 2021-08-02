import React, { Component, useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    Dimensions,
    Modal,
    TextInput
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Camera } from 'expo-camera';


export default function KitchenManagerAddProductP2({ navigation, route }) {
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;

    const [renderScreen, setrenderScreen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);//בשביל המודל
    const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.back);
    const [name, setName] = useState(null);
    const [price, setPrice] = useState();
    const [calorie, setCalorie] = useState(null);
    const [desc, setDesc] = useState(null);
    const [category, setCategory] = useState();
    const [rating, setRating] = useState(null);
    const [image, setImage] = useState("not");
    const [TypeImg, setTypeImg] = useState([]);
    const [product, setProduct] = useState([]);
    const [id,setID]=useState()

    const pickerRef = useRef();
    function open() {
        pickerRef.current.focus();
    }
    function close() {
        pickerRef.current.blur();
    }
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
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();


    }, []);

    useEffect(() => {
        setrenderScreen(false)
    }, [renderScreen])

    useEffect(() => { 
        const unsubscribe = navigation.addListener('focus',async () => {//מאזין כל פעם שהוא נכנס לדף ומפעיל את הפונקציות הנבחרות
            let product = route.params.item
            console.log(111111111111111111111111)
            setID(product.ProductCode)
            console.log(`route.params`, route.params.item)
            setProduct(product)
            setName(product.Name)
            let p = JSON.stringify(product.Price)
            setPrice(p)
            let c = JSON.stringify(product.Calories)
            console.log(c)
            setCalorie(c)
            setDesc(product.Description)
            setCategory(product.Category)
            setRating(product.Rating)
            console.log(`image`, image)
        });
        return unsubscribe
    })

    const pickImage = async () => { // לוקחת תמונה מהגלריה 
        setModalVisible(!modalVisible);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });//שמירת התמונה כבייס64
            setImage(base64);
            let x = result.uri
            getTypeImg(x)
        }
    };
    const takeImage = async () => {// גישה לצילום תמונה ממצלמת המכשיר
        setModalVisible(!modalVisible);
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5
        })
        console.log(result)
        if (!result.cancelled) {
            const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });//שמירת התמונה כבייס64
            setImage(base64);
            let x = result.uri
            getTypeImg(x)
        }
    };
    const getTypeImg = (x) => {//בדיקת סוג התמונה
        let y = /[.]/.exec(x) ? /[^.]+$/.exec(x) : undefined
        setTypeImg(y)
    };
    const addProduct = async () => {
        if (checkDeitles()) {
            let product = {
                base64: image,
                imgType: TypeImg[0],
                nameImg: "product",
                Name: name,
                Price: price,
                Calories: calorie,
                Image: "",
                Description: desc,
                Category: category,
                Rating: rating,
                ProductCode:id
                

            }
            console.log(`product`, product)
            await fetch(`${ServerApi()}/api/UpdateProduct`, {
                method: 'POST',
                body: JSON.stringify(product),
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8'
                })
            })
                .then(res => {
                    return res.json()
                })
                .then((result) => {
                    console.log("fetch POST", JSON.stringify(result))
                    Alert.alert("ברכות", "המנה הועלתה לתפריט המסעדה בהצלחה")
                },
                    (error) => {
                        s
                        console.log("err POST=", error)
                        Alert.alert("אופס", "קרתה טעות בעת העלאת המנה אנא נסה שוב מאוחר יותר")
                    })
            console.log(`start`)

            setName("")
            setPrice("")
            setCalorie("")
            setDesc("")
            setCategory("")
            setRating("")
            setImage("")
            setTypeImg("")
            setrenderScreen(true)
        }
        else {
            return
        }

    }
    const checkDeitles = () => {
        if (name == null) {
            Alert.alert("אופס", "חסרים פרטים אנא השלם אותם ונסה שנית")
            setName('')
            return false
        }
        if (price == null || price <= 0 || isNaN(price)) {
            Alert.alert("אופס", "מחיר לא תקין")
            setPrice('')
            return false
        }
        if (calorie == null || calorie <= 0 || isNaN(calorie)) {
            Alert.alert("אופס", "קלוריות לא תקינות")
            setCalorie('')
            return false
        }
        if (category == undefined) {
            Alert.alert("אופס", "אנא בחר קטגוריה")
            return false
        }
        if (desc == null) {
            Alert.alert("אופס", "אנא הוסף תיאור מוצר")
            setDesc(null)
            return false
        }
        if (rating == null) {
            Alert.alert("אופס", "אנא בחר דירוג מנה")
            return false
        }
        else { return true }
    }

    return (
        <View style={{ backgroundColor: "#FFF", height: '100%' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Feather
                        name="menu"
                        size={30}
                        style={styles.menu}
                    />
                </TouchableOpacity>
                <Image
                    source={require('../assets/logos/1.png')}
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

            <View>
                <View style={{}}>
                    <Text style={styles.text_footer}>שם</Text>
                    <View style={styles.action}>
                        <MaterialIcons
                            name="fastfood"
                            color="black"
                            size={20}
                            style={{ paddingLeft: 10 }}
                        />
                        <TextInput
                            placeholder="הכנס שם..."
                            keyboardType="email-address"
                            style={styles.textInput}
                            // onChangeText={(text) => setName(text)}
                            onChangeText={setName}
                            value={name}
                        />
                    </View>
                </View>

                <View style={{ marginTop: 20, marginBottom: 20 }}>
                    <Text style={styles.text_footer}>מחיר</Text>
                    <View style={styles.action}>
                        <Ionicons
                            name="pricetag-outline"
                            color="black"
                            size={30}
                            style={{ paddingLeft: 10 }}
                        />
                        <TextInput
                            placeholder="...הכנס מחיר"
                            keyboardType='numeric'
                            style={[styles.textInput, { textAlign: 'right' }]}
                            onChangeText={setPrice}
                            value={price}


                        />
                    </View>
                </View>

                <View style={{ marginTop: 20, marginBottom: 20 }}>
                    <Text style={styles.text_footer}>קלוריות</Text>
                    <View style={styles.action}>
                        <MaterialCommunityIcons
                            name="fire"
                            color="black"
                            size={30}
                            style={{ paddingLeft: 10 }}
                        />
                        <TextInput
                            placeholder="...הכנס קלוריות"
                            keyboardType='numeric'
                            style={[styles.textInput, { textAlign: 'right' }]}
                            onChangeText={setCalorie}
                            value={calorie}

                        />
                    </View>
                </View>
                <View style={{ marginTop: 20, marginBottom: 20 }}>
                    <Text style={styles.text_footer}>תיאור המנה</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="pencil-square-o"
                            color="black"
                            size={30}
                            style={{ paddingLeft: 10 }}
                        />
                        <TextInput
                            placeholder="הכנס תיאור..."
                            style={styles.textInput}
                            onChangeText={setDesc}
                            value={desc}
                        />
                    </View>
                </View>
                <View style={{}}>
                    <Text style={[styles.text_footer,]}>קטגוריה</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                        <Picker
                            style={{
                                justifyContent: 'space-between', flex: 8, marginRight: 260
                            }}
                            ref={pickerRef}
                            selectedValue={category}
                            onValueChange={(itemValue, itemIndex) =>
                                setCategory(itemValue)
                            }>
                            <Picker.Item label="בחר" value="" />
                            <Picker.Item label="עוף" value="chicken" />
                            <Picker.Item label="בשר" value="meet" />
                            <Picker.Item label="דגים" value="fish" />
                        </Picker>
                    </View>

                </View>

                <View style={{}}>
                    <Text style={[styles.text_footer,]}>דירוג</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                        <Picker
                            style={{
                                justifyContent: 'space-between', flex: 8, marginRight: 260
                            }}
                            ref={pickerRef}
                            selectedValue={rating}
                            onValueChange={(itemValue, itemIndex) =>
                                setRating(itemValue)
                            }>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                        </Picker>
                    </View>

                </View>
                < TouchableOpacity onPress={() => { setModalVisible(!modalVisible); }}>
                    <View>
                        <LinearGradient
                            colors={['#EECCA4', '#F7C891']}
                            style={[styles.logina1, { flexDirection: 'row' }]}>
                            <FontAwesome
                                name="picture-o"
                                color="#9A7759"
                                size={30}
                                style={{ paddingLeft: 10 }}
                            />
                            <Text style={styles.textlogin}>הוסף תמונה</Text>
                        </LinearGradient >
                    </View>
                </TouchableOpacity >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ fontWeight: 'bold', fontSize: 24, color: "#9A7759", marginBottom: 20 }}>בחר אפשרות העלאה:</Text>
                            <View style={{ flexDirection: 'row' }}>
                                < TouchableOpacity onPress={pickImage}>
                                    <View>
                                        <LinearGradient
                                            colors={['#EECCA4', '#F7C891']}
                                            style={[styles.logina,]}>
                                            <Text style={styles.textlogin}>הוספה מגלריה</Text>
                                        </LinearGradient >
                                    </View>
                                </TouchableOpacity >
                                < TouchableOpacity onPress={() => { takeImage() }}>
                                    <View>
                                        <LinearGradient
                                            colors={['#EECCA4', '#F7C891']}
                                            style={[styles.logina, { marginLeft: 10 }]}>
                                            <Text style={styles.textlogin}>צילום תמונה</Text>
                                        </LinearGradient >
                                    </View>
                                </TouchableOpacity >
                            </View>
                            < TouchableOpacity onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                                <View>
                                    <LinearGradient
                                        colors={['#EECCA4', '#F7C891']}
                                        style={[styles.logina, { marginLeft: 10, marginTop: 25 }]}>
                                        <Text style={styles.textlogin}>הסתר חלון</Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity >

                        </View>

                    </View>
                </Modal>
                <TouchableOpacity onPress={() => { addProduct() }}>
                    <View style={[styles.button, { marginTop: 30, }]} >
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
                            <Text style={styles.textlogin}>          הוסף מנה לתפריט          </Text>
                        </LinearGradient >
                    </View>
                </TouchableOpacity>

            </View>


        </View >

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    action: {
        flexDirection: 'row',
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#949494',
        paddingBottom: 0,
        marginLeft: 30,
        marginRight: 30,
    },
    text_footer: {
        color: 'black',
        fontSize: 16,
        marginLeft: 25,
        fontWeight: "bold",
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
        justifyContent: 'flex-end'
    },
    logina: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,

    },
    logina1: {
        padding: 10,
        marginRight: '55%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        marginLeft: '5%'
    },

    textlogin: {
        fontWeight: 'bold', fontSize: 15, color: "#9A7759",
    },
    modalView: {
        justifyContent: 'space-between',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginTop: '50%',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 10,
        padding: 10,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontWeight: 'bold', fontSize: 17, color: "#9A7759"
    },

})


