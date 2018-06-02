import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import '../node_modules/materialize-css/dist/js/materialize.min.js';
import ChangeBalanceForm from "./components/ChangeBalanceForm";
import Chart from "./components/Chart";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: null, 
      creatingTransaction: false, 
      height: 0,
      width: 0
    }

    this.element;

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
    
    // Initialize Cloud Firestore through Firebase
    this.setState({db: firebase.firestore()}, () => {
      const settings = {timestampsInSnapshots: true};
      this.state.db.settings(settings);
    })
    // db = firebase.firestore();
  }

  componentDidMount() {
    this.initFirestore();

    const height = this.element.clientHeight;
    const width = this.element.clientWidth;

    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.fixed-action-btn');
      var instances = window.M.FloatingActionButton.init(elems, {});
    });

    console.log(height);
    this.setState({height: height, width: width});
  }

  render() {
    const chartData = {
      labels: ["Test1", "Test2"], 
      datasets: [
        {
          label: "First set", 
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,0.8)",
          highlightFill: "rgba(220,220,220,0.75)",
          highlightStroke: "rgba(220,220,220,1)",
          data: [65, 59]
        }, {
          label: "Second set", 
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,0.8)",
          highlightFill: "rgba(220,220,220,0.75)",
          highlightStroke: "rgba(220,220,220,1)",
          data: [13, 34]
        }
      ]
    }

    const chartOptions = {

    }

    const mainPage = <div ref={element => this.element = element}>
        <div className="fixed-action-btn">
          <a className="btn-floating btn-large red" onClick={() => this.setState({creatingTransaction: true})}>
            <i className="large material-icons">add</i>
          </a>
        </div>
        <Chart data={chartData} options={chartOptions} parentHeight={this.state.height} parentWidth={this.state.width} />
      </div>

    const transactionPage = <ChangeBalanceForm adding={true} db={this.state.db} />;

    let renderingPage;

    if (this.state.creatingTransaction) {
      renderingPage = transactionPage;
    } else {
      renderingPage = mainPage;
    }

    return (
      <div className="container" >
        {renderingPage}
      </div>
    );
  }
}

export default App;
