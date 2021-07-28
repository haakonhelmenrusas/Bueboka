import { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import StateProvider, { UserContext } from "../helpers/StateProvider";
import Login from '../pages/login/Login';
import User from "../pages/user/User";
import './App.css';

const App = () => {

  const { user } = useContext(UserContext);


  return (
    <div className="App">
      <StateProvider>
        <Router>
          <Switch>
            <Route path="/" exact component={Login} />
            {user && (
              <Route path="/user" component={User} />
            )}
          </Switch>
        </Router>
      </StateProvider>
    </div>
  );
}

export default App;
