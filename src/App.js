// impoSwichoute, BrowserRouter as Router } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login/login';
import SignUp from './pages/Signup/signUp';
import Dashboard from './pages/Dashboard/dashboard';

const App = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  console.log('user', currentUser);

  if (currentUser) {
    return (
      <BrowserRouter>
        <div id="routing-container">
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            <Route exact path="/dashboard" component={Dashboard}></Route>
            <Route
              exact
              path="/login"
              render={() => {
                return currentUser ? <Redirect to="/dashbaord" /> : <Login />;
              }}
            />
            <Route path="/login" component={Login} />

            <Redirect to="/dashboard" />
          </Switch>
        </div>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <div id="routing-container">
          <Switch>
            <Route exact path="/register" component={SignUp}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Redirect to="/login" />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
};

export default App;
