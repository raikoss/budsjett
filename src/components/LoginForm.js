import React, {Component} from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

class LoginForm extends Component {
  constructor(props) {
    super(props);
  }

  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: this.props.providers,
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  }

  componentDidMount() {
    console.log("UiConfig is", this.uiConfig);
    this.unregisterAuthObserver = this.props.firebaseAuth.onAuthStateChanged((user) => {
      console.log("Auth state changed!");
      this.props.onFirebaseAuthStateChanged(user);
    })
    // this.unregisterAuthObserver = this.props.firebaseAuth.onAuthStateChanged((user) => {
    //   this.setState({user: {
    //     id: user.uid, 
    //     name: user.displayName, 
    //     email: user.email, 
    //     phoneNumber: user.phoneNumber
    //   }})
    // });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (
      <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.props.firebaseAuth} />
    )
  }
}

export default LoginForm;