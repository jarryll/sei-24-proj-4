import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import {PlacesProvider} from "./Components/PlacesContext"
import "./App.css";

function App() {
  return (
    <PlacesProvider>
       <div className="App">
      <Router>
        <Switch>
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <Route path="/login" component={SignIn} />
          <Route path="/register" component={SignUp} />
          <Route path="*" component={()=>"404 NOT FOUND"} />
        </Switch>
      </Router>
    </div>
    </PlacesProvider>
   
  );
}

export default App;
