// impoSwichoute, BrowserRouter as Router } from 'react-router-dom';

import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import Login from './pages/Login/login';
import SignUp from './pages/Signup/signUp';
import Dashboard from './pages/Dashboard/dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <div id="routing-container">
        <Switch>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/register" component={SignUp}></Route>
          <Route exact path="/dashboard" component={Dashboard}></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
