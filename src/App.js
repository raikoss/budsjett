import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import '../node_modules/materialize-css/dist/js/materialize.min.js';
import ChangeBalanceForm from "./components/ChangeBalanceForm";
import Chart from "./components/Chart";
import TransactionOverview from "./components/TransactionOverview";
import Nav from "./components/Nav";

const firebase = require("firebase");
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
      categories: []
    }

    this.addUser = this.addUser.bind(this);
    this.fabClickHandler = this.fabClickHandler.bind(this);
    this.cancelCreatingTransaction = this.cancelCreatingTransaction.bind(this);
    this.createTransaction = this.createTransaction.bind(this);
  }

  addUser(user) {
    this.state.db.collection("users").add({
      first: user.first,
      middle: user.middle, 
      last: user.last,
      born: user.born
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  showUsers() {
    this.state.db.collection("users").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => `, doc.data());
      });
    });
  }

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
    
    this.setState({db: db});
  }

  componentDidMount() {
    this.initFirestore();

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

  fabClickHandler() {
    this.setState({creatingTransaction: true});
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
    } else {
      renderingPage = <TransactionOverview 
        transactions={this.state.transactions} 
        fetching={this.state.fetchingTransactions}
        fabClickHandler={this.fabClickHandler} 
      />;
    }

    return (
      <div>
        <Nav />       
        <div className="container" >
          {renderingPage}
        </div>
      </div>
    );
  }
}

export default App;
