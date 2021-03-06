import React, {Component} from "react";
import "../styles/transactionOverview.css";
import Spinner from "./Spinner";
import Transaction from "./Transaction";

class TransactionOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 0,
            width: 0, 
            // transactions: []
        }

        this.element = null;
    }

    componentDidMount() {
        const height = this.element.clientHeight;
        const width = this.element.clientWidth;

        this.setState({height: height, width: width});
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.db !== this.props.db) {
            

    //     }
    // }

    // static getDerivedStateFromProps(newProps, prevState) {
    //     let newState = {};
    //     if (newProps.db != prevState.db) {
    //         newState.db = newProps.db;

    //         newState.db.collection("change").get()
    //         .then((querySnapshot) => {
    //             // this.setState({transactions: querySnapshot});
    //             newState.transactions = [];

    //             querySnapshot.forEach((doc) => {
    //                 newState.transactions.push(doc.data());
    //                 // console.log(`${doc.id} => `, doc.data());
    //             });
    //         });
    //     } 

    //     console.log("Returning newState", newState);

    //     return newState;
    // }

    render() {
        // const chartData = {
        //     labels: ["Test1", "Test2"], 
        //     datasets: [
        //       {
        //         label: "First set", 
        //         fillColor: "rgba(220,220,220,0.5)",
        //         strokeColor: "rgba(220,220,220,0.8)",
        //         highlightFill: "rgba(220,220,220,0.75)",
        //         highlightStroke: "rgba(220,220,220,1)",
        //         data: [65, 59]
        //       }, {
        //         label: "Second set", 
        //         fillColor: "rgba(220,220,220,0.5)",
        //         strokeColor: "rgba(220,220,220,0.8)",
        //         highlightFill: "rgba(220,220,220,0.75)",
        //         highlightStroke: "rgba(220,220,220,1)",
        //         data: [13, 34]
        //       }
        //     ]
        //   }
      
        //   const chartOptions = {
      
        //   }

        const fab = <div className="fixed-action-btn">
            <a className="btn-floating btn-large red" onClick={this.props.fabClickHandler}>
                <i className="large material-icons">add</i>
            </a>
        </div>;

        const page = this.props.fetching ? 
        <div className="center-align" style={{margin: "10px 0"}}>
            <Spinner />
        </div>
        : 
        <div className="transactions-container">
        {this.props.transactions.map(transaction =>
            <Transaction transaction={transaction} key={transaction.id} />
        )}
        </div>

        return (
            <div>
                {fab}
                <div ref={element => this.element = element}>
                    <div style={{width: "100%", height: "300px", border: "1px solid black"}} ></div>
                    {page}
                    {/* <Chart data={chartData} options={chartOptions} parentHeight={this.state.height} parentWidth={this.state.width} /> */}
                </div>
            </div>
        )
    }
}

export default TransactionOverview;