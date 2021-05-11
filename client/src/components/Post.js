import React from "react"
import axios from 'axios'

import {Link} from 'react-router-dom'
import "./Post.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons"

class Post extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Link to="#">
            <img className="profile-pic" src="https://assets.leetcode.com/users/jiaming2/avatar_1539060294.png" />
          </Link>
          <Link to={"/forum/topic/"+this.props.id}>
            <div style={{display: "inline-block"}}>
              <h2 className="post-title-header">{this.props.title}</h2><br />
              <h5 className="post-title-footer">Author: {this.props.author} ; Created at: {this.props.createdAt}</h5>
            </div>
          </Link>
          <button className="thumbs-up-button"><FontAwesomeIcon icon={faThumbsUp} /> {this.props.likes}</button>
          <button className="thumbs-down-button"><FontAwesomeIcon icon={faThumbsDown} /> {this.props.dislikes}</button>
          <hr className="customize-hr" />
        </div>
      </div>
    )
  } 
}


export default Post