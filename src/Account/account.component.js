import * as React from "react";
import {Route, Switch} from "react-router-dom";
import DashboardComponent from "../Dashboard/dashboard.component";
import WordsetsComponent from "../Wordsets/wordsets.component";
import WordsComponent from "../Words/words.component";
import HeaderComponent from "../Header/header.component";

class AccountComponent extends React.Component {
    constructor(props) {
        super(props);

        fetch('http://localhost:5000/data/languages?payload=' + localStorage.getItem('authToken'));
    }

    render() {
        return (
            <Switch>
                <HeaderComponent/>
                <Route exact path={`account/dashboard`}>
                    <DashboardComponent/>
                </Route>
                <Route path={`account/wordsets`}>
                    <WordsetsComponent />
                </Route>
                <Route path={`account/words`}>
                    <WordsComponent />
                </Route>
            </Switch>
                )
    }
}

export default AccountComponent;
