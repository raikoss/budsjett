import React, {Component} from "react";
import { GithubPicker } from "react-color";
// https://casesandberg.github.io/react-color/

class CreateBudget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [
        {
          name: "Den kule kategorien", 
          amount: "2000"
        }
      ], 
      amount: "", 
      budgetName: ""
    }
  }

  onChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({[name]: value});
  }

  onCategoryInputChange = (event, index) => {
    const categories = this.state.categories;
    const target = event.target;
    categories[index][target.name] = target.value;

    this.setState({categories});
  }

  onCategoryColorChange = (color, index) => {
    const categories = this.state.categories;
    categories[index].color = color.hex;
    this.setState({categories});
  }

  componentDidMount() {
    window.M.updateTextFields();
  }

  render() {
    return (
      <div className="create-budget-container">
       <h2>{this.props.firstTime ? "Opprett" : "Endre"} budsjett</h2>
        <div className="input-field">
          <input type="text" id="budget-name-input" className="validate" name="budgetName" value={this.state.budgetName} placeholder="Mitt budsjett" onChange={this.onChange} />
          <label htmlFor="budget-name-input" className="active">Budsjettnavn</label>
        </div>
        <div className="input-field">
          <input type="number" id="budget-amount-input" className="validate" name="amount" value={this.state.amount} placeholder="5000" onChange={this.onChange} />
          <label htmlFor="budget-amount-input" className="active">Totalt disponsibelt beløp</label>
        </div>


        <div className="categories-container row">
          {this.state.categories.map((category, i) => 
            <div key={i}>
              <div className="col s6 m3">
                <div className="input-field">
                  <input 
                    type="text" 
                    id={"category-name-input-" + i} 
                    className="validate" 
                    name="name"
                    placeholder="Mitt budsjett" 
                    value={category.name} 
                    onChange={(e) => this.onCategoryInputChange(e, i)} 
                  />
                  <label htmlFor={"category-name-input-" + i} className="active">Navn på kategori</label>
                </div>
              </div>

              <div className="col s6 m3">
                <div className="input-field">
                  <input 
                    type="number" 
                    id={"category-amount-input-" + i}
                    className="validate" 
                    name="amount"
                    value={category.amount} 
                    onChange={(e) => this.onCategoryInputChange(e, i)} 
                  />
                  <label htmlFor={"category-amount-input-" + i}>Grense</label> 
                </div>
              </div>

              <div className="col s4">
                <GithubPicker
                  value={category.color}
                  onChange={(color) => this.onCategoryColorChange(color, i)}
                />
              </div>

              <div className="col s2">
                <div style={{border: "1px solid black", height: 30, width: 30, borderRadius: 15, backgroundColor: category.color}}>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default CreateBudget;