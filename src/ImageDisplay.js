import React from 'react';
import { onChildAdded, push, ref, set, update } from "firebase/database";
import { database, storage } from "./firebase";
import Comments from './Comments.js';
// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

export default class ImageUpload extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],}
  }

   componentDidMount() {
    const messagesRef = ref(database, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val()}],
      }));
    });
  }

  like = (message,i)=>{
    console.log("like!")
    // this will overwrite everything
    // set(newMessageRef, {count:e.target.value+1});
    // but update() will add on to existing data
    const newMessage=
     { date:message.val.date,
      message:message.val.message,
      url:message.val.url,
      comments:message.val.comments,
      count:message.val.count+=1}

      //create a new array referencing the state of messages
    const newMessageArray=this.state.messages;
   
    //replace the particular message with the new count changed
    newMessageArray[i].val=newMessage;

    this.setState({
      messages:newMessageArray
    })
    update(ref(database),{[`${MESSAGE_FOLDER_NAME}/${message.key}`]:newMessage}); }

 comment=(message,i,comment)=>{
    //conditional rendering if it exist or not
    if (message.val.comments) {
      const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
      const updates = {};
      console.log(message.val.comments,"message.val.comments")
      //add new object inside array
      let newData = {
        date: message.val.date,
        url: message.val.url,
       count:message.val.count,
        message: message.val.message,
        //add to existing comments
        comments: [
          ...message.val.comments, comment
        ],
      };

      updates[message.key] = newData;
      update(messageListRef, updates).then(() => {
        console.log("comment added!");
      });
      //update state here
      let newArray = this.state.messages;
      newArray[i].val = newData;
      this.setState({ messages: newArray });
    }

else {
  const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
      const updates = {};
      console.log("start comments")
      //add new object inside array
      let newData = {
        date: message.val.date,
        url: message.val.url,
       count:message.val.count,
        message: message.val.message,
        //initialising the comment
        comments: [comment],
      };

      updates[message.key] = newData;
      update(messageListRef, updates).then(() => {
       
       console.log("comment added!");
      });
      //update state here
      let newArray = this.state.messages;
      newArray[i].val = newData;
      this.setState({ messages: newArray });}

  };


  render(){
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message,i) => (
      <li key={message.key}>{message.val.date}: "{message.val.message}"
      <img className="img" src={message.val.url} alt={this.state.fileName}/>
      <p>likes:{message.val.count}</p>
      <button onClick={(e)=>{this.like(message,i)}}>Like</button>
     <Comments message={message} comment={(comment)=>this.comment(message,i,comment)}/>
      </li>))
    return(
   <div><ul>{messageListItems}</ul>
          <button type="submit" onClick={this.props.logout}>Logout</button>
          </div>
    )
  }
}