import React from "react";
import { onChildAdded, push, ref, set, update } from "firebase/database";
import { database, storage , auth } from "./firebase";
import logo from "./logo.png";
import "./App.css";
// import { uploadBytes, ref as storageReference, getDownloadURL} from "firebase/storage" ;
// import Comments from './Comments.js';
import Registration from './Registration.js'
import { createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut} from "firebase/auth";
import ImageUpload from './ImageUpload.js'
import ImageDisplay from './ImageDisplay.js'

// // Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      showRegistration:true
    };

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

    return (
      <div className="App">
        <header className="App-header">
    {this.state.showRegistration ? < Registration login={this.login} signup={this.signup} /> :
        <div> <ImageUpload/> <ImageDisplay logout={this.logout}/>
 </div> 
          }
        </header>
      </div>
    );
  }
}

export default App;

