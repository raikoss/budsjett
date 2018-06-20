import React, {Component} from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
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

  render() {
    return (
      <div className="input-field">
        <input type="text" name="email" value={this.state.email} onChange={this.onInputChange} />
        <input type="password" name="password" value={this.state.password} onChange={this.onInputChange} />
        <button onClick={this.submitLogin}>Submit</button>
      </div>
    )
  }
}

export default LoginForm;