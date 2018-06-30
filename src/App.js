import React, { Component } from 'react';
import './App.css';

import ChangeBalanceForm from "./components/ChangeBalanceForm";
import Chart from "./components/Chart";
import TransactionOverview from "./components/TransactionOverview";
import Nav from "./components/Nav";
import LoginForm from "./components/LoginForm";
import Footer from "./components/Footer";
import Spinner from './components/Spinner';
import CreateBudget from './components/EditBudget';

import moment from "moment";
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
      budget: null,
      displayBudget: false, 
      firebaseAuth: null, 
      displayTransactionOverview: false, 
      initialLoading: true
    }

    this.fabClickHandler = this.fabClickHandler.bind(this);
    this.cancelTransactionForm = this.cancelTransactionForm.bind(this);
    this.loginButtonClickHandler = this.loginButtonClickHandler.bind(this);
    this.logoutButtonClickHandler = this.logoutButtonClickHandler.bind(this);

    this.userDocRef = null;
    this.categoryDocRefs = null;
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
        this.setState({user});

        const promise = usersRef
        .where("uid", "==", user.uid)
        .get()
        .then(querySnapshot => {
          const userDoc = querySnapshot.docs[0];
          const userDocId = userDoc.id;
          
          const budgetName = userDoc.data().budgetName;
          this.setState({budget: { budgetName }});
          console.log("UserDocData", userDoc.data());

          this.userDocRef = usersRef.doc(userDocId);

          const categoriesCollectionRef = this.userDocRef.collection("categories");
          return categoriesCollectionRef.get();
        })
        .then(querySnapshot => {
          const budget = this.state.budget;

          if (querySnapshot.docs.length === 0) {
            this.setState({budget: null})
          } else {
            this.categoryDocRefs = [];
            const categories = [];
            querySnapshot.forEach(doc => {
              categories.push({...doc.data(), id: doc.id});
              const docRef = this.userDocRef.collection("categories").doc(doc.id);
              this.categoryDocRefs.push(docRef);
            })

            budget.categories = categories;
          }

          console.log("Budget is", budget);

          // console.log(querySnapshot.docs.length);
          // querySnapshot.forEach(doc => {
          //   console.log("Budget doc", doc);
          // })
          this.setState({initialLoading: false, budget})
          
          return this.fetchTransactions();
        })
        .then(querySnapshots => {
          const categories = this.state.budget.categories;

          querySnapshots.map(snapshot => {
            snapshot.forEach(doc => {
              const parentDocId = doc.ref.parent.parent.id;
              const category = this.state.budget.categories.find(category => category.id === parentDocId);
              const transaction = {...doc.data(), id: doc.id};

              category.transactions.push(transaction);
              categories.push(category);
            })
          })

          this.setState({budget: {...this.state.budget, categories}, fetchingTransactions: false});
        })
      } else {
        this.setState({
          initialLoading: false,
          user: null
        })
      }
    })
    
    this.setState({db, firebaseAuth});
  }

  componentDidMount() {
    this.initFirebase();

    // FAB
    const elems = document.querySelectorAll('.fixed-action-btn');
    window.M.FloatingActionButton.init(elems, {});
  }

  fetchTransactions() {
    const dataPromises = this.categoryDocRefs.map(docRef => {
      return docRef.collection("transactions").get()
    })

    return Promise.all(dataPromises);
  }

  fetchCategories() {
    return;
  }

  saveBudget = (budget) => {
    const categoriesCollectionRef = this.userDocRef
    .collection("categories");

    this.userDocRef.update({
      budgetName: budget.budgetName
    })
    .then(() => {
      const dataPromises = budget.categories.map(category => {
        return categoriesCollectionRef.doc().set({...category})
      })

      return Promise.all(dataPromises);
    })
    .then(() => {
      console.log("The categories were added!");
      this.setState({displayBudget: false, displayTransactionOverview: true});
    })
    .catch(err => {
      console.log(err.message);
    })
  }

  fabClickHandler() {
    this.setState({displayCreateTransactionForm: true});
  }

  loginButtonClickHandler() {
    this.setState({displayCreateTransactionForm: false});
  }

  logoutButtonClickHandler() {
    this.state.firebaseAuth.signOut()
    .then(() => {
      this.setState({displayCreateTransactionForm: false});
    })
    .catch(error => {
      console.log("Couldn't sign out!", error);
    })
  }

  addTransaction = (transaction) => {
    this.userDocRef.collection("categories").doc(transaction.categoryId).collection("transactions").add({
      amount: transaction.amount, 
      adding: transaction.adding, 
      comment: transaction.comment, 
      date: moment.utc()
    })
    .then(docRef => {
      console.log("Added transaction with docref", docRef);
      this.setState({displayCreateTransactionForm: false, displayTransactionOverview: true});
    })
    // this.state.db.collection("transactions").add({
    //   ...this.state
    // })
    // .then(function(docRef) {
    //   console.log("Document written with ID: ", docRef.id);
    // })
    // .catch(function(error) {
    //   console.error("Error adding document: ", error);
    // });
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

    const footer = <Footer />

    if (this.state.db && this.state.firebaseAuth) {
      if (this.state.user) {
        if (!this.state.budget) {
          // ----- CREATE BUDGET ------
          renderingPage = <CreateBudget
            firstTime={true}
            saveBudget={this.saveBudget}
            budget={this.state.budget}
          />
        } else if (this.state.displayCreateTransactionForm) {
          // ----- ADD TRANSACTION FORM ------
          renderingPage = <ChangeBalanceForm 
            adding={true} 
            categories={this.state.budget.categories} 
            cancelTransactionForm={this.cancelTransactionForm} 
            addTransaction={this.addTransaction}
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

    return (
      <div>
        { nav }

        <main>
          {!this.state.initialLoading ? 
            <div className="container" >
              {renderingPage}
            </div>
            : 
            <div className="page-loader">
              <Spinner />
            </div>
          }
        </main>

        {/* { footer } */}
      </div>
    )
  }
}

export default App;
