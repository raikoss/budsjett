import React, {Component} from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finishedAuthenticating: false
    }
    
    this.observer = null;
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
    console.log("Updated props", this.props);
    if (this.props.firebaseAuth.currentUser) {
      console.log("Current props", this.props);
      console.log("Prevprops", prevProps);
      this.observer = this.props.firebaseAuth.onAuthStateChanged((user, error, completed) => {
        if (user) {
          console.log("Auth state changed!", user);
          this.props.onFirebaseAuthStateChanged(user);
          this.setState({finishedAuthenticating: true})
          
          completed(() => {
            console.log('The thing was removed');
          })
          // this.props.disableLoginForm();
        }
      })

      // this.unregisterAuthObserver();

      // console.log(this.unregisterAuthObserver);
    }
  }

  componentWillUnmount() {
    console.log("Unmounting");
    // console.log(this.unregisterAuthObserver);
    this.observer(); 
    this.observer = null;
    // console.log("Unmounting", this.unregisterAuthObserver());
  }

  render() {
    return (
      <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.props.firebaseAuth} />
    )
  }
}

export default LoginForm;