// @flow

import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import LoginComponent from "./Login/Login.component";
import DashboardComponent from "./Dashboard/dashboard.component";

class App extends React.Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route path="/login">
                        <LoginComponent />
                    </Route>
                    <Route path="/dashboard">
                        <DashboardComponent />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
