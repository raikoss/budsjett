import React, {Component} from 'react';
import "../styles/nav.css";

class Nav extends Component {
  constructor(props) {
    super(props);

    this.links = [
      this.props.user ? {
        onClick: this.props.logoutButtonClickHandler, 
        text: 'Logg ut'
      } : {
        onClick: this.props.loginButtonClickHandler, 
        text: 'Logg inn'
      }
    ]
  }

  componentDidMount() {
    const elems = document.querySelectorAll('.sidenav');
    window.M.Sidenav.init(elems, {});
  }

  componentDidUpdate() {
    if (this.props.user) {
      this.links[0] = {
        onClick: this.props.logoutButtonClickHandler, 
        text: 'Logg ut'
      }
    } else {
      this.links[0] = {
        onClick: this.props.loginButtonClickHandler, 
        text: 'Logg inn'
      }
    }
  }

  render() {
    const links = this.links.map((link, i) => {
      return (
        <li key={i}><a href={link.href} onClick={link.onClick}>{link.text}</a></li>
      )
    })

    return (
      <div>
        <div style={{marginBottom: "20px"}}>
          <nav style={{backgroundColor: "#08d36e"}}>
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

      </div>
    )
  }
}

export default Nav;