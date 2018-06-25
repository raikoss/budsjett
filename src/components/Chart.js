// import React, {Component} from "react";
// // var LineChart = require("react-chartjs").Line;
// import {Line as LineChart} from "react-chartjs";
// // https://github.com/reactjs/react-chartjs 

// class Chart extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             height: "", 
//             width: ""
//         }
//     }

//     componentDidMount() {
//         console.log("Parent height", this.props.parentHeight);  
//     }

//     static getDerivedStateFromProps(props, state) {
//         return {
//             height: props.parentHeight ? props.parentHeight / 2 : "", 
//             width: props.parentWidth ? props.parentWidth / 2 : ""
//         }
//     }

//     render() {
//         return <LineChart data={this.props.data} options={this.props.options} width={this.state.width} height={this.state.height}/>
//     }
// }

// export default Chart;