import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {auth, firestore()} from './firebase'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Provider} from'react-redux'
import store from './store/store'
import {setUser, setTokens, retrieveTokens, setDate, setSlot, addBookedSlot, retrieveContact} from './store/action'

import Home from './screens/Home'
import CurrentWashes from './screens/CurrentWashes'
import Account from './screens/Account'
import Chats from './screens/Chats'
import Login from './screens/Login'
import OnboardingScreen from './screens/OnboardingScreen.js'
import AddTokens from './screens/AddTokens'
import SlotBooking from './screens/SlotBooking'
import ConfirmSlot from './screens/ConfirmSlot'


// const Tab = createMaterialBottomTabNavigator();
const Tab = createBottomTabNavigator()
const Stack = createStackNavigator();


const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null)
  
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail]=useState('guest')
  const [currDate, setCurrDate]=useState('')

  async function onAuthStateChanged(user) {
    if(user!==null){
      console.log('The current user is',user.email)
      setEmail(user.email)
      store.dispatch(setUser(user))
      try{
        await firestore()
          .collection('users')
          .doc(user.uid)
          .get()
          .then(snapshot =>{
            const userdata=snapshot.data()["tokens"]
            console.log("Tokens updated")
            store.dispatch(retrieveTokens(userdata))
          })
          .catch(e =>{
            store.dispatch(retrieveTokens(0))
          })
        
        await firestore()
          .collection('users')
          .doc(user.uid)
          .get()
          .then(snapshot =>{
            const userdata=snapshot.data()["contact"]
            console.log("Contact retrieved")
            store.dispatch(retrieveContact(userdata))
          })
          .catch(e =>{
            console.log('Contact not retrieved')
            store.dispatch(retrieveContact(0))
          })

        await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('bookings')
          .doc(currDate)
          .get()
          .then(snapshot =>{
            console.log('User slot updated in App.js')
            store.dispatch(setSlot(snapshot.data()["slot"]))
          })
          .catch(e => store.dispatch(setSlot([])))
        
        // firestore()
        //   .collection('bookings')
        //   .doc(currDate)
        //   .collection('slots')
        //   .onSnapshot((snapshot) => {
        //     snapshot.forEach((doc) => {
        //       console.log('Booked Slot Updated')
        //       store.dispatch(addBookedSlot(doc.id))
        //     })
        //   })
        //   .catch(e => console.log('Bookings updating failed'))
        await firestore()
          .collection('bookings')
          .doc(currDate)
          .collection('slots')
          .get()
          .then(snapshot =>{
              snapshot.forEach((doc) => {
                console.log('Current washes Slot Updated', doc.id)
                store.dispatch(addBookedSlot(doc.id))
              })
          })
          .catch(e => {console.log('Bookings updating failed')})
          
      } catch (e) {
        // alert(e)
        console.log("The error is",e)
        store.dispatch(retrieveTokens(0))
      }
    } else {
      console.log('The user is logged out, using app as a guest user')
      setEmail('guest')
      store.dispatch(setUser({uid: 'guest', email: 'guest'}))
    }
    
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    
    let isMounted=true
    if(isMounted) {
      AsyncStorage.getItem('alreadyLaunched').then(value => {
        if(value==null) {
          AsyncStorage.setItem('alreadyLaunched','true')
          setIsFirstLaunch(true)
        } else {
          setIsFirstLaunch(false)
        }
      })
      let today=new Date()
      var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()
      store.dispatch(setDate(date))
      setCurrDate(date)

      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; 

    }
    return () => { isMounted = false }
  }, [])

  function TabStack() {
    return (
        <Tab.Navigator
          initialRouteName="HOME"
          tabBarOptions={{
            //activeTintColor: '#f0edf6',
            activeTintColor: 'white',
            // inactiveTintColor: '#0f5c71',
            inactiveTintColor: '#214005',
            style:{
              // backgroundColor: '#1687a7'
              backgroundColor: '#53a20e'
            }
          }}
          // activeColor="#f0edf6"
          // inactiveColor="#0f5c71"
          // barStyle={{ backgroundColor: '#1687a7' }}
        >
          <Tab.Screen 
            name="HOME" 
            component={Home}
            options={{
              tabBarLabel: 'HOME',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="CURRENT WASHES"
            component={CurrentWashes}
            options={{
              tabBarLabel: 'WASHES',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="washing-machine" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="CHATS"
            component={Chats}
            options={{
              tabBarLabel: 'CHATS',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="message" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="ACCOUNT"
            component={Account}
            options={{
              tabBarLabel: 'ACCOUNT',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="account" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
    
    )
  }

  if (initializing) return null;

  if(isFirstLaunch === null) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isFirstLaunch === true ? (
          <Stack.Navigator headerMode={false}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen}/>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="TabStack" component={TabStack} />
            <Stack.Screen name="AddTokens" component={AddTokens} />
            <Stack.Screen name="SlotBooking" component={SlotBooking} />
            <Stack.Screen name="ConfirmSlot" component={ConfirmSlot} />
          </Stack.Navigator>
          ):(
            <Stack.Navigator initialRouteName={email !=='guest'? "TabStack":"Login"} headerMode={false}>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="TabStack" component={TabStack} />
              <Stack.Screen name="AddTokens" component={AddTokens} />
              <Stack.Screen name="SlotBooking" component={SlotBooking} />
              <Stack.Screen name="ConfirmSlot" component={ConfirmSlot} />
            </Stack.Navigator>
        )}

      </NavigationContainer>
    </Provider>
    
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1687a7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
