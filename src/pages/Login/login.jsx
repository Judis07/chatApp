import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/appHeader';
import Button from '../../components/Button/button';
import FormInput from '../../components/FormInput/formInput';
import { setCurrentUser } from '../../redux/user/userAction';
import './login.scss';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const inputChange = (event) => {
    const { value, name } = event.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // console.log(email, password);
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      console.log('login res', res.user.email);
      dispatch(setCurrentUser(res.user.email));
      setLoginErr(false);
      setIsLoading(false);
      props.history.push('/dashboard');
    } catch (err) {
      console.log('err fetch login info', err);
      setLoginErr(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <AppHeader />
      <div className="loginContainer">
        <h2 className="greet"> Welcome Back : )</h2>

        <form onSubmit={submitForm} className="loginForm">
          <div className="innerForm">
            {loginErr && <div className="loginErr">Incorrect login info!</div>}

            <FormInput
              type="email"
              name="email"
              isRequired={true}
              label="Email*:"
              value={email}
              userTyping={inputChange}
            />
            <FormInput
              type="password"
              name="password"
              isRequired={true}
              label="Password*:"
              value={password}
              userTyping={inputChange}
            />

            <div className="formCta">
              <div className="registerLink">
                <Link to="/register">Create an account</Link>
              </div>
              <div>
                <Button type="submit" text="Log In" isLoading={isLoading} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
