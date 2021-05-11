import { Component } from 'react';
import Split from 'react-split';
import { Spinner } from 'reactstrap';
import Problem from '../components/Problem';
import './WorkspacePage.css';
import Workspace from '../components/Workspace';
import { api } from '../js/api';
import languages from '../js/languages';
import debounce from 'lodash/debounce';
import { addWorkspace } from '../js/utils';
import Header from "../components/partials/Header"
import Footer from "../components/partials/Footer"

const defaultLanguage = 54;

function defaultSolution(language = defaultLanguage) {
  return {
    language,
    code: languages[language].template,
  };
}

class WorkspacePage extends Component {
  state = {
    problem: null,
    solution: defaultSolution(),
    loading: false,
  };
  loadState = this.loadState.bind(this);
  handleWorkspaceChange = this.handleWorkspaceChange.bind(this);
  workspaceSaveDebounced = debounce(this.workspaceSave, 1000);

  constructor(props) {
    super(props);
    if (props.match.params.id) this.state.loading = true;
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      api.get(`/workspace/${id}`).then(({ data }) => {
        console.log(data)
        this.loadState(data);
        this.setState({ loading: false });
      });
    }
  }

  loadState(data) {
    addWorkspace(data.id);
    if (data.id !== this.props.match.params.id)
      this.props.history.push(`/workspace/${data.id}`);
    if (data.solution == null) data.solution = defaultSolution();
    this.setState({
      problem: data.problem,
      solution: data.solution,
    });
  }

  handleWorkspaceChange(value) {
    this.setState((state) => ({
      solution: { ...state.solution, ...value },
    }));
    this.workspaceSaveDebounced();
  }

  workspaceSave() {
    if (this.props.match.params.id)
      api.put(
        `/workspace/${this.props.match.params.id}/save`,
        this.state.solution
      );
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Header />
          <div className="d-flex h-100 align-items-center justify-content-center workspace">
            <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" />
          </div>
          <Footer />
        </div>
      );
    }
    return (
      <div>
        <Header />
        <div>
          <Split
            direction="horizontal"
            sizes={[50, 50]}
            minSize={0}
            snapOffset={400}
            gutterSize={12}
            className="split-parent-horizontal">
            <div className="problem-pane">
              <Problem problem={this.state.problem} />
            </div>
            <Workspace
              problem={this.state.problem}
              solution={this.state.solution}
              onChange={this.handleWorkspaceChange}
            />
          </Split>
        </div>
      </div>
    );
  }
}

export default WorkspacePage;
