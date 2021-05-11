import React from "react"

import { 
//     BrowserRouter as Router,
//     Route, 
//     Switch,
    Redirect,
//     Link,
//     NavLink as RRDNavLink
} from 'react-router-dom';

import Header from "../partials/Header"
import Footer from "../partials/Footer"
import axios from "axios"


class Login extends React.Component {

    constructor() {
      super()
      this.state={
        username: '',
        password: '',
        redirectTo: null,
        msg: ''
      }
      this.handleChange=this.handleChange.bind(this)
      this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleChange(event) {
      this.setState({
        [event.target.name]: event.target.value
      })
    }

    handleSubmit(event) {
      event.preventDefault()
      axios.post('/login', {
        username: this.state.username,
        password: this.state.password
      }).then(response => {
        console.log(response)
        if(!response.data.error){
          console.log('Successfully logged in')
			    this.setState({ redirectTo: '/' })
        } else {
          console.log(response.data.error)
          this.setState({ msg: response.data.error })
        }
      }).catch(err => {
        console.log(err)
        this.setState({ msg: err })
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
            <div style={msg === '' ? {display: "none"}: {}} className="alert alert-warning fade show" role="alert">
              {this.state.msg}
            </div>
            <div className="login">
            <form method="POST">
              <div className="container">
                <h1>Login</h1>
                <hr />

                <label htmlFor="username"><b>Username</b></label>
                <input type="text" placeholder="Username" value={this.state.username} onChange={this.handleChange} name="username" required />
      
                <label htmlFor="password"><b>Password</b></label>
                <input type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} name="password" required />
      
                <div className="clearfix">
                  <button onClick={this.handleSubmit} type="submit" className="signupbtn"> Login</button>
                </div>
                <p>Don't have an account? <a href="/register">Sign Up</a></p>
              </div>
            </form>
          </div>
            <Footer />
          </div>
        )
    }
}

export default Login