import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native'
import moment from 'moment'
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux'
import {addSlot, setDate} from '../store/action'

const SlotBooking = ({navigation}) => {
    const userstore = useSelector(state => state);
    const dispatch = useDispatch();

    const [timeSlots, setTimeSlots]=useState([])
    const [next, setNext]=useState('')
    const [currDate, setCurrDate]=useState('')
    const [unavailable, setUnavailable]=useState([])
    const createTimeSlots = (fromTime, toTime) => {
        let startTime = moment(fromTime, 'hh:mm A')
        let endTime = moment(toTime, 'hh:mm A')
        if(endTime.isBefore(startTime)) {
            endTime.add(1, 'day')
        }
        let arr=[]
        // let nextArr=[]
        while (startTime <= endTime) {
            arr.push(new moment(startTime).format('hh:mm A'))
            
            startTime.add(40, 'minutes')
        }
        // setNext(nextArr)
        return arr
    }
    useEffect(async () => {
        let slots=[]
        await firestore()
          .collection('bookings')
          .doc(userstore.date)
          .collection('slots')
          .get()
          .then(snapshot =>{
              snapshot.forEach((doc) => {
                console.log('Current washes Slot Updated', doc.id)
                // store.dispatch(addBookedSlot(doc.id))
                // setUnavailable([...unavailable, doc.id])
                slots.push(doc.id)
              })
          })
          .catch(e => {console.log('Bookings updating failed')})
          
          setUnavailable(slots)
          setTimeSlots(createTimeSlots('6:00 AM','11:00 PM'))
    },[])

    const confirmSlot = (item) => {
        // dispatch(setDate(currDate))
        dispatch(addSlot(item))
        navigation.navigate('ConfirmSlot')
    }

    if(userstore.tokens>0){
        return (
            <View style={styles.container}>
                <Text style={styles.headerTitle}>VITWASH</Text>
                <Text style={styles.date}>SLOTS FOR {userstore.date}</Text>
                <ScrollView style={styles.scrollView}>
                <Button onPress={() => navigation.navigate('TabStack',{screen: 'Home'})} title="Go back">Go back</Button>
                        {timeSlots.map((item, index) => (
                            
                            <TouchableOpacity style={unavailable.includes(item)? styles.disabledButton: styles.button} disabled={unavailable.includes(item)? true: false} onPress={() => confirmSlot(item)} key={index}>
                                <Text style={styles.slotText}>{item} : 35 minutes</Text>
                            </TouchableOpacity>
                        ))}
                        
                    
                </ScrollView>
            </View>
            
        )
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.headerTitle}>VITWASH</Text>
                <ScrollView style={styles.scrollView}>
                        {/* <Text style={{marginTop: 20, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>SLOTS FOR {currDate}</Text> */}
                        <Text style={{textAlign: 'center', fontSize: 15}}>No tokens available, buy tokens to view booking slots</Text>
                        <Button onPress={() => navigation.navigate('TabStack',{screen: 'Home'})} title="Go back">Go back</Button>
                </ScrollView>
            </View>
            
        )
    }
    
    
}

export default SlotBooking

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#1687a7',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#53a20e",
        padding: 10,
        marginBottom: 8,
        width: '60%',
        borderRadius: 10,
        alignSelf: 'center',
        // color: '#53a20e'
    },
    disabledButton: {
        alignItems: "center",
        backgroundColor: "grey",
        padding: 10,
        marginBottom: 8,
        width: '60%',
        borderRadius: 10,
        color:'blue',
        alignSelf: 'center'
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
    scrollView: {
        // position: 'absolute',
        top: 140,
        left: 0,
        right: 0,
        bottom: 0,
    },
    date: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        // marginTop: 60,
        color: '#53a20e',
        position: 'absolute',
        top: 100,
        bottom: 0,
        left: 0,
        right: 0,
        alignSelf: 'center'
    },
    slotText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '800'
    }
})
