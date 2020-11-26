import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth, firestore } from '../../firebase';
import { Link } from 'react-router-dom';
import AppHeader from '../../components/AppHeader/appHeader';
import Button from '../../components/Button/button';
import FormInput from '../../components/FormInput/formInput';
import { setCurrentUser } from '../../redux/user/userAction';
import './signUp.scss';

const SignUp = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signUpErr, setSignUpErr] = useState(false);
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
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const isPaswordMatching = () => {
    if (password !== confirmPassword) {
      setSignUpErr('Passwords do not match');
      return false;
    } else {
      return true;
    }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (isPaswordMatching()) {
      setIsLoading(true);
      // console.log(email, password, confirmPassword);

      auth.createUserWithEmailAndPassword(email, password).then(
        (res) => {
          const userObj = {
            email: res.user.email,
          };
          firestore
            .collection('users')
            .doc(email)
            .set(userObj)
            .then(
              () => {
                setIsLoading(false);
                setSignUpErr(false);
                dispatch(setCurrentUser(res.user.email));

                props.history.push('/dashboard');
              },
              (dbErr) => {
                console.log('db err', dbErr);
                setIsLoading(false);
                setSignUpErr(false);

                setSignUpErr('Failed to register user.Please try again later.');
              }
            );
        },
        (authErr) => {
          setIsLoading(false);
          console.log('auth err', authErr.message);
          setSignUpErr(authErr.message);
        }
      );
      console.log('submitting');
    }
  };

  return (
    <div className="container">
      <AppHeader />
      <div className="signUpContainer">
        <form onSubmit={submitForm} className="signUpForm">
          <h2 className="greet"> Create an account</h2>

          <div className="innerForm">
            {signUpErr && <div className="signUpErr">{signUpErr}</div>}

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
            <FormInput
              type="password"
              name="confirmPassword"
              isRequired={true}
              label="Confirm Password*:"
              value={confirmPassword}
              userTyping={inputChange}
            />

            <div className="formCta">
              <div className="registerLink">
                <Link to="/login">Already a user?</Link>
              </div>
              <div>
                <Button type="submit" text="Register" isLoading={isLoading} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
