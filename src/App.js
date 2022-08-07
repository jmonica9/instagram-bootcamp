import React from "react";
import { onChildAdded, push, ref, set, update } from "firebase/database";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import { uploadBytes, ref as storageReference, getDownloadURL} from "firebase/storage" ;

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
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
      count:0
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
console.log(this.state.messages)

  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const date= new Date().toLocaleString();
    const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {date: date, message:this.state.input, url:url, count:0});
    console.log(this.state.messages)
    this.setState({
      input:"",
      imageName:"",
      imageFile:""
    })
  };

  like = (message,i)=>{
    console.log("like!")
    const messageListRef = ref(database, `${MESSAGE_FOLDER_NAME}/${message.key}`);
 ;
    // this will overwrite everything
    // set(newMessageRef, {count:e.target.value+1});
    // but update() will add on to existing data

    const newMessage=
     { date:message.val.date,
      message:message.val.message,
      url:message.val.url,
      count:message.val.count+=1}

    const newMessageArray=this.state.messages;
    newMessageArray[i].val=newMessage;
    this.setState({
      messages:newMessageArray
    })


    //the syntax is update(ref(database), {[foldername/messagekey]:{objects and keys of the message}} ; other ways wont work
    //if u dont update the state, it wont show up on the page, need to refresh, but database is updated
update(ref(database),{[`${MESSAGE_FOLDER_NAME}/${message.key}`]:newMessage});

//wrong syntax from stack overflow :-) 
// update(ref(database),{[``]}
    //   date:message.val.date,
    //   message:message.val.message,
    //   url:message.val.url,
    //   count:message.val.count+1
    // })

  }

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


  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message,i) => (
      <li key={message.key}>{message.val.date}: "{message.val.message}"
      <img className="img" src={message.val.url} alt={this.state.fileName}/>
      <p>likes:{message.val.count}</p>
      <button  onClick={(e)=>{this.like(message,i)}}>Like</button>
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
           <input type="text" value={this.state.input} onChange={this.handleChange}/> 
          {/* <button onClick={this.writeData}>Send</button> */} 

<input type="file" value={this.state.imageName} onChange={(e)=>this.changeImage(e)}/>
<button onClick={this.uploadImage}>Upload Image</button>

          <ul>{messageListItems}</ul>
        </header>
      </div>
    );
  }
}

export default App;
