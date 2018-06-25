import React, { Component } from 'react';
import './App.css';
import ChangeBalanceForm from "./components/ChangeBalanceForm";
import Chart from "./components/Chart";
import TransactionOverview from "./components/TransactionOverview";
import Nav from "./components/Nav";
import LoginForm from "./components/LoginForm";

import firebase from "firebase";
import Spinner from './components/Spinner';
import CreateBudget from './components/CreateBudget';
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
      budget: null,
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
      this.setState({initialLoading: true});
      
      if (user) {
        const usersRef = this.state.db.collection("users");
        console.log("Checking for uid", user.uid);

        const promise = usersRef
        .where("uid", "==", user.uid)
        .get()
        .then(querySnapshot => {
          const userDoc = querySnapshot.docs[0];
          const userDocId = userDoc.id;
          console.log(userDoc.data());

          const budgetsRef = usersRef.doc(userDocId).collection("budgets");
          return budgetsRef.get();
        })
        .then(querySnapshot => {
          if (querySnapshot.docs.length === 0) {
            this.setState({budget: null})
          }

          console.log(querySnapshot.docs.length);
          querySnapshot.forEach(doc => {
            console.log("Budget doc", doc);
          })

          this.setState({initialLoading: false, user})
        })

        // this.setState({
        //   // user: {
        //   //   uid: user.uid, 
        //   //   name: user.displayName, 
        //   //   email: user.email, 
        //   //   phoneNumber: user.phoneNumber
        //   // }, 
          
        // })
        
        // this.fetchTransactions();
        // this.fetchCategories();
      } else {
        this.setState({
          initialLoading: false,
          user: null
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
    const nav = <Nav 
      loginButtonClickHandler={this.loginButtonClickHandler} 
      logoutButtonClickHandler={this.logoutButtonClickHandler} 
      user={this.state.user}
    /> 

    if (this.state.db && this.state.firebaseAuth) {
      if (this.state.user) {
        if (!this.state.budget) {
          renderingPage = <CreateBudget
            firstTime={true}
          />
        } else if (this.state.displayCreateTransactionForm) {
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
          {nav}

          <div className="container" >
            {renderingPage}
          </div>
        </div>
      )
    } else {
      return (
        <div>
          {nav}

          <div className="page-loader">
            <Spinner />
          </div>
        </div>
      )
    }
  }
}

export default App;
