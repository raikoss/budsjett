import React, {Component} from 'react';
import "../styles/nav.css";

class Nav extends Component {
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
                                <li><a href="#" onClick={this.props.loginButtonClickHandler}>Logg inn</a></li>
                                <li><a href="badges.html">Components</a></li>
                                <li><a href="collapsible.html">Javascript</a></li>
                                <li><a href="mobile.html">Mobile</a></li>
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
                    <li><a href="badges.html">Components</a></li>
                    <li><a href="collapsible.html">Javascript</a></li>
                    <li><a href="mobile.html">Mobile</a></li>
                </ul>
            </div>
        )
    }
}

export default Nav;