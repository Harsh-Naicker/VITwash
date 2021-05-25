import React, {useState, useEffect} from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
// import {auth, firestore} from '../firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux'
import {setSlot, setDate, setTokens} from '../store/action'

const ConfirmSlot = ({navigation}) => {
    const userstore = useSelector(state => state);
    const dispatch = useDispatch();
    const [number, setNumber]=useState(0)
    // const [number, setNumber]=useState(null)
    // const [bookings, setBookings] = useState([])
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
     }, []);
    const book = async () => {
        
        await firestore().collection('users').doc(userstore.user.uid).collection('bookings').doc(userstore.date).set({
            slot: userstore.slot
          })
        
        let latest=userstore.slot
        latest=latest[latest.length-1]
        // await firestore().collection('bookings').doc(userstore.date).collection('slots').doc(latest).set({
        //     user: userstore.user.uid
        //   })
        
        await firestore().collection('bookings').doc(userstore.date).collection('slots').doc(latest).set({
            user: userstore.user.displayName,
            phone: number
          })
        await firestore().collection('users').doc(userstore.user.uid).set({
            tokens: userstore.tokens-1,
            contact: number
          })
        dispatch(setTokens(-1))
        // dispatch(setSlot('NA'))
        // dispatch(setDate(''))
        navigation.navigate('TabStack', {screen: 'Home'})
        
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>VITWASH</Text>
            <Text style={styles.chosenSlot}>SLOT CHOSEN: {userstore.slot[userstore.slot.length -1]}</Text>
            <Text style={styles.tokenHeading}>TOKENS</Text>
            <Text style={styles.beforeConfirmation}>BEFORE CONFIRMATION</Text>
            <Text style={styles.beforeConfirmationTokens}>{userstore.tokens}</Text>
            <Text style={styles.afterConfirmation}>AFTER CONFIRMATION</Text>
            <Text style={styles.afterConfirmationTokens}>{userstore.tokens -1 }</Text>
            <View
                    style={{
                        top: 450,
                        borderBottomColor: 'grey',
                        borderBottomWidth: 1,
                        width: '80%',
                        alignSelf: 'center'
                    }}
            />
            <View style={{position: 'absolute',top: 470, width: '60%', alignSelf: 'center'}}>
                <Button onPress={book} title='CONFIRM' color="#53a20e">Confirm</Button>
            </View>
            <View style={{position: 'absolute',top: 520,width: '60%', alignSelf: 'center'}}>
                <Button mode="contained" onPress={() => navigation.navigate('SlotBooking')} title='CANCEL' color="grey">Cancel</Button>
            </View>
        </View>
    )
}

export default ConfirmSlot

const styles=StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 80,
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
    },
    chosenSlot: {
        position: 'absolute',
        top: 200,
        color: '#53a20e',
        fontSize: 20,
        fontWeight: '900',
        alignSelf: 'center'
    },
    tokenHeading: {
        position: 'absolute',
        top: 320,
        color: '#214005',
        fontSize: 18,
        fontWeight: '800',
        alignSelf: 'center'
    },
    beforeConfirmation: {
        position: 'absolute',
        top: 370,
        color: '#53a20e',
        fontSize: 15,
        fontWeight: '800',
        left: 60
    },
    beforeConfirmationTokens: {
        position: 'absolute',
        top: 370,
        color: '#214005',
        fontSize: 15,
        fontWeight: '800',
        left: 320
    },
    afterConfirmation: {
        position: 'absolute',
        top: 420,
        color: '#53a20e',
        fontSize: 15,
        fontWeight: '800',
        left: 60
    },
    afterConfirmationTokens: {
        position: 'absolute',
        top: 420,
        color: '#214005',
        fontSize: 15,
        fontWeight: '800',
        left: 320
    },
})
