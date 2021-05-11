import React from "react"

import Header from '../components/partials/Header'
import Footer from '../components/partials/Footer'
import ProfilePage from '../pages/ProfilePage'
import axios from "axios"
import './ProfilePage.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'


class Profile extends React.Component {
  constructor() {
    super()
    this.state={
      username: '',
      user: null
    }
    this.componentDidMount=this.componentDidMount.bind(this)
  }

  async componentDidMount() {
    const username = await this.props.match.params.username
    await this.setState({username: username})
    await this.getUser()
  }

  getUser() {
    axios.post('/getUserWithUsername', {
      username: this.state.username
    }).then(res => {
      console.log(res.data.user)
      this.setState({user: res.data.user})
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const user = this.state.user
    if(!user){
      return (
        <div>
        <Header />
        <h1>Loading...</h1>
        <Footer />
      </div>
      )
    }
    return(
      <div>
        <Header />
        <div style={{marginLeft: "17%"}}>
        <h1 className="header">User Profile</h1>
        <hr className="custom-hr" />
        <div className="user-details">
          <h2><span><FontAwesomeIcon icon={faUser} /></span> {this.state.user.username}</h2>
          <div className="oth">
            <h6>Bookmarked Problems: {this.state.user.bookmarks.length}</h6> 
          </div>  
        </div>
      </div>
        <Footer />
      </div>
    )
  }
}

export default Profile