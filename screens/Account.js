import React,{useState, useEffect} from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux'
import {setUser} from '../store/action'
import { useIsFocused } from "@react-navigation/native";

const Account = ({navigation}) => {
    const userstore = useSelector(state => state);
    const dispatch = useDispatch();
    const [username, setUsername]=useState('guest')
    const [number, setNumber]=useState('')
    const isFocused = useIsFocused();
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
        
        setUsername(userstore.user.displayName)
     }, [isFocused]);
    
    const logOut = async () => {
        await auth().signOut()
        alert('Logged out')

        dispatch(setUser({ uid: 'guest', email: 'guest' }))
        // navigation.navigate('InitialStack', {screen: 'Login'})
        navigation.dangerouslyGetParent().replace('Login')
        
        setUsername('guest')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>VITWASH</Text>
            {username === 'guest' ? (
                <Text>Welcome, Guest</Text>
            ):(
                <View>
                    <Text style={{color:'#53a20e', fontSize: 16, fontWeight: '900'}}>{username}</Text>
                    <Text style={{color:'#53a20e', fontSize: 16, fontWeight: '900'}}>{number}</Text>
                </View>
                
            )}

            <View style={{marginTop: 10, width: '60%'}}>
                <Button onPress={logOut} title="Logout">Logout</Button>
            </View>
            
    </View>
    )
}

export default Account

const styles= StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        color: '#333333'
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
        // marginTop: 60,
        // color: '#1687a7',
        color: '#53a20e',
        position: 'absolute',
        top: 60,
        bottom: 0,
        left: 0,
        right: 0,
        alignSelf: 'center'
        // fontFamily: 'SourceSerifPro-Regular'
    },
})
