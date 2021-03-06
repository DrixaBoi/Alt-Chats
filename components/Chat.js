import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import firebase from 'firebase/compat/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';



const firebaseConfig = {
    // firebase configuration
        apiKey: "AIzaSyChLRAbXvQENdL4AajHFHfy5TamYXXNMWk",
        authDomain: "alt-chat-6c58a.firebaseapp.com",
        projectId: "alt-chat-6c58a",
        storageBucket: "alt-chat-6c58a.appspot.com",
        messagingSenderId: "970155524335",
        appId: "1:970155524335:web:f20a7b13bbaa493012db1a",
        measurementId: "G-GPDV2NX5NX"
        };

export default class Chat extends React.Component {
    
    constructor() {
        super();
        this.state = {
// the message: [], state below is the start of the process of being able to send, receive, and display messages
            messages: [],
            isConnected: false,
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
            image: null,
            location: null,
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.referenceChatMessages = firebase.firestore().collection('messages');
        this.refMsgsUser = null;

        // removes warnings from the console
        LogBox.ignoreLogs([
            'Setting a timer',
            'Warning: ...',
        ]);
    }
// the onCollectionsUpdate function takes the object querySnapshot as its argument
// then loops over all the documents inside of querySnapshot
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        //goes through each doc - this is done with a forEach loop
        querySnapshot.forEach((doc) => {
            //the queryDocumentSnapshot's data
            var data = doc.data();
            //within the loop each field in each document is saved into the lists object
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar,
                },
                image: data.image || null,
                locations: data.location || null,
            });
        });
        //which is then rendered in the app by the setState() funtion
        this.setState({
            messages: messages,
        });
        this.saveMessages();
    }

    // gets messages from asyncStorage when offline
    async getMessages() {
        let messages = '';
        try {
            // use getItem to read messages in storage
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                //converting string back into an object
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {
        /* passes the name defined on Start to Chat */
        let name = this.props.route.params.name;
        /* sets the title of Chat to the name input from Start */
        this.props.navigation.setOptions({ title: name });

        //find out the users connection status using the fetch() method
        NetInfo.fetch().then(connection => {
            //which will return a promise such as online or offline
            if (connection.isConnected) {
                //user is online
                this.setState({ isConnected: true });
                console.log('online');
            

                // authenticating the use of users being able to sign in anonymously
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        await firebase.auth().signInAnonymously();
                    }
                    
                        // user needs an _id and name
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: "https://placeimg.com/140/140/any"
                        }
                    });
                    
                    this.refMsgsUser = firebase
                        .firestore()
                        .collection('messages')
                        .where('uid', '==', this.state.uid);
                    
                    this.unsubscribe = this.referenceChatMessages
                        .orderBy('createdAt', 'desc')
                        .onSnapshot(this.onCollectionUpdate);    
                });

            //so users can save messages to AsyncStorage
            this.saveMessages();

            } else {
                //user is offline
                this.setState({ isConnected: false });
                console.log('offline');
                //so users only get messages from AsyncStorage
                this.getMessages();
            }
        });
    }


    // stop listening to authenticate and collection changes 
    componentWillUnmount() {
        if (this.state.isConnected) {
            this.authUnsubscribe();
            this.unsubscribe();
        }    
    }

    // added addMessages function to use the Firestore add() method to save message object to firestore
    addMessages() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || null,
            location: message.location || null,
        });
    }

/* the message a user has just sent gets appended to the state messages so that it can be displayed in the chat.*/
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
        () => {
            // messages sent to the chat
            this.addMessages();
            //messages stored when added to the state object messages
            this.saveMessages();
        });
    }


// The altered Bubble component is returned from GiftedChat    
    renderBubble(props) {
        return (
            <Bubble
            // Inheriting props with the '...props' keyword
                {...props}
                // Then given a new wrapperStyle
                wrapperStyle={{
                    // Choose left or right speech bubbles
                    right: {
                        // Then given a new background color
                        backgroundColor: '#586EFB'
                    },
                    left: {
                        backgroundColor: '#C2FCDB'
                    }
                }}
            />    
        );
    }

    //this will remove the text input bar if the user is offline
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
         //otherwise if they are online it will keep it visible   
         } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }    
    }

    // This will return a mapview when a location is added to a message
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{ 
                        width: 150, 
                        height: 100, 
                        borderRadius: 13, 
                        margin: 3 
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    // this adds an action button to communication features with an action sheet
    renderCustomActions(props) {
        return <CustomActions {...props} />;
    }

    render() {
        /* passes the color defined on Start menu */
        const { bgColor } = this.props.route.params;
        const { user } = this.state;

        return (
            <View style={{flex: 1, backgroundColor: bgColor}}>
{/* This renders the chat interface, using the above onSend to link sent messages*/}
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    isConnected={this.state.isConnected}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    onSend={messages => this.onSend(messages)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    user={{
                        _id: user._id,
                        name: user.name,
                        avatar: user.avatar
                    }}
                />

{/* This screen doesn't necessarily need a Button for Start since the user could use their back arrow */}
                {/* <Button
                    title='Back to Start'
                    onPress={() => this.props.navigation.navigate('Start')}
                />     */}

{/* fixes an issue with older android models hiding that text bar as you type your message to view before sending */}                
                { Platform.OS === 'android' ?
                    <KeyboardAvoidingView behavior='height' />
                    : null }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
    }
});