// @flow

import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import LoginComponent from "./Login/Login.component";

class App extends React.Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route path="/login">
                        <LoginComponent />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
