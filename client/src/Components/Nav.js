import React from 'react';
import Cookies from 'js-cookie';
import { useHistory, Link } from 'react-router-dom';

export default function Nav() {
    const history=useHistory();
    const logout = () =>{
        Cookies.remove('auth')
        history.push('/login')
    }
    return (
        <nav className="navbar navbar-light bg-light">
            <Link to="/" className="navbar-brand" >
                <img src="/images/travel-itinerary.svg" width="30" height="30" class="d-inline-block align-top" alt="travel-memo-logo" />
                <span className="app-name">Travel Memo</span>
            </Link>
            <ul className="navbar-nav mr-auto">
            <li className="nav-item">
            <Link to="/dashboard" className="nav-link">My Dashboard</Link>
            </li>
            </ul>
            <button onClick={logout} className="btn btn-primary float-right" id="logout-btn" type="button">Log Out</button>
        </nav>
    )
}
