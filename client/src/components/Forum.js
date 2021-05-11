import React from "react"

import Header from "./partials/Header"
import Footer from "./partials/Footer"
import './Forum.css'
import Post from "./Post"
import Modal from 'react-modal'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MarkdownEditor from '@uiw/react-markdown-editor';



import { 
//     BrowserRouter as Router,
//     Route, 
//     Switch,
        Redirect,
        Link
//     NavLink as RRDNavLink,
} from 'react-router-dom';
import { faSwimmingPool, faUpload } from "@fortawesome/free-solid-svg-icons"

const customStyles = {
  overlay: {
    height: "83%",
    marginTop: "10%",
  },
  content: {
    // backgroundColor: "transparent"
  }
}

class Forum extends React.Component {
  constructor() {
    super()
    this.state={
      isModalOpen: false,
      title: '',
      body: '',
      user: null,
      msg: '',
      posts: [],
      tags: ''
    }
    this.handleClick=this.handleClick.bind(this)
    this.handleChange=this.handleChange.bind(this)
    this.handlePost=this.handlePost.bind(this)
    this.componentDidMount=this.componentDidMount.bind(this)
  }

  handleClick() {
    if(!this.state.user){
      this.setState({msg: "Please login first"})
    } else{
      this.setState({isModalOpen: !this.state.isModalOpen})
    }
  }

  handlePost(event) {
    event.preventDefault()
    axios.post('/postTopic', {
      title: this.state.title,
      body: this.state.body,
      author: this.state.user.username,
      likes: [],
      dislikes: [],
      tags: this.state.tags
    })
    .then((response) => {
      if(response.data.error){
        this.setState({msg: response.data.error});
      } else {
        window.location.reload()
      }
    }).catch(() => {
      this.setState({ msg: "Sorry, something went wrong"})
    })
  }

  handleChange(event) {
    if(event.target){
      this.setState({
        [event.target.name]: event.target.value
      })
    } else {
      this.setState({ body: event })
    }
  }

  componentDidMount() {
    this.getUser()
    axios.get('/allPosts', {})
    .then(response => {
      if(response.data.error){
        this.setState({msg: 'Some error has occured'})
      } else {
        this.setState({posts: response.data.posts})
      }
    }).catch(err => {
      this.setState({msg: "Some error has occured"})
    })
  }

  getUser() {
    axios.get('/isUserLoggedIn').then(response => {
      // console.log(response.data)
      if (response.data.user) {
        console.log(response.data.user)

        this.setState({
          user: response.data.user
        })
      } else {
        console.log('Get user: no user');
        this.setState({
          user: null
        })
      }
    })
  }

  render() {
    const msg=this.state.msg
    const posts = this.state.posts
    const postList = posts.map(function(post){
      var tm = post.created_on.toString();
      var ans=""
      for(var i=0;i<tm.length;i++){
        if(tm[i]=='T')
          ans+=" "
        else
          ans+=tm[i]
      }
      var j
      for(var i=ans.length-1;i>=0;i--)
      {
        if(ans[i]=='.'){
          j=i
          break
        }
      }
      ans=ans.slice(0, j)
      return (
        <Post
          key={post._id}
          title={post.title}
          body={post.body}
          author={post.author}
          createdAt={ans}
          likes={post.likes.length}
          dislikes={post.dislikes.length}
          id={post._id}
        />
      )
    })
    return (
      <div>
        <Header />
          <div style={msg === '' ? {display: "none"}: {}} className="alert alert-warning fade show" role="alert">
              {this.state.msg}
          </div>
          <h1 style={ this.state.isModalOpen ? {display: "none"}: {}} className="forum-title">Welcome to the Forum</h1>
          <h1 style={ !this.state.isModalOpen ? {display: "none"}: {}} className="new-post-heading">Add New Post</h1>
          <Modal isOpen={this.state.isModalOpen} style={customStyles} ariaHideApp={false}>
            <form method="POST">
            <button className="close-modal" onClick={this.handleClick}><span className="close-modal-button">X</span></button>
              <div>
                <input className="topic-title-modal" placeholder="Enter Topic Title" name="title" value={this.state.title} onChange={this.handleChange} />
                <button value="submit" type="submit" className="post-button-modal" onClick={this.handlePost}><span>Post <FontAwesomeIcon icon={"facebook-messenger"} /></span></button>
              </div>
              <MarkdownEditor
                value={this.state.body}
                onChange={(editor, data, value) => this.setState({body: value})}
                height={500}
                className="MdEditor-customize"
                visible="true"
              />
              {/* <textarea className="topic-body-modal" onChange={this.handleChange} placeholder="Write your post here...(Markdown Supported)" name="body" value={this.state.body}></textarea> */}
              <input className="topic-title-modal tags-input-box" placeholder="Enter space saperated tags" name="tags" value={this.state.tags} onChange={this.handleChange} />
            </form>
          </Modal>
          <div style={ this.state.isModalOpen ? {display: "none"}: {}}>
            <button className="add-new-topic-button" onClick={this.handleClick}><span className="new-topic-button-text">Post New Topic</span></button>
            <div className="custom-hr"></div>
            { postList }
          </div>
      </div>
    )
  } 
}


export default Forum