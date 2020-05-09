// @flow

import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import LoginComponent from "./Login/Login.component";
import DashboardComponent from "./Dashboard/dashboard.component";
import WordsetsComponent from "./Wordsets/wordsets.component";
import WordsComponent from "./Words/words.component";
import HeaderComponent from "./Header/header.component";

class App extends React.Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route exact path="/account">
                        <HeaderComponent/>
                        <Route path="/dashboard">
                            <DashboardComponent/>
                        </Route>
                        <Route path="/wordsets">
                            <WordsetsComponent />
                        </Route>
                        <Route path="/words">
                            <WordsComponent />
                        </Route>
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
