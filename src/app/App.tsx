import { BrowserRouter, Switch, Route } from "react-router-dom";

import StateProvider from "../helpers/StateProvider";
import FormPage from "../pages/form/FormPage";
import Login from '../pages/login/Login';
import User from "../pages/user/User";
import './App.css';

const App = () => {

  return (
    <div className="App">
      <StateProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/user" component={User} />
            <Route path="/form" component={FormPage} />
          </Switch>
        </BrowserRouter>
      </StateProvider>
    </div>
  );
}

export default App;
