import React from "react"
import axios from "axios"

import {
	Redirect,
	Link,
} from 'react-router-dom';

import Header from "../partials/Header"
import Footer from "../partials/Footer"


class Register extends React.Component {
  
constructor () {
	super()
	this.state={
		email: '',
		username: '',
		password: '',
		redirectTo: null,
		msg: ''
	}
	this.handleSubmit=this.handleSubmit.bind(this)
	this.handleChange=this.handleChange.bind(this)
}

handleSubmit (event) {
	event.preventDefault()
	axios.post('/register', {
		email: this.state.email,
		username: this.state.username,
		password: this.state.password
	}).then(response => {
		console.log(response)
		if(!response.data.error){
			console.log('Successfully registered')
			this.setState({ redirectTo: '/login' })
		} else {
			console.log("username already exists")
			this.setState({ msg: "A user with the given username is already registered"})
		}
	}).catch(err => {
		console.log(err)
		this.setState({ msg: err })
	})
}

handleChange (event) {
	this.setState({
		[event.target.name]: event.target.value
	})
}

render () {
	const msg = this.state.msg;
	if(this.state.redirectTo){
		return <Redirect to={{ pathname: this.state.redirectTo }} />
	}
  return (
		<div>
			<Header />
			<div style={msg==='' ? {display: "none"}: {}} className="alert alert-warning fade show" role="alert">
        {this.state.msg}
      </div>
			<div className="register">
						<form className="register-form" method="POST">
            <div className="container">
          		<h1>Sign Up to enter into Cp Judge</h1>
          		<hr />
      
          		<label htmlFor="email"><b>Email</b></label>
          		<input type="email" placeholder="Required" value={this.state.email} onChange={this.handleChange} name="email" required /><br />

          		<label htmlFor="username"><b>Username</b></label>
          		<input type="text" placeholder="Required" value={this.state.username} onChange={this.handleChange} name="username" required /><br />
      
          		<label htmlFor="password"><b>Password</b></label>
          		<input type="password" placeholder="Required" value={this.state.password} onChange={this.handleChange} name="password" required />
      
          		<div className="clearfix">
            		<button onClick={this.handleSubmit} type="submit" className="signupbtn">Sign Up</button>
          		</div>
          		<p>Already have an account? <Link to="/login">Login </Link></p>
        			</div>
      			</form>
					</div>
		  <Footer />
		</div>
    )
  }
}


export default Register