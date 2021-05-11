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
      authMsg: ''
    }
    this.handleUpvote=this.handleUpvote.bind(this)
    this.componentDidMount=this.componentDidMount.bind(this)
  }

  async componentDidMount() {
    this.getUser()
    this.setState({isLoading: true})
    const {id} = this.props.match.params
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
  }

  handleUpvote(event) {
    event.preventDefault()
    if(!this.state.user){
      this.setState({authMsg: "Please login first to upvote"})
    } else {
      this.setState({ isDownvoted: false })
      if(this.state.isUpvoted){
        this.setState((prevState, props) => {
        return{ isUpvoted: false, votes: prevState.votes - 1 }
        })
      } else{
        this.setState((prevState, props) => {
          return{ isUpvoted: true, votes: prevState.votes + 1}
        })
      }
      axios.post('/clickedUpvoteButton', {
        userId: this.state.user._id,
        postId: this.state.post.id
      }).then((response) => {
        if(response.error){
          this.setState({msg :response.error})
        } else {
          this.setState({msg: response.msg})
        }
      }).catch((err) => {
        console.log(err)
        this.setState({msg: err})
      })
    }
    
  }

  handleDownVote() {
    this.setState(function(prev){
      return {votes: prev.votes-1}
    })
    this.setState({ isUpvoted: false, isDownvoted: !this.state.isDownvoted })
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
          <h1 className="post-title">{this.state.post.title}</h1>
          <hr className="customize-hr" />
          <ul style={{listStyleType: "none", display: "inline"}}>
            <li className="upvote-downvote-panel">
              <img onClick={this.handleUpvote} className="upvote-button-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Sort_up_font_awesome.svg/768px-Sort_up_font_awesome.svg.png" />
              <div className="votes-count">
                {this.state.votes}
              </div>
              <img className="downvote-button-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Sort_down_font_awesome.svg/512px-Sort_down_font_awesome.svg.png" />
            </li>
            <li style={{display: "inline"}}>
            <Link to="#">
              <img className="profile-pic-topic" src="https://assets.leetcode.com/users/jiaming2/avatar_1539060294.png" />
              <span className="post-author">{this.state.post.author}</span>
            </Link>
            <span className="creation-time-text">Created at: {ans}</span>
            </li>
          </ul>
          <div className="topic-body">
            <Markdown remarkPlugins={[gfm]} children={body} />
          </div>
          <hr style={ !newTags || newTags.length===0 ? {display: "none"}: {} } className="customize-hr"/>
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