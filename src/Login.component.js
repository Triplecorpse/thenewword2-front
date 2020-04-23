import './Login.component.scss';
import * as React from "react";
import LoginFormComponent from "./LoginForm.component";
import WelcomeComponent from "./Welcome.component";

class LoginComponent extends React.Component {
    render() {
        return (
            <div className="background">
                <div className="form-wrapper">
                    <LoginFormComponent apiLink="http://localhost:5000/" />
                </div>
                <div className="welcome-wrapper">
                    <WelcomeComponent />
                </div>
            </div>
        )
    }
}

export default LoginComponent;
