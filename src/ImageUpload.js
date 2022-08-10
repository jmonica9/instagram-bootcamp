import React from 'react';
import { uploadBytes, ref as storageReference, getDownloadURL} from "firebase/storage" ;
import { onChildAdded, push, ref, set, update } from "firebase/database";
import { database, storage } from "./firebase";

// // Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

export default class ImageUpload extends React.Component{
  constructor(props){
    super(props)
     this.state = {
      input:"",
      imageFile:"",
      imageName:"",
      url:"",
      count:0,
      comment:"",}
    
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

   handleChange= (e)=>{
    this.setState({
      input:e.target.value
    })
  }



  render(){
    return(
   <div> <input type="text" value={this.state.input} onChange={this.handleChange}/> 
<input type="file" value={this.state.imageName} onChange={(e)=>this.changeImage(e)}/>
<button onClick={this.uploadImage}>Upload Image</button>
          </div>
    )
  }
}