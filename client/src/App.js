import React from "react"

import Home from "./components/Home"
import Forum from "./components/Forum"
import Problems from "./components/Problems"
import CreateContest from "./components/CreateContest"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import PageNotFound from "./components/PageNotFound"
import WorkspacePage from './pages/WorkspacePage';
import ProfilePage from './pages/ProfilePage'
import IndexPage from './pages/IndexPage';
import SharePage from './pages/SharePage';
import TopicPage from './pages/TopicPage'

import './App.css';

import { 
  BrowserRouter as Router,
  Route, 
  Switch,
  // Redirect,
  // Link,
  // NavLink as RRDNavLink
} from 'react-router-dom';


class App extends React.Component {

    render () {
        return (
          <Router>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/problems' component={Problems} />
              <Route exact path='/forum' component={Forum} />
              <Route exact path='/createcontest' component={CreateContest} />
              <Route exact path='/login' component={Login}></Route>
              <Route exact path='/register' component={Register} />
              <Route exact path="/forum/topic/:id" component={TopicPage} />
              <Route exact path='/user/:username' component={ProfilePage} />
              {/* <Route exact path="/" component={IndexPage} /> */}
              <Route exact path="/workspace" component={WorkspacePage} />
              <Route exact path="/workspace/:id" component={WorkspacePage} />
              <Route exact path="/share/:id" component={SharePage} />
              <Route path='/' component={PageNotFound} />
            </Switch>
          </Router>
        )
    }
}

export default App
