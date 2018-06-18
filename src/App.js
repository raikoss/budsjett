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

import firebase from "firebase";
// Required for side-effects
require("firebase/firestore");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: null, 
      displayCreateTransactionForm: false, 
      transactions: [], 
      fetchingTransactions: true, 
      categories: [], 
      displayLoginForm: true, 
      user: null, 
      firebaseAuth: null, 
      displayTransactionOverview: false
    }

    // this.addUser = this.addUser.bind(this);
    this.fabClickHandler = this.fabClickHandler.bind(this);
    this.cancelTransactionForm = this.cancelTransactionForm.bind(this);
    this.createTransaction = this.createTransaction.bind(this);
    this.loginButtonClickHandler = this.loginButtonClickHandler.bind(this);
    this.onFirebaseAuthStateChanged = this.onFirebaseAuthStateChanged.bind(this);
    this.disableLoginForm = this.disableLoginForm.bind(this);
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

  initFirebase() {
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

    // Firebase Auth
    const firebaseAuth = firebase.auth();
    
    this.setState({db, firebaseAuth});
  }

  initFirebaseAuth() {
    
  }

  onFirebaseAuthStateChanged(user) {
    this.setState({
      user: {
        id: user.uid, 
        name: user.displayName, 
        email: user.email, 
        phoneNumber: user.phoneNumber
      }
    }, () => console.log("Set state user"))
  }

  disableLoginForm() {
    this.setState({displayLoginForm: false, displayTransactionOverview: true}, () => console.log("Disabled loginform"));
  }

  componentDidMount() {
    this.initFirebase();
    // this.initFirestore();
    // this.initFirebaseAuth();

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
    // this.unregisterAuthObserver();
  }

  fabClickHandler() {
    this.setState({displayCreateTransactionForm: true, displayLoginForm: false});
  }

  loginButtonClickHandler() {
    this.setState({displayLoginForm: true, displayCreateTransactionForm: false});
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

  cancelTransactionForm() {
    this.setState({displayCreateTransactionForm: false, displayTransactionOverview: true});
  }

  render() {
    let renderingPage = null;

    if (this.state.displayCreateTransactionForm) {
      // ----- ADD TRANSACTION FORM ------
      renderingPage = <ChangeBalanceForm 
        adding={true} 
        categories={this.state.categories} 
        cancelTransactionForm={this.cancelTransactionForm} 
        createTransaction={this.createTransaction}
      />;
    } else if (this.state.displayLoginForm) {
      // ---- LOGIN FORM -----
      renderingPage = <LoginForm 
        firebaseAuth={this.state.firebaseAuth} 
        providers={[firebase.auth.EmailAuthProvider.PROVIDER_ID]}
        onFirebaseAuthStateChanged={this.onFirebaseAuthStateChanged}
        disableLoginForm={this.disableLoginForm}
      />
    } else {
      // ----- TRANSACTION OVERVIEW -----
      renderingPage = <TransactionOverview 
        transactions={this.state.transactions} 
        fetching={this.state.fetchingTransactions}
        fabClickHandler={this.fabClickHandler} 
      />;
    }

    return (
      <div>
        <Nav 
          loginButtonClickHandler={this.loginButtonClickHandler} 
          user={this.state.user}
        />       
        <div className="container" >
          {renderingPage}
        </div>
      </div>
    );
  }
}

export default App;
