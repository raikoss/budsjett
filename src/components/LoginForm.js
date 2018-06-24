import React, {Component} from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import Spinner from "./Spinner";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      registerUser: false, 
      displayName: "", 
      submitted: false
    }
  }

  onInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({[name]: value});
  }

  submitLogin = (e) => {
    e.preventDefault();

    this.setState({submitted: true});
    this.props.firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      return this.props.firebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.password)
    })
    .then(response => {
      this.setState({submitted: false});
      console.log("User after sign in", response.user);
      this.props.onLogin();
    })
    .catch(error => {
      this.setState({submitted: false});
      console.log(error.message);
    })
  }

  registerUser = (e) => {
    e.preventDefault();

    this.setState({submitted: true});
    this.props.firebaseAuth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      console.log('User is created!');
      this.setState({submitted: false})
      return this.props.firebaseAuth.currentUser.updateProfile({displayName: this.state.displayName})
    })
    .then(() => {
      console.log("Profile was updated");
      return this.props.usersDocRef.add({
        uid: this.props.firebaseAuth.currentUser.uid
      })
    })
    .then(docRef => {
      console.log("User was inserted in db ", docRef.id);
    })
    .catch(error => {
      this.setState({submitted: false});
      console.log(error);
    })
  }

  toggleRegistration = () => {
    this.setState({registerUser: !this.state.registerUser});
  }

  render() {
    if (this.state.registerUser) {
      return (
        <div>
          <h2>Registrer deg</h2>
          <form>
            <div className="input-field">
              <input type="text" name="displayName" value={this.state.displayName} placeholder="Navn" onChange={this.onInputChange} />
              <input type="text" name="email" value={this.state.email} placeholder="E-post" onChange={this.onInputChange} />
              <input type="password" name="password" value={this.state.password} placeholder="Passord" onChange={this.onInputChange} />
              <input type="submit" onClick={this.registerUser} value="Submit" />
            </div>
          </form>

          {this.state.submitted && <Spinner />}

          <p>Har du allerede en bruker? Logg inn <a href='#' onClick={this.toggleRegistration}>her.</a></p>
        </div>
      )
    } else {
      return (
        <div>
          <h2>Logg inn</h2>
          <form>
            <div className="input-field">
              <input type="text" name="email" value={this.state.email} placeholder="E-post" onChange={this.onInputChange} />
              <input type="password" name="password" value={this.state.password} placeholder="Passord" onChange={this.onInputChange} />
              <input type="submit" onClick={this.submitLogin} value="Submit" />
            </div>
          </form>

          {this.state.submitted && <Spinner />}

          <p>Har du ikke bruker? Registrer deg <a href='#' onClick={this.toggleRegistration}>her.</a></p>

        </div>
      )
    }
  }
}

export default LoginForm;