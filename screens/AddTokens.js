import React, {useState, useEffect} from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native'
// import {auth} from '../firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux'
import {setUser, setAmount, setBasket, setTokens} from '../store/action'
import RazorpayCheckout from 'react-native-razorpay';

const AddTokens = ({navigation}) => {
    const userstore = useSelector(state => state);
    const dispatch = useDispatch();

    const [bask, setBask] = useState(0)
    const [username, setUsername] = useState('guest')
    const [tokenFocus, setTokenFocus] = useState(false)
    const [number, setNumber]=useState(0)


    useEffect(async() => {
        await firestore()
          .collection('users')
          .doc(userstore.user.uid)
          .get()
          .then(snapshot =>{
            const userdata=snapshot.data()["contact"]
            setNumber(userdata)
          })
          .catch(e =>{
            console.log('User number not retrieved in add tokens')
          })
        setUsername(userstore.user.email)
     }, []);

    // const moveToPayment = () => {
    //     dispatch(setAmount(bask*100))
    //     navigation.navigate('CardForm')
    // }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>VITWASH</Text>
            <View style={styles.loginform}>
                
                <Text style={{color: '#53a20e',paddingBottom:2}}>{tokenFocus? 'NUMBER OF TOKENS':''}</Text>
                        <TextInput 
                            onChangeText={n => setBask(n)}
                            style={tokenFocus? styles.focussedTextInput:styles.textinput}
                            value={bask}
                            placeholder={tokenFocus? '':'NUMBER OF TOKENS'}
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onFocus={()=> setTokenFocus(true)}
                            onBlur={()=>setTokenFocus(false)}
                            selectionColor='#53a20e'
                        />
            </View>
            <Text style={styles.tokenHeading}>TOKENS</Text>
            <Text style={styles.beforePayment}>BEFORE PAYMENT</Text>
            <Text style={styles.beforePaymentTokens}>{userstore.tokens}</Text>
            <Text style={styles.afterPayment}>AFTER PAYMENT</Text>
            <Text style={styles.afterPaymentTokens}>{bask? parseInt(userstore.tokens)+parseInt(bask):userstore.tokens}</Text>
            <View
                    style={{
                        top: 60,
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1,
                        width: '80%',
                        alignSelf: 'center'
                    }}
            />
            <Text style={styles.amount}>BILL TOTAL</Text>
            <Text style={styles.amountNumber}>₹{bask*100}</Text>
            {/* <Button mode="contained" onPress={moveToPayment} style={{marginBottom: 10}} title='Move to payment'></Button> */}
            <TouchableOpacity style={styles.makePayment} onPress={() => {
                    var options = {
                    description: 'TOKEN PURCHASE',
                    image: 'https://i.imgur.com/3g7nmJC.png',
                    currency: 'INR',
                    key: 'rzp_test_31jKYIJByIbOAo',
                    amount: (bask*10000).toString(),
                    name: 'VITWASH',
                    //order_id: 'order_DslnoIgkIDL8Zt',//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
                    prefill: {
                        email: userstore.user.email,
                        contact: number,
                        name: userstore.user.displayName
                    },
                    theme: {color: '#53a20e'}
                    }
                    RazorpayCheckout.open(options).then(async (data) => {
                    // handle success
                        alert(`Success: ${data.razorpay_payment_id}`);
                        console.log('The amount is', bask*100)
                        dispatch(setTokens(parseInt(bask)))
                        await firestore().collection('users').doc(userstore.user.uid).collection('transactions').doc(data.razorpay_payment_id).set({
                            basket: parseInt(bask),
                            amount: bask*100,
                            timestamp: new Date()
                        })

                        await firestore().collection('users').doc(userstore.user.uid).set({
                            tokens: parseInt(userstore.tokens)+parseInt(bask),
                            contact: number
                        })

            
                        // dispatch(setBasket(0))
                        dispatch(setAmount(0))
                        navigation.replace('TabStack', {screen: 'Home'})
                    }).catch((error) => {
                        // handle failure
                        alert(`Error: ${error.code} | ${error.description}`);
                    });
            }}>
                <View style={styles.rectangle}>
                    <Text style={styles.rectangleText}>PAY NOW</Text>
                </View>
                    
            </TouchableOpacity>
        </View>
    )
}

