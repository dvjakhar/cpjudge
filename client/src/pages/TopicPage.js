import React from 'react'
import axios from 'axios'
import Disqus from "disqus-react"
import Markdown from "react-markdown"
import gfm from 'remark-gfm'

import { Link } from 'react-router-dom'
import Header from '../components/partials/Header'
import Footer from '../components/partials/Footer'
import './TopicPage.css'

class TopicPage extends React.Component {
  constructor() {
    super()
    this.state={
      isLoading: false,
      post: {},
      postId: '',
      isUpvoted: false,
      isDownvoted: false,
      votes: 0,
      user: null,
      authMsg: '',
      msg: ''
    }
    this.handleUpvote=this.handleUpvote.bind(this)
    this.componentDidMount=this.componentDidMount.bind(this)
    this.handleUpvote=this.handleUpvote.bind(this)
    this.handleDownVote=this.handleDownVote.bind(this)
  }

  async componentDidMount() {
    this.setState({isLoading: true})
    await this.getUser()
    await this.setState({isLoading: true})
    const {id} = await this.props.match.params
    this.setState({postId: id})
    console.log(id)
    await axios.post('/getPostWithId', {
      id: id
    }).then((response) => {
      console.log(response)
      if(response.data.post){
        this.setState({post: response.data.post})
        this.setState({ votes: this.state.post.likes.length - this.state.post.dislikes.length })
      }
      this.setState({isLoading: false})
    }).catch((err) => {
      console.log(err)
    })
    await this.isAlreadyUpvoted()
    await this.isAlreadyDownvoted()
    this.setState({isLoading: false})
  }

  async isAlreadyUpvoted() {
    if(!this.state.user){
      console.log("User is not logged in!")
    }else{
      await axios.post('/isAlreadyUpvoted', {
        postId: this.state.postId,
        userId: this.state.user._id
      }).then(res => {
        if(res.data.yes){
          this.setState({isUpvoted: true})
        }else{
          this.setState({isUpvoted: false})
        }
      }).catch(err => {
        this.setState({msg: "Some error has occured"})
      })
    }
  }

  async isAlreadyDownvoted() {
    if(!this.state.user){
      console.log("User is not logged in!")
    }else{
      await axios.post('/isAlreadyDownvoted', {
        postId: this.state.postId,
        userId: this.state.user._id
      }).then(res => {
        if(res.data.yes){
          this.setState({isDownvoted: true})
        }else{
          this.setState({isDownvoted: false})
        }
      }).catch(err => {
        this.setState({msg: "Some error has occured"})
      })
    }
  }

  async handleUpvote(event) {
    event.preventDefault()
    if(!this.state.user){
      this.setState({authMsg: "Please login first to upvote"})
    } else {
      if(this.state.isUpvoted){
        this.setState((prevState) => {
          return {votes: prevState.votes - 1}
        })
        this.setState({isUpvoted: false})
        await axios.post('/removeUpvote', {
          postId: this.state.postId,
          userId: this.state.user._id
        }).then(res => {
          this.setState({msg: res.data.msg})
        }).catch(err => {
          this.setState({msg: err})
        })
      }else{
        this.setState((prevState) => {
          return {votes: prevState.votes + 1}
        })
        this.setState({isUpvoted: true})
        await axios.post('/addUpvote', {
          postId: this.state.postId,
          userId: this.state.user._id
        }).then(res => {
          this.setState({msg: res.data.msg})
        }).catch(err => {
          this.setState({msg: err})
        })
      }
    }
    if(this.state.isDownvoted){
      this.setState((prevState) => {
        return {votes: prevState.votes + 1}
      })
      this.setState({isDownvoted: false})
      await axios.post('/removeDownvote', {
        postId: this.state.postId, 
        userId: this.state.user._id
      }).then(res => {
        this.setState({msg: res.data.msg})
      }).catch(err => {
        this.setState({msg: err})
      })
    }
  }

  async handleDownVote(event) {
    event.preventDefault()
    if(!this.state.user){
      this.setState({authMsg: "Please login first to upvote"})
    } else {
      if(this.state.isDownvoted){
        this.setState((prevState) => {
          return {votes: prevState.votes + 1}
        })
        this.setState({isDownvoted: false})
        await axios.post('/removeDownvote', {
          postId: this.state.postId,
          userId: this.state.user._id
        }).then(res => {
          this.setState({msg: res.data.msg})
        }).catch(err => {
          this.setState({msg: err})
        })
      }else{
        this.setState((prevState) => {
          return {votes: prevState.votes - 1}
        })
        this.setState({isDownvoted: true})
        await axios.post('/addDownvote', {
          postId: this.state.postId,
          userId: this.state.user._id
        }).then(res => {
          this.setState({msg: res.data.msg})
        }).catch(err => {
          this.setState({msg: err})
        })
      }
      if(this.state.isUpvoted){
        this.setState((prevState) => {
          return {votes: prevState.votes - 1}
        })
        this.setState({isUpvoted: false})
        await axios.post('/removeUpvote', {
          postId: this.state.postId,
          userId: this.state.user._id
        }).then(res => {
          this.setState({msg: res.data.msg})
        }).catch(err => {
          this.setState({msg: err})
        })
      }
    }
  }

