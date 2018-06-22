import React, {Component} from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      registerUser: false, 
      displayName: ""
    }
  }

  onInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({[name]: value});
  }

  submitLogin = () => {
    if (this.props.firebaseAuth) {
      this.props.firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return this.props.firebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.password)
      })
      .then(response => {
        console.log("User after sign in", response.user);
        this.props.onLogin();
      })
      .catch(error => {
        console.log(error.message);
      })
    }
  }

  registerUser = () => {
    if (this.props.firebaseAuth) {
      this.props.firebaseAuth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        console.log('User is created!');
        return this.props.firebaseAuth.currentUser.updateProfile({displayName: this.state.displayName})
      })
      .then(() => {
        console.log("And user is updated with name!");
        // this.props.updateNameHandler(this.state.displayName);
      })
      .catch(error => {
        console.log(error.message);
      })
    }
  }

  toggleRegistration = () => {
    this.setState({registerUser: !this.state.registerUser});
  }

  render() {
    if (this.state.registerUser) {
      return (
        <div>
          <h2>Registrer deg</h2>
          <div className="input-field">
            <input type="text" name="displayName" value={this.state.displayName} placeholder="Navn" onChange={this.onInputChange} />
            <input type="text" name="email" value={this.state.email} placeholder="E-post" onChange={this.onInputChange} />
            <input type="password" name="password" value={this.state.password} placeholder="Passord" onChange={this.onInputChange} />
            <button onClick={this.registerUser}>Submit</button>
            <p>Har du allerede en bruker? Logg inn <a href='#' onClick={this.toggleRegistration}>her.</a></p>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <h2>Logg inn</h2>
          <div className="input-field">
            <input type="text" name="email" value={this.state.email} placeholder="E-post" onChange={this.onInputChange} />
            <input type="password" name="password" value={this.state.password} placeholder="Passord" onChange={this.onInputChange} />
            <button onClick={this.submitLogin}>Submit</button>
            <p>Har du ikke bruker? Registrer deg <a href='#' onClick={this.toggleRegistration}>her.</a></p>
          </div>
        </div>
      )
    }
  }
}

export default LoginForm;