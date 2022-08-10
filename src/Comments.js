import React from 'react'

export default class Comments extends React.Component{
  constructor(props){
    super(props)
    this.state={
      comment:""
    }
  }

  

//filter out the first "" string then map out
  render(){
    // const filtered = this.props.message.val.comments && this.props.message.val.comments.length>0 ? this.props.message.val.comments.filter((comment)=>comment.length>0) : []
    console.log(this.props.message.val.comments)
    return(
      <div> <span><input type="text" value={this.state.comment} onChange={(e)=>{this.setState({comment:e.target.value})}}/> 
      <button type="submit" onClick={(e)=>this.props.comment(this.state.comment)}>Comment</button></span>
      <p>Comments:</p>
      <p>{this.props.message.val.comments && this.props.message.val.comments.length>0 ? this.props.message.val.comments.map(item=><div>{item}</div>): "no comments"}</p> </div>
    )
  }
}

// initialise [] , use conditional if else 
// initialise [""], use filter comments length > 0 
