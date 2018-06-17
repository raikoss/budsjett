import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import '../node_modules/materialize-css/dist/js/materialize.min.js';
import ChangeBalanceForm from "./components/ChangeBalanceForm";
import Chart from "./components/Chart";
import TransactionOverview from "./components/TransactionOverview";
import Nav from "./components/Nav";
import LoginForm from "./components/LoginForm";

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
// Required for side-effects
require("firebase/firestore");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: null, 
      creatingTransaction: false, 
      transactions: [], 
      fetchingTransactions: true, 
      categories: [], 
      displayLoginForm: false, 
      user: null
    }

    // this.addUser = this.addUser.bind(this);
    this.fabClickHandler = this.fabClickHandler.bind(this);
    this.cancelCreatingTransaction = this.cancelCreatingTransaction.bind(this);
    this.createTransaction = this.createTransaction.bind(this);
    this.loginButtonClickHandler = this.loginButtonClickHandler.bind(this);
  }

  // addUser(user) {
  //   this.state.db.collection("users").add({
  //     first: user.first,
  //     middle: user.middle, 
  //     last: user.last,
  //     born: user.born
  //   })
  //   .then(function(docRef) {
  //       console.log("Document written with ID: ", docRef.id);
  //   })
  //   .catch(function(error) {
  //       console.error("Error adding document: ", error);
  //   });
  // }

  // showUsers() {
  //   this.state.db.collection("users").get()
  //   .then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       console.log(`${doc.id} => `, doc.data());
  //     });
  //   });
  // }

  initFirestore() {
    var config = {
      apiKey: "AIzaSyAOxRxd8EpD2m_q5uJebxp0syDEUaObx0U",
      authDomain: "budsjett-235ad.firebaseapp.com",
      databaseURL: "https://budsjett-235ad.firebaseio.com",
      projectId: "budsjett-235ad",
      storageBucket: "budsjett-235ad.appspot.com",
      messagingSenderId: "188186445285"
    };
    
    // Initialize Cloud Firestore through Firebase
    firebase.initializeApp(config);
    const db = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    db.settings(settings);
    
    this.setState({db});
  }

  initFirebaseAuth() {
    this.uiConfig = {
      // Popup signin flow rather than redirect flow.
      signInFlow: 'popup',
      // We will display Google and Facebook as auth providers.
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID, 
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: (authResult) => {
          console.log(authResult);
          return false;
        }
      }
    }

    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      this.setState({user: {
        id: user.uid, 
        name: user.displayName, 
        email: user.email, 
        phoneNumber: user.phoneNumber
      }})
    });
  }

  componentDidMount() {
    this.initFirestore();
    this.initFirebaseAuth();

    // FAB
    document.addEventListener('DOMContentLoaded', function() {
      const elems = document.querySelectorAll('.fixed-action-btn');
      window.M.FloatingActionButton.init(elems, {});
    });

    // Nav
    document.addEventListener('DOMContentLoaded', function() {
      const elems = document.querySelectorAll('.sidenav');
      window.M.Sidenav.init(elems, {});
    });
  }

  fetchTransactions() {
    const transactions = [];
    this.state.db.collection("change").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          transactions.push({...doc.data(), id: doc.id});
          console.log(`${doc.id} => `, doc.data());
      });

      this.setState({transactions, fetchingTransactions: false});
    });
  }

  fetchCategories() {
    return;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.db !== this.state.db) {
      this.fetchTransactions();
      this.fetchCategories();
    }
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  fabClickHandler() {
    this.setState({creatingTransaction: true, displayLoginForm: false});
  }

  loginButtonClickHandler() {
    this.setState({displayLoginForm: true, creatingTransaction: false});
  }

  createTransaction() {
    this.state.db.collection("transactions").add({
      ...this.state
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  cancelCreatingTransaction() {
    this.setState({creatingTransaction: false});
  }

  render() {
    let renderingPage = null;

    if (this.state.creatingTransaction) {
      renderingPage = <ChangeBalanceForm 
        adding={true} 
        categories={this.state.categories} 
        cancelCreatingTransaction={this.cancelCreatingTransaction} 
        createTransaction={this.createTransaction}
      />;
    } else if (this.state.displayLoginForm) {
      renderingPage = <LoginForm />
    } else {
      renderingPage = <TransactionOverview 
        transactions={this.state.transactions} 
        fetching={this.state.fetchingTransactions}
        fabClickHandler={this.fabClickHandler} 
      />;
    }

    return (
      <div>
        <Nav loginButtonClickHandler={this.loginButtonClickHandler} />       
        <div className="container" >
          {renderingPage}
          {this.state.db && 
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
          }
        </div>
      </div>
    );
  }
}

export default App;
