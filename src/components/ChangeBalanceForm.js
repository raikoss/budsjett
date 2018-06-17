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
            window.M.FormSelect.init(elems, {classes: ""});
        });
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    createTransaction() {
        this.props.createTransaction({...this.state});
        // const db = this.props.db;

        // db.collection("transactions").add({
        //     ...this.state
        // })
        // .then(function(docRef) {
        //     console.log("Document written with ID: ", docRef.id);
        // })
        // .catch(function(error) {
        //     console.error("Error adding document: ", error);
        // });
    }

    // static getDerivedStateFromProps(newProps, prevState) {
    //     document.addEventListener('DOMContentLoaded', function() {
    //         var elems = document.querySelectorAll('select');
    //         window.M.FormSelect.init(elems, {classes: ""});
    //     });

    //     return null;
    // }

    render() {
        return (
            <div className="row">
                <div className="col s12 m10 l8 offset-m1 offset-l2 z-depth-1" style={{borderRadius: "3px"}}>
                    <div className="balance-form-container row">
                        <div>
                            <a className="waves-effect waves-light btn col s12 center-align" onClick={this.props.cancelCreatingTransaction}>Tilbake</a>
                        </div>
                        <div className="col s12 m4">
                            <div className="input-field">
                                <input id="amount" className="validate" type="number" value={this.state.amount} onChange={event => this.setState({amount: event.target.value.replace(/\D/,'')})} name="amount" />
                                <label htmlFor="amount">Amount</label>
                            </div>
                        </div>
                        <div className="input-field col s12 m8">
                            <select id="category" className="browser-default" value={this.state.categoryId} onChange={this.handleChange} name="categoryId">
                                {/* <option value="0" disabled>Kategori</option>
                                <option value="1">Fyll og fanteri</option>
                                <option value="2">Mat</option>
                                <option value="3">Tull og tøys</option> */}
                                {this.props.categories.map(category => 
                                    <option value={category.id}>{category.name}</option>
                                )}
                            </select>
                            <label htmlFor="category">Category</label>
                        </div>
                        <div className="col s12">
                            <div className="input-field">
                                <input id="comment" className="validate" type="text" value={this.state.comment} onChange={this.handleChange} name="comment" />
                                <label htmlFor="comment">Comment</label>
                            </div>
                        </div>
                        <a className="waves-effect waves-light btn col s4 offset-s4" onClick={this.createTransaction}>Legg til</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangeBalanceForm;