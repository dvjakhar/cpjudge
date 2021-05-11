import React from "react"

import Header from "./partials/Header"
import Footer from "./partials/Footer"

// import { 
//     BrowserRouter as Router,
//     Route, 
//     Switch,
//     Redirect,
//     Link,
//     NavLink as RRDNavLink,
// } from 'react-router-dom';




class Home extends React.Component {

	constructor () {
		super()
		this.handleSubmit=this.handleSubmit.bind(this)
	}

	handleSubmit (event) {
		this.props.history.push('/problems')
	}
	

    render () {
        return (
            <div>
							
              <Header />
                
							<div className="homepage-heading">
        				Cp Judge
    					</div>

    					<div className="intro">
        				<h2>Hello, welcome to Cp Judge. Here you can find mixed problems from other judges.</h2>
    					</div>

    					<form onSubmit={this.handleSubmit} className="whatever">
        				<input className="letsgo" type="submit" value="Let's Go" />
    					</form>

              <Footer />
            </div>
        )
    }
}

export default Home