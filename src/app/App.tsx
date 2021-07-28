import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import StateProvider from "../helpers/StateProvider";
import Login from '../pages/login/Login';
import User from "../pages/user/User";
import './App.css';

const App = () => {

  return (
    <div className="App">
      <StateProvider>
        <Router>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/user" component={User} />
          </Switch>
        </Router>
      </StateProvider>
    </div>
  );
}

export default App;