export default AddTokens

const styles=StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center'
    },
    loginform: {
        alignSelf: 'center',
        // alignItems: 'center',
        // justifyContent: 'center',
        width: '70%',
        position: 'absolute',
        top: 180,
        // left: 0,
        // right: 0,
        // bottom: 0
    },
    textinput: {
        // borderRadius: 10,
        // color: 'white',
        marginBottom: 30, 
        color: 'grey',
        fontSize: 17, 
        padding: 5,
        // paddingBottom: 20,
        borderBottomWidth: 1.2, 
        borderColor: 'grey',
        height: 30
    },
    focussedTextInput: {
        marginBottom: 20, 
        color: 'grey',
        fontSize: 17, 
        padding: 5, 
        borderBottomWidth: 1.2,
        borderColor: '#53a20e'
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 40,
        textAlign: 'center',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        // paddingLeft: 10,
        // marginTop: 10
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
        // marginTop: 60,
        color: '#53a20e',
        position: 'absolute',
        top: 60,
        bottom: 0,
        left: 0,
        right: 0,
        alignSelf: 'center'
        // fontFamily: 'SourceSerifPro-Regular'
    },
    amount: {
        fontWeight: '900',
        fontSize: 20,
        // textAlign: 'center',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 500,
        left: 60,
        right: 0,
        bottom: 0,
        color: '#53a20e'
        // paddingLeft: 10,
        // marginTop: 10
    },
    amountNumber:{
        fontWeight: '900',
        fontSize: 30,
        // textAlign: 'center',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 500,
        left: 265,
        right: 0,
        bottom: 0,
        color: '#214005'
    },
    tokenHeading: {
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
        // marginTop: 60,
        color: '#214005',
        position: 'absolute',
        top: 300,
        bottom: 0,
        left: 0,
        right: 0,
        alignSelf: 'center'
    },
    beforePayment: {
        fontSize: 20,
        fontWeight: '900',
        // textAlign: 'center',
        // marginTop: 60,
        color: '#53a20e',
        position: 'absolute',
        top: 370,
        bottom: 0,
        left: 60,
        right: 0,
        // alignSelf: 'center'
    },
    afterPayment: {
        fontSize: 20,
        fontWeight: '900',
        // textAlign: 'center',
        // marginTop: 60,
        color: '#53a20e',
        position: 'absolute',
        top: 420,
        bottom: 0,
        left: 60,
        right: 0,
        // alignSelf: 'center'
    },
    beforePaymentTokens: {
        fontSize: 20,
        fontWeight: '900',
        // textAlign: 'center',
        // marginTop: 60,
        color: '#214005',
        position: 'absolute',
        top: 370,
        bottom: 0,
        left: 320,
        right: 0,
    },
    afterPaymentTokens: {
        fontSize: 20,
        fontWeight: '900',
        // textAlign: 'center',
        // marginTop: 60,
        color: '#214005',
        position: 'absolute',
        top: 420,
        bottom: 0,
        left: 320,
        right: 0,
    },
    makePayment: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 550,
        left: 0,
        right: 0,
        bottom: 0,
        color: '#53a20e'
    },
    paymentText: {
        borderWidth: 2,
        fontSize: 15,
        padding: 5,
        borderColor: '#53a20e',
        fontWeight: '900',
        color: '#214005',
        borderRadius: 20,
        backgroundColor: '#53a20e'
    },
    rectangle: {
        width: 120,
        height: 60,
        backgroundColor: "#53a20e",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
        borderWidth: 1,
        borderColor: '#53a20e',
        borderRadius: 30
    },
    rectangleText: {
        color:'white',
        fontSize: 17,
        fontWeight: '500'
    }
})