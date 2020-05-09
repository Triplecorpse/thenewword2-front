// @flow

import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import LoginComponent from "./Login/Login.component";
import HeaderComponent from "./Header/header.component";
import AccountComponent from "./Account/account.component";

class App extends React.Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route path="/account">
                        <HeaderComponent/>
                        <AccountComponent/>
                    </Route>
                    <Route path="/login">
                        <LoginComponent />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