  async getUser() {
    await axios.get('/isUserLoggedIn').then(response => {
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
    if(this.state.isLoading){
      return(
        <div>
          Loading...
        </div>
      )
    }
    var ans=""
    if(this.state.post.created_on){
      var tm = this.state.post.created_on.toString()
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
    }
    var tags = this.state.post.tags
    if(tags){
      var newTags = tags.map(function(tag){
        return (
          <span className="post-tags">{tag} </span>
        )
      })
    }
    // disqus comp
    const disqusShortname = "cpjudge"
    const disqusConfig = {
      url: "http://localhost:3000/forum/topic/"+this.state.postId,
      identifier: this.state.postId,
      title: this.state.post.title
    }
    const body = this.state.post.body
    const authMsg = this.state.authMsg
    return (
      <div>
        <Header />
        <div style={authMsg === '' ? {display: "none"}: {}} className="alert alert-warning fade show" role="alert">
          {this.state.authMsg}
        </div>
        <div>
      
          <div className="container1">
          <div className="upvote-downvote-panel">
              <div style={{background: this.state.isUpvoted ? "#90a4ae": "#f7f9fa"}} title="Upvote Button" class="upvote-button">
                <svg viewBox="0 0 24 24" width="1em" height="1em" class="upvote-button-svg" onClick={this.handleUpvote}>
                  <path fill-rule="evenodd" d="M7 14l5-5 5 5z"></path>
                </svg>
              </div>
              <div title="Vote Count" className="vote-count">
                <span>{this.state.votes}</span>
              </div>
              <div style={{background: this.state.isDownvoted ? "#90a4ae": "#f7f9fa"}} title="Downvote Button" class="downvote-button">
                <svg viewBox="0 0 24 24" width="1em" height="1em" class="downvote-button-svg" onClick={this.handleDownVote}>
                  <path fill-rule="evenodd" d="M7 10l5 5 5-5z"></path>
                </svg>
              </div>
            </div>
            <div className="topic-body">
              <h1 className="post-title1">{this.state.post.title}</h1>
              <hr className="this-hr" />
              <div style={{display: "inline"}}>
                <Link to="#">
                  <img className="profile-pic-topic" src="https://assets.leetcode.com/users/jiaming2/avatar_1539060294.png" />
                  <span className="post-author">{this.state.post.author}</span>
                </Link>
                <span className="creation-time-text">Created at: {ans}</span>
              </div>
              <div className="post_">
                <Markdown remarkPlugins={[gfm]} children={body} />
              </div>
            </div>
          <hr style={ !newTags || newTags.length===0 ? {display: "none"}: {} } className="customize-hr1"/>
          
          </div>
          {/* <ul style={{listStyleType: "none", display: "inline"}}>
            <li className="upvote-downvote-panel">
              <svg viewBox="0 0 24 24" width="1em" height="1em" className="upvote-button" onClick={this.handleUpvote}>
                <path fill-rule="evenodd" d="M7 14l5-5 5 5z"></path>
              </svg>
              <div className="votes-count">
                {this.state.votes}
              </div>
              <svg viewBox="0 0 24 24" width="1em" height="1em" class="downvote-button" onClick={this.handleDownVote}>
                <path fill-rule="evenodd" d="M7 10l5 5 5-5z"></path>
              </svg>
            </li>
            <li style={{display: "inline"}}>
            <Link to="#">
              <img className="profile-pic-topic" src="https://assets.leetcode.com/users/jiaming2/avatar_1539060294.png" />
              <span className="post-author">{this.state.post.author}</span>
            </Link>
            <span className="creation-time-text">Created at: {ans}</span>
            </li>
          </ul> */}
          <div style={ newTags ? newTags.length === 0 ? {display: "none"}: {} : {}} className="tags-section">
            <p><b>Tags</b>: {newTags}</p>
          </div>
          <hr />
          {this.state.post ? 
            <Disqus.DiscussionEmbed 
            className="comment-section"
            shortname={disqusShortname}
            config={disqusConfig}
            />
            : {}
          }
        </div>
      </div>
    )
  }
}

export default TopicPage


// set status to isUpvoted and isDownvoted while startup