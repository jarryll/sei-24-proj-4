import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProtectedRoute({component: Component, ...rest}) {
    return (
        <div>
            <Route 
            {...rest}
            render = {props => {
                if (!Cookies.get('auth')) {
                    return (
                        <Redirect to={{
                            pathname:"/login",
                            state: {
                                from: props.location
                            }
                        }} />
                    )
                } else {
                    return (
                    <Component {...props} />
                    )
                }        
            }} 
            />        
        </div>
    );
}
