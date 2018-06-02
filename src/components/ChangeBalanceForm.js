import React, {Component} from 'react';
import "../styles/balanceForm.css";

class ChangeBalanceForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adding: this.props.adding, 
            amount: "", 
            categoryId: "0", 
            comment: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.createTransaction = this.createTransaction.bind(this);
    }

    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('select');
            var instances = window.M.FormSelect.init(elems, {classes: ""});
        });
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    createTransaction() {
        const db = this.props.db;

        db.collection("change").add({
            ...this.state
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col s8 offset-s2 z-depth-3" style={{borderRadius: "3px"}}>
                    <div className="balance-form-container">
                        <div className="input-field">
                            <input id="amount" className="validate" type="number" value={this.state.amount} onChange={event => this.setState({amount: event.target.value.replace(/\D/,'')})} name="amount" />
                            <label htmlFor="amount">Amount</label>
                        </div>
                        <select value={this.state.categoryId} onChange={this.handleChange} name="categoryId">
                            <option value="0" disabled>Kategori</option>
                            <option value="1">Fyll og fanteri</option>
                            <option value="2">Mat</option>
                            <option value="3">Tull og tøys</option>
                        </select>
                        <div className="input-field">
                            <input id="comment" className="validate" type="text" value={this.state.comment} onChange={this.handleChange} name="comment" />
                            <label htmlFor="comment">Comment</label>
                        </div>
                        <a className="waves-effect waves-light btn" onClick={this.createTransaction}>Legg til</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangeBalanceForm;