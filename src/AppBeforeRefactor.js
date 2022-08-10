import React from "react";
import { onChildAdded, push, ref, set, update } from "firebase/database";
import { database, storage , auth } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import { uploadBytes, ref as storageReference, getDownloadURL} from "firebase/storage" ;
import Comments from './Comments.js';
import Registration from './Registration.js'
import { createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut} from "firebase/auth";


// // Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      input:"",
      imageFile:"",
      imageName:"",
      url:"",
      count:0,
      comment:"",
      showRegistration:true
    };

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

// onChildChanged(messagesRef, (data)=>{
//   this.setState((state) => ({
//         // Store message key so we can use it as a key in our list items when rendering messages
//         messages: [...state.messages, { key: data.key, val: data.val()}],
//       }));
// })

  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const date= new Date().toLocaleString();
    const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
    const newMessageRef = push(messageListRef);
    //use filter with "" or use conditional
    set(newMessageRef, {date: date, message:this.state.input, url:url, count:0,comments:[]});
    console.log(this.state.messages)
    this.setState({
      input:"",
      imageName:"",
      imageFile:""
    })
  };

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


    //the syntax is update(ref(database), {[foldername/messagekey]:{objects and keys of the message}} ; other ways wont work
    //if u dont update the state, it wont show up on the page, need to refresh, but database is updated
update(ref(database),{[`${MESSAGE_FOLDER_NAME}/${message.key}`]:newMessage}); }
//wrong syntax from stack overflow :-) 
// update(ref(database),{[``]}
    //   date:message.val.date,
    //   message:message.val.message,
    //   url:message.val.url,
    //   count:message.val.count+1
    // })

 

  handleChange= (e)=>{
    this.setState({
      input:e.target.value
    })
  }

  changeImage=(e)=>{
    console.log(e.target)
    this.setState({
      imageFile:e.target.files[0],
      imageName:e.target.value
    })
  }

  uploadImage=(e)=>{
    e.preventDefault();
    console.log(this.state.imageUpload)
    const storageRef = storageReference(storage, `images/${this.state.imageFile.name}`);
 uploadBytes(storageRef, this.state.imageFile).then((snapshot)=>{console.log(snapshot);
return getDownloadURL(storageRef)}).then((url)=>{this.setState({url:url})
this.writeData(url)});
}

signup = (e,email,password)=>{
  e.preventDefault();
  createUserWithEmailAndPassword(auth,email,password).then(console.log("signup!"))
}

login = (e,email,password)=>{
  e.preventDefault();
  signInWithEmailAndPassword(auth,email,password).then(()=>{
   this.setState({
    showRegistration:false
   })
    console.log("login!")
  })}

  logout = (e) => {
    e.preventDefault();
    signOut(auth).then(()=>this.setState({
      showRegistration:true
    }))
  }



  render() {

    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message,i) => (
      <li key={message.key}>{message.val.date}: "{message.val.message}"
      <img className="img" src={message.val.url} alt={this.state.fileName}/>
      <p>likes:{message.val.count}</p>
      <button onClick={(e)=>{this.like(message,i)}}>Like</button>
     <Comments message={message} comment={(comment)=>this.comment(message,i,comment)}/>
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
    {this.state.showRegistration ? < Registration login={this.login} signup={this.signup} /> :
        <div>
<input type="text" value={this.state.input} onChange={this.handleChange}/> 
<input type="file" value={this.state.imageName} onChange={(e)=>this.changeImage(e)}/>
<button onClick={this.uploadImage}>Upload Image</button>
          <ul>{messageListItems}</ul>
          <button type="submit" onClick={this.logout}>Logout</button>
 </div> 
          }
        </header>
      </div>
    );
  }
}

export default App;

