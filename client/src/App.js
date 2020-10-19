import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute"
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <ProtectedRoute exact path="/" component={Home} />
          <Route path="/login">
            <SignIn />
          </Route>
          <Route path="/register">
            <SignUp />
          </Route>
          <Route path="*" component={()=>"404 NOT FOUND"} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
