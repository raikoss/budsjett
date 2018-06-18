import React, {Component} from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finishedAuthenticating: false
    }
    
    this.unregisterAuthObserver = null;
  }

  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    signInOptions: this.props.providers,
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: (authResult) => {
        console.log(authResult);
        return false; 
      }
    }
  }

  componentDidMount() {
    console.log("Firebaseauth", this.props.firebaseAuth);
    // if (!this.props.firebaseAuth) return;
    // console.log("firebase auth in login form", this.props.firebaseAuth);
    // this.unregisterAuthObserver = this.props.firebaseAuth.onAuthStateChanged((user) => {
    //   this.setState({user: {
    //     id: user.uid, 
    //     name: user.displayName, 
    //     email: user.email, 
    //     phoneNumber: user.phoneNumber
    //   }})
    // });
  }

  componentDidUpdate(prevProps) {
    if (this.props.firebaseAuth !== prevProps.firebaseAuth && this.unregisterAuthObserver === null) {
      console.log("Current props", this.props);
      console.log("Prevprops", prevProps);
      this.unregisterAuthObserver = this.props.firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          console.log("Auth state changed!");
          // this.props.onFirebaseAuthStateChanged(user);
          this.setState({finishedAuthenticating: true})
          
          // this.props.disableLoginForm();
        }
      })

      // console.log(this.unregisterAuthObserver);
    }
    
    if (this.state.finishedAuthenticating) {
      console.log("The thing is done");
    }
  }

  componentWillUnmount() {
    console.log("Unmounting");
    console.log(this.unregisterAuthObserver);
    console.log(this.unregisterAuthObserver()); 
    // console.log("Unmounting", this.unregisterAuthObserver());
  }

  render() {
    return (
      <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.props.firebaseAuth} />
    )
  }
}

export default LoginForm;