
import './App.css'
import GraphComponent from './components/Graph'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/" component={GraphComponent} />
      </Switch>
    </Router>
  )
}

export default App
