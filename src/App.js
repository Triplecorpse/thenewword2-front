// @flow

import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LoginComponent from "./Login/Login.component";
import HeaderComponent from "./Header/header.component";
import AccountComponent from "./Account/account.component";
import HomeComponent from "./Home/home.component";
import {runtimeConfig} from "./services/authentication";
import {get} from "./services/request";

class App extends React.Component {
    constructor() {
        super();

        this.setAuthenticationState();
    }

    async setAuthenticationState() {
        if (localStorage.getItem('authToken')) {
            const req = await get('/user/validate')

            if (req.status === 200) {
                runtimeConfig.isAuthenticated = true;
            }
        }
    }

    render() {
        return (
            <Router>
                <HeaderComponent isAuthenticated={this.isAuthenticated}/>
                <Switch>
                    <Route exact path="/">
                        <HomeComponent/>
                    </Route>
                    <Route path="/account">
                        <AccountComponent/>
                    </Route>
                    <Route path="/login">
                        <LoginComponent/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
