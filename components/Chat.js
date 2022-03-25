import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

//import firebase and firestore
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    
    constructor() {
        super();
        this.state = {
// the message: [], state below is the start of the process of being able to send, receive, and display messages
            messages: [],
            _id: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
        };

        if (!firebase.apps.length) {
            firebase.initializeApp({
            apiKey: "AIzaSyChLRAbXvQENdL4AajHFHfy5TamYXXNMWk",
            authDomain: "alt-chat-6c58a.firebaseapp.com",
            projectId: "alt-chat-6c58a",
            storageBucket: "alt-chat-6c58a.appspot.com",
            messagingSenderId: "970155524335",
            appId: "1:970155524335:web:f20a7b13bbaa493012db1a",
            measurementId: "G-GPDV2NX5NX"
            });
        }

        this.referenceChatMessages = firebase.firestore().collection('messages');
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
            });
        });
        //which is then rendered in the app by the setState() funtion
        this.setState({
            messages: messages,
        });
    };

    componentDidMount() {
        /* passes the name defined on Start to Chat */
        let name = this.props.route.params.name;
        /* sets the title of Chat to the name input from Start */
        this.props.navigation.setOptions({ title: name });

        // authenticating the use of users being able to sign in anonymously
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                _id: user._id,
                messages: [],
            });
            this.unsubscribe = this.referenceChatMessages
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onCollectionUpdate);
        });
    }


    // stop listening to authenticate and collection changes 
    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribe();
    }

    // added addMessages function to use the Firestore add() method to save message object to firestore
    addMessages() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || "",
        });
    }

/* the message a user has just sent gets appended to the state messages so that it can be displayed in the chat.*/
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
        () => {
            //saves messages sent to the chat
            this.addMessages();
            this.saveMessages();
        }
    );
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
        )
    }

    render() {
        /* passes the color defined on Start menu */
        let { bgColor } = this.props.route.params;

        return (
            <View style={{flex: 1, backgroundColor: bgColor}}>
{/* This renders the chat interface, using the above onSend to link sent messages*/}
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
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