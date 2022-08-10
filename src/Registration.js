import React from 'react';

export default class Registration extends React.Component{
constructor(props){
  super(props)
  this.state={
    email:"",
    password:""
  }


}

render(){
  return(
    <div>
      <form>
        <p>Email:</p>
        <input type="email" value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}} placeholder="email here"/>
 <p>Password:</p>
        <input type="password" value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}} placeholder="password here"/>
        
        <button type="submit" onClick={(e)=>this.props.login(e,this.state.email,this.state.password)}>Login</button>
         <button type="submit" onClick={(e)=>this.props.signup(e,this.state.email,this.state.password)}>Sign Up</button>

      </form>
    </div>
  )
}
}