import React, { Component } from 'react';
import './App.css';
import ChangeBalanceForm from "./components/ChangeBalanceForm";
import Chart from "./components/Chart";
import TransactionOverview from "./components/TransactionOverview";
import Nav from "./components/Nav";
import LoginForm from "./components/LoginForm";

import firebase from "firebase";
import Spinner from './components/Spinner';
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
      // user: null, 
      firebaseAuth: null, 
      displayTransactionOverview: false, 
      initialLoading: true
    }

    // this.addUser = this.addUser.bind(this);
    this.fabClickHandler = this.fabClickHandler.bind(this);
    this.cancelTransactionForm = this.cancelTransactionForm.bind(this);
    this.createTransaction = this.createTransaction.bind(this);
    this.loginButtonClickHandler = this.loginButtonClickHandler.bind(this);
    this.logoutButtonClickHandler = this.logoutButtonClickHandler.bind(this);
    // this.onFirebaseAuthStateChanged = this.onFirebaseAuthStateChanged.bind(this);
    this.disableLoginForm = this.disableLoginForm.bind(this);
  }

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
    firebaseAuth.onAuthStateChanged(user => {
      console.log("State changed!", user);
      if (user) {
        const usersRef = this.state.db.collection("users");
        console.log("Checking for uid", user.uid);
        usersRef
        .where("uid", "==", user.uid)
        .limit(1)
        .get()
        .then(querySnapshot => {
          console.log(querySnapshot);
          querySnapshot.forEach(doc => {
            console.log(doc.data());
          })
          // if (doc.exists) {
          //   console.log("Got document for user", doc);
          // } else {
          //   console.log("Doc doesn't exist omg");
          // }

          // querySnapshot.forEach((doc) => {
          //   // transactions.push({...doc.data(), id: doc.id});
          //   console.log(`${doc.id} => `, doc.data());
          //   usersRef.doc(doc.id).collection("budgets").get()
          //   .then(snapshot => {
          //     snapshot.forEach(budgetDoc => {
          //       console.log(`${budgetDoc.id} => `, budgetDoc.data());
          //     })
          //   })
          // });
          // this.setState({transactions, fetchingTransactions: false});
        });
        this.setState({
          // user: {
          //   uid: user.uid, 
          //   name: user.displayName, 
          //   email: user.email, 
          //   phoneNumber: user.phoneNumber
          // }, 
          initialLoading: false
        })
        
        this.fetchTransactions();
        this.fetchCategories();
      } else {
        this.setState({
          initialLoading: false
        })
      }
    })
    
    this.setState({db, firebaseAuth});
  }

  onLogin = () => {
    const user = this.state.firebaseAuth.currentUser;
    this.setState({
      // user: {
      //   id: user.uid, 
      //   name: user.displayName, 
      //   email: user.email, 
      //   phoneNumber: user.phoneNumber
      // }, 
      displayLoginForm: false, 
      displayTransactionOverview: true
    })
  }

  disableLoginForm() {
    this.setState({displayLoginForm: false, displayTransactionOverview: true}, () => console.log("Disabled loginform"));
  }

  componentDidMount() {
    this.initFirebase();

    // FAB
    const elems = document.querySelectorAll('.fixed-action-btn');
    window.M.FloatingActionButton.init(elems, {});
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
    // if (!prevState.firebaseAuth.currentUser && this.state.firebaseAuth.currentUser) {
      

    // }
  }

  fabClickHandler() {
    this.setState({displayCreateTransactionForm: true, displayLoginForm: false});
  }

  loginButtonClickHandler() {
    this.setState({displayLoginForm: true, displayCreateTransactionForm: false});
  }

  logoutButtonClickHandler() {
    this.state.firebaseAuth.signOut()
    .then(() => {
      this.setState({displayLoginForm: true, displayCreateTransactionForm: false});
    })
    .catch(error => {
      console.log("Couldn't sign out!", error);
    })
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

    if (this.state.db && this.state.firebaseAuth) {
      if (this.state.firebaseAuth.currentUser) {
        if (this.state.displayCreateTransactionForm) {
          // ----- ADD TRANSACTION FORM ------
          renderingPage = <ChangeBalanceForm 
          adding={true} 
          categories={this.state.categories} 
          cancelTransactionForm={this.cancelTransactionForm} 
          createTransaction={this.createTransaction}
          />;
      } else {
          // ----- TRANSACTION OVERVIEW -----
          renderingPage = <TransactionOverview 
            transactions={this.state.transactions} 
            fetching={this.state.fetchingTransactions}
            fabClickHandler={this.fabClickHandler} 
          />;
        }
      } else {
        // ---- LOGIN FORM -----
        renderingPage = <LoginForm 
          firebaseAuth={this.state.firebaseAuth} 
          providers={[firebase.auth.EmailAuthProvider.PROVIDER_ID]}
          onLogin={this.onLogin}
          disableLoginForm={this.disableLoginForm}
          usersDocRef={this.state.db.collection("users")}
          // updateNameHandler={(displayName) => this.setState({user: {...this.state.user, name: displayName}})}
        />
      }
    }    

    if (!this.state.initialLoading) {
      return (
        <div>
          <Nav 
            loginButtonClickHandler={this.loginButtonClickHandler} 
            logoutButtonClickHandler={this.logoutButtonClickHandler} 
            user={this.state.firebaseAuth.currentUser}
          />       
          <div className="container" >
            {renderingPage}
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default App;
