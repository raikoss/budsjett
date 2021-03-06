import React, {Component} from 'react';
import "../styles/nav.css";

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      links: []
      // links: [
      //   this.props.user ? {
      //     onClick: this.props.logoutButtonClickHandler, 
      //     text: 'Logg ut'
      //   } : {
      //     onClick: this.props.loginButtonClickHandler, 
      //     text: 'Logg inn'
      //   }
      // ]
    }
  }

  componentDidMount() {
    const elems = document.querySelectorAll('.sidenav');
    window.M.Sidenav.init(elems, {});
  }

  componentDidUpdate() {
    // console.log("Nav updated", this.props.user);
    // if (this.props.user) {
    //   this.setState({})
    //   this.links[0] = {
    //     onClick: this.props.logoutButtonClickHandler, 
    //     text: 'Logg ut'
    //   }
    // } else {
    //   this.links[0] = {
    //     onClick: this.props.loginButtonClickHandler, 
    //     text: 'Logg inn'
    //   }
    // }
  }

  render() {
    const links = this.state.links.map((link, i) => {
      return (
        <li key={i}><a  onClick={link.onClick}>{link.text}</a></li>
      )
    })

    if (this.props.user) {
      links.unshift(
        <li key="logout-key">
          <a onClick={this.props.logoutButtonClickHandler}>Logg ut</a>
        </li>
      );
    } else {
      links.unshift(
        <li key="login-key">
          <a href="#" onClick={this.props.loginButtonClickHandler}>Logg inn</a>
        </li>
      );
    }

    return (
      <header>
        <div style={{marginBottom: "20px"}}>
          <nav>
            <div className="container">
              <div className="nav-wrapper">
                <a href="#!" className="brand-logo">Logo</a>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                  {links}
                </ul>
              </div>
            </div>
          </nav>

          {this.props.user && 
            <div className='right-align container'>
              <p style={{margin: 0}}>
                <span className="username z-depth-1">{this.props.user.displayName}</span>
              </p>
            </div>
          }
        </div>

        <ul className="sidenav" id="mobile-demo">
          {links}
        </ul>

      </header>
    )
  }
}

export default Nav;