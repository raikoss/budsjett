import React, {Component} from 'react';
import "../styles/nav.css";

class Nav extends Component {

  componentDidMount() {
    // Nav
    document.addEventListener('DOMContentLoaded', function() {
      const elems = document.querySelectorAll('.sidenav');
      window.M.Sidenav.init(elems, {});
    });
  }

  componentDidUpdate() {
    // Nav
    document.addEventListener('DOMContentLoaded', function() {
      const elems = document.querySelectorAll('.sidenav');
      window.M.Sidenav.init(elems, {});
    });
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: "20px"}}>
          <nav style={{backgroundColor: "#08d36e"}}>
            <div className="container">
              <div className="nav-wrapper">
                <a href="#!" className="brand-logo">Logo</a>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                {this.props.user ? 
                  <li><a href="#" onClick={this.props.logoutButtonClickHandler}>Logg ut</a></li>
                  :
                  <li><a href="#" onClick={this.props.loginButtonClickHandler}>Logg inn</a></li>
                }
                </ul>
              </div>
            </div>
          </nav>

          {this.props.user && 
            <div className='right-align container'>
              <p style={{margin: 0}}>
                <span className="username z-depth-1">{this.props.user.name}</span>
              </p>
            </div>
          }
        </div>


        <ul className="sidenav" id="mobile-demo">
          <li><a href="sass.html">Sass</a></li>
        </ul>
      </div>
    )
  }
}

export default Nav;