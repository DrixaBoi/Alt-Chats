import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
    
    constructor() {
        super();
        this.state = {
// the message: [], state below is the start of the process of being able to send, receive, and display messages
            messages: [],
        }
    };

    componentDidMount() {
        /* passes the name defined on Start to Chat */
        let name = this.props.route.params.name;
        /* sets the title of Chat to the name input from Start */
        this.props.navigation.setOptions({ title: name });

        this.setState({
            messages: [
                { // each message required an ID, a creation date, and user object
                    _id:1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                  // user object also required a user ID, name, and avatar      
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                // Creates a system message, a little messaged centered in the chat window, not in a bubble
                    _id: 2,
                    text: name + ' has entered chat',
                    createdAt: new Date(),
                    system: true,
                },
            ]
        })
    }

/* the message a user has just sent gets appended to the state messages so that it can be displayed in the chat.*/
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
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