import React from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

export default function Logout() {
    const history=useHistory();
    const logout = () =>{
        Cookies.remove('auth')
        history.push('/login')
    }
    return (
            <button onClick={logout} className="btn btn-primary float-right" id="logout-btn" type="button">Log Out</button>
    )
}
