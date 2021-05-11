import { createRef, Component } from 'react';
import { Table } from 'reactstrap';
import Code from './Code';
import './Problem.css';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons'
import { faBookmark, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkReg} from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'
import $ from "jquery"

function textArray(ar) {
  return ar.map((paragraph, i) => <p key={i}>{paragraph}</p>);
}

function getIndex (title) {
  for(var i=0;i<title.length;i++){
      if(title[i]=='.'){
          return title.slice(0, i);
      }
  }
}

function getProblemNum (problem) {
  var link = problem.link
  var ans="";
  var flag1=0;
  for(var i=link.length-1;i>=0;i--)
  {
      if(flag1 && link[i]=='/'){
          break;
      }
      if(link[i]<='9' && link[i]>=0){
          flag1=1;
          ans+=link[i];
      }
  }
  var rev = "";
  for(var i=0;i<ans.length;i++){
      rev+=ans[ans.length-i-1];
  }
  rev+=getIndex(problem.title);
  return rev;
}

class Problem extends Component {
  problemStatement = createRef();

  constructor() {
    super()
    this.state = {
      isBookmarked: false,
      user: null,
      isLoading: false,
      problemNum: null,
      workspace: null,
      bookmarkMsg: '',
      loginMsg: ''
    }
    this.componentDidMount=this.componentDidMount.bind(this)
    this.handleBookmark=this.handleBookmark.bind(this)
    // this.test=this.test.bind(this)
    // this.test1=this.test1.bind(this)
  }

  async componentDidMount() {
    await this.test()
    await this.test1()
    await this.test2()
    await this.componentDidUpdate()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  async test() {
    const url = await window.location.href
    // console.log(url)
    var problemNum = ""
    for(var i=url.length-1;i>=0;i--){
      if(url[i]=='/')
        break
      else{
        problemNum+=url[i]
      }
    }
    var neww = problemNum.split("")
    neww = neww.reverse()
    problemNum = neww.join("")
    // console.log(problemNum)
    this.setState({problemNum: problemNum})
  }

  async test1() {
    await axios.get('/isUserLoggedIn').then(response => {
      if(response.data.user){
        this.setState({user: response.data.user})
      } else {
        this.setState({isBookmarked: false})
        this.setState({
          user: null
        })
      }
    }).catch(err => {
      this.setState({loginMsg: err})
    })
    await axios.post('/getWorkspaceWithId', {
      id: this.state.problemNum
    }).then(response => {
      // console.log(response.data)
      this.setState({workspace: response.data.workspace})
    }).catch(err => {
      this.setState({loginMsg: err})
    })
  }

  async test2() {
    if(this.state.user){
      console.log(this.state.workspace._id)
      await axios.post('/isBookmarkedByThisUser', {
        userId: this.state.user._id,
        workspaceId: this.state.workspace._id
      }).then(response => {
        if(response.data.bookmarked){
          this.setState({isBookmarked: true})
        } else {
          this.setState({isBookmarked: false})
        }
      })
    } else {
      this.setState({isBookmarked: false})
      console.log('Get user: no user');
      this.setState({
        user: null
      })
    }
  }

  componentDidUpdate() {
    if (this.problemStatement.current) {
      renderMathInElement(this.problemStatement.current, {
        delimiters: [
          { left: '$$$$$$', right: '$$$$$$', display: true },
          { left: '$$$', right: '$$$', display: false },
        ],
      });
    }
  }

  async handleBookmark() {
    if(!this.state.user){
      $(".alert-warning").fadeTo(2000, 500).slideUp(500, function(){
        $(".alert-warning").alert('close');
      });
      this.setState({loginMsg: "Please login first"})
    } else {
      $(".alert-success").fadeTo(2000, 500).slideUp(500)
      if(this.state.isBookmarked){
        this.setState({isBookmarked: false})
        await axios.post('/removeBookmark', {
          userId: this.state.user._id,
          workspaceId: this.state.workspace._id
        }).then(response => {
          this.setState({bookmarkMsg: response.data.msg})
        }).catch(err => {
          this.setState({loginMsg: err})
        })
      } else {
        this.setState({isBookmarked: true})
        await axios.post('/addBookmark', {
          userId: this.state.user._id,
          workspaceId: this.state.workspace._id
        }).then(response => {
          this.setState({bookmarkMsg: response.data.msg})
        }).catch(err => {
          this.setState({loginMsg: err})
        })
      }
    }
  }

  render() {
    if(!this.state.workspace){
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      )
    }
    const problem = this.state.workspace.problem;
    const loginMsg = this.state.loginMsg;
    const isBookmarked = this.state.isBookmarked
    const bookmarkMsg = this.state.bookmarkMsg
    return (
      problem && (
        <div>
          <div style={loginMsg === '' ? {display: "none"}: {}} className="alert alert-warning fade show" role="alert">
              {loginMsg}
          </div>
          <div style={bookmarkMsg === '' ? {display: "none"}: {}} className="alert alert-success fade show" role="alert">
              {bookmarkMsg}
          </div>
          <div className="problem-area">
            <div className="header">
              <h2 className="title">
                {problem.title}{' '}
                <a href={problem.link} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
                <FontAwesomeIcon title="Bookmark this problem" onClick={this.handleBookmark} style={{marginLeft: "20px"}} icon={isBookmarked ? faBookmark: faBookmarkReg} />
              </h2>
              <div className="time-limit">Time limit: {problem.timeLimit}</div>
              <div className="memory-limit">
                Memory limit: {problem.memoryLimit}
              </div>
              <div className="input">Input: {problem.input}</div>
              <div className="output">Output: {problem.output}</div>
            </div>
            <div className="statement" ref={this.problemStatement}>
              <b style={{fontSize: "30px"}}>Statement</b>
              {textArray(problem.statement.text)}

              <div className="input-spec">
                <h3 className="section-title">
                  <b>Input</b>
                </h3>
                {textArray(problem.statement.inputSpec)}
              </div>

              <div className="output-spec">
                <h3 className="section-title">
                  <b>Output</b>
                </h3>
                {textArray(problem.statement.outputSpec)}
              </div>

              {problem.statement.notes.length ? (
                <div className="notes">
                  <h3 className="section-title">Notes</h3>
                  {textArray(problem.statement.notes)}
                </div>
              ) : null}
            </div>
            {problem.statement.sampleTests.length ? (
              <Table className="sample-tests">
                <thead>
                  <tr>
                    <th>Sample Input</th>
                    <th>Sample Output</th>
                  </tr>
                </thead>
                <tbody>
                  {problem.statement.sampleTests.map(({ input, output }, i) => (
                    <tr key={i}>
                      <td>
                        <Code value={input} />
                      </td>
                      <td>
                        <Code value={output} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : null}
          </div>
          </div>
      )
    );
  }
}

export default Problem;
