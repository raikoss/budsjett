import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import '../node_modules/materialize-css/dist/js/materialize.min.js';
import ChangeBalanceForm from "./components/ChangeBalanceForm";
import Chart from "./components/Chart";
import TransactionOverview from "./components/TransactionOverview";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: null, 
      creatingTransaction: false
    }

    this.addUser = this.addUser.bind(this);
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

    firebase.initializeApp(config);
    let db = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    db.settings(settings);
    
    // Initialize Cloud Firestore through Firebase
    this.setState({db: db});
    // db = firebase.firestore();
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

  render() {
    const mainPage = <TransactionOverview db={this.state.db} />

    const transactionPage = <ChangeBalanceForm adding={true} db={this.state.db} />;

    let renderingPage;

    if (this.state.creatingTransaction) {
      renderingPage = transactionPage;
    } else {
      renderingPage = mainPage;
    }

    return (
      <div>
        <nav style={{marginBottom: "20px"}}>
        <div className="container">
          <div className="nav-wrapper">
            <a href="#!" className="brand-logo">Logo</a>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            <ul className="right hide-on-med-and-down">
              <li><a href="sass.html">Sass</a></li>
              <li><a href="badges.html">Components</a></li>
              <li><a href="collapsible.html">Javascript</a></li>
              <li><a href="mobile.html">Mobile</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        <li><a href="sass.html">Sass</a></li>
        <li><a href="badges.html">Components</a></li>
        <li><a href="collapsible.html">Javascript</a></li>
        <li><a href="mobile.html">Mobile</a></li>
      </ul>
        
        <div className="container" >
          {renderingPage}
        </div>
      </div>
    );
  }
}

export default App;
