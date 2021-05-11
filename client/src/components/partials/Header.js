import React from "react"
import axios from "axios"

import { 
  Link, Redirect,
} from 'react-router-dom';


class Header extends React.Component {
		constructor() {
			super()
			this.state={
				username: null,
				redirectTo: null
			}
			this.componentDidMount = this.componentDidMount.bind(this)
			this.logOutUser=this.logOutUser.bind(this)
		}

		componentDidMount() {
			this.getUser()
		}

		getUser() {
			axios.get('/isUserLoggedIn').then(response => {
				// console.log(response.data)
				if (response.data.user) {
					console.log('Get User: There is a user saved in the server session: ')

					this.setState({
						username: response.data.user.username
					})
				} else {
					console.log('Get user: no user');
					this.setState({
						username: null
					})
				}
			})
		}

		logOutUser(event) {
			event.preventDefault()
			axios.post('/logout')
			.then(response => {
				if(response.data.successMsg){
					this.setState({ redirectTo: '/'})
					console.log("successfully logout")
				} else {
					this.setState({ redirectTo: '/login' })
				}
			})
		}
 
    render () {
			if(this.state.redirectTo){
				return <Redirect to={{ pathname: this.state.redirectTo}} />
			}
			const username = this.state.username
        return (
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Cp Judge</Link>
      			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        		<span className="navbar-toggler-icon"></span>
      			</button>
      			<div className="collapse navbar-collapse" id="navbarNavDropdown">
        			<ul className="navbar-nav">
          			<li className="nav-item active">
            			<Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
          			</li>
          			<li className="nav-item">
            			<Link className="nav-link" to="/problems">Problems</Link>
          			</li>
          			<li className="nav-item">
            			<Link className="nav-link" to="/forum">Forum</Link>
          			</li>
								<li className="nav-item">
            			<a className="nav-link" href="https://github.com/dvjakhar31/cpjudge">Code</a>
          			</li>
        			</ul>

							<ul className="navbar-nav ml-auto">
            		<li style={username ? {display: "none"}: {}} className="nav-item">
              		<Link className="nav-link" to="/register">Register</Link>
            		</li>
            		<li style={username ? {display: "none"}: {}} className="nav-item">
              		<Link className="nav-link" to="/login">Login</Link>
          			</li>
								{/* <li style={!username ? {display: "none"}: {}} className="nav-item">
									<Link to="#" onClick={this.logOutUser} className="nav-link">Logout</Link>
								</li> */}

								<div style={!username ? {display: "none"}: {}}>
									<ul className="navbar-nav ml-auto">
              			<li className="nav-item dropdown">
                			<Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  			{username}
                			</Link>
                			<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  			<Link className="dropdown-item" to={"/user/" + this.state.username}>Profile</Link>
                  			<Link onClick={this.logOutUser} className="dropdown-item" to="#">Logout</Link>
                			</div>
              			</li>
              			<li className="nav-item">
                			<Link onClick={this.logOutUser} className="nav-link" to="#">Logout</Link>
              			</li>
            			</ul>
								</div>
        			</ul>
      			</div>
    			</nav>
        )
    }
}

export default Header