import React, {Component} from "react";
import { GithubPicker } from "react-color";
import "../styles/budgetPage.css"
// https://casesandberg.github.io/react-color/

class CreateBudget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [], 
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

  addCategory = () => {
    const categories = this.state.categories;
    const randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    const newCategory = {
      name: "", 
      amount: "", 
      color: randomColor
    }

    categories.push(newCategory);
    this.setState({categories});
  }

  cancelBudget = () => {
    
  }

  componentDidMount() {
    window.M.updateTextFields();
    const toolTips = document.querySelectorAll('.tooltipped');
    window.M.Tooltip.init(toolTips, {});
  }

  render() {
    return (
      <div className="create-budget-container">
       <h3>{this.props.firstTime ? "Opprett" : "Endre"} budsjett</h3>
        <div className="input-field" style={{margin: "20px 0"}}>
          <input type="text" id="budget-name-input" className="validate" name="budgetName" value={this.state.budgetName} placeholder="Mitt budsjett" onChange={this.onChange} />
          <label htmlFor="budget-name-input" className="active">Budsjettnavn</label>
        </div>

        <h4>Kategorier</h4>

        <div className="categories-container row">
          {this.state.categories.length > 0 ? 
            this.state.categories.map((category, i) => 
              <div key={i} className="edit-category col s12">
                <div className="col s6 m3">
                  <div className="input-field">
                    <input 
                      type="text" 
                      id={"category-name-input-" + i} 
                      className="validate" 
                      name="name"
                      placeholder="Hygiene, mat, osv." 
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
                    <label htmlFor={"category-amount-input-" + i}>Forventede kr</label> 
                  </div>
                </div>

                <div className="col s4 m2 center-align">
                  <div style={{border: "1px solid black", height: 30, width: 30, borderRadius: 15, backgroundColor: category.color, display: "inline-block"}}>

                  </div>
                </div>

                <div className="col s8 m4 center-align">
                  <GithubPicker
                    value={category.color}
                    onChange={(color) => this.onCategoryColorChange(color, i)}
                  />
                </div>
              </div>
            )
            : 
            <p className="no-categories">Du har ingen kategorier enda!</p>
          }
          
        </div>

        <a className="waves-effect waves-light btn" onClick={this.addCategory}><i className="material-icons left">add</i>Ny kategori</a>

        <p style={{marginTop: 30}}>
          Siden du ikke har et budsjett fra før er du nødt til å opprette et for å gå videre.
          Du kan selvfølgelig endre på det etter det er lagret. 
        </p>

        <div className="right-align">
          {this.props.firstTime ? 
          <a className="btn cancel-button tooltipped disabled" data-position="top" data-tooltip="I am a tooltip">Avbryt</a>          
          : 
          <a className="waves-effect btn cancel-button tooltipped" onClick={this.cancelBudget} data-position="top" data-tooltip="I am a tooltip">Avbryt</a>
          }
          <a className="waves-effect btn save-button" onClick={this.saveBudget}>Lagre</a>
        </div>

      </div>
    )
  }
}

export default CreateBudget;