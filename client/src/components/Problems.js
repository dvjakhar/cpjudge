import React from "react"

import { 
//    BrowserRouter as Router,
//    Route, 
//    Switch,
//    Redirect,
    	Link
//    NavLink as RRDNavLink
} from 'react-router-dom';

import Header from "./partials/Header"
import Footer from "./partials/Footer"
import axios from "axios"


class App extends React.Component {
		constructor() {
			super()
			this.state={
				problem: '',
        msg: '',
				workspaces: [],
				isLoading: false,
			}
			this.componentDidMount=this.componentDidMount.bind(this)
			this.handleSubmit=this.handleSubmit.bind(this)
			this.handleChange=this.handleChange.bind(this)
		}

		async componentDidMount () {
			axios.post('/getProblemsList')
			.then(response => {
				if(response.data.error){
					console.log(response.data.error)
					this.setState({msg: response.data.error})
				} else {
					console.log(response.data.workspaces)
					this.setState({workspaces: response.data.workspaces})
					// this.setState({msg: "Problems parsed"})
				}
			}).catch(err => {
				console.log(err)
				this.setState({msg: err})
			})
			// axios.get('/getProblemsList')
			// .then(response => {
			// 	if(response.data.error){
			// 		this.setState({msg: response.data.error})
			// 	} else {
			// 		console.log(response.data.problemsList.problems)
			// 		this.setState({problems: response.data.problemsList.problems})
			// 		this.setState({isLoading: false})
			// 	}
			// }).catch(err => {
			// 	this.setState({msg: err})
			// 	this.setState({isLoading: false})
			// })
		}

		handleChange(event) {
			event.preventDefault()
      this.setState({
        [event.target.name]: event.target.value
      })
    }

		handleSubmit(event) {
			event.preventDefault()
			axios.post('/addproblem', {
				problem: this.state.problem
			}).then(response => {
				if(response.data.notLoggedIn){
					this.setState({msg: response.data.notLoggedIn})
				} else if(response.data.msg){
					this.setState({ msg: response.data.msg })
				} else {
					console.log("successfully parsed the problem")
					window.location.reload()
				}
			}).catch(err => {
				this.setState({msg: err})
			})
		}

    render () {
			const msg = this.state.msg;
			const loading = this.state.isLoading
			const problemsJsx = this.state.workspaces.map((workspace, i) => {
				var url = "/workspace/"
				url+=workspace.problem.problemNum
				return (
					<tr key={i}>
						<td>{i+1}</td>
						<td className="problem-name"><Link to={url}>{workspace.problem.title}</Link></td>
						<td>{workspace.problem.difficulty}</td>
						{/* <td>{workspace.problem.solved}</td> */}
						<td>{workspace.problem.author}</td>
						<td>Codeforces</td>
					</tr>
				)
			})
			if(loading) {
				return (
					<h1>
						Loading...
					</h1>
				)
			}
        return (
            <div>
              <Header />
							<div style={msg === '' ? {display: "none"}: {}} className="alert alert-warning fade show" role="alert">
              	{this.state.msg}
            	</div>
              <div>
							<p className="problems-header">Problems</p>
                <form>
    							<input placeholder="Enter codeforces Id" className="addproblembox" name="problem" onChange={this.handleChange} value={this.state.problem} type="text" />
    							<button onClick={this.handleSubmit} type="submit" className="addproblembutton"><span class="addproblembuttontext">Add</span></button>
								</form>
								<table className="problemstable">
									<thead>
										<tr style={{fontSize: "30px"}}>
											<th>#</th>
											<th>Problem Name</th>
											<th>Difficulty</th>
											{/* <th>Solved</th> */}
											<th>Author</th>
											<th>Source</th>
										</tr>
									</thead>
									<tbody>
										{problemsJsx}
									</tbody>
								</table>
              </div>
                {/* <Footer /> */}
            </div>
        )
    }
}

export default App