// @flow

import './Login.component.scss';
import * as React from "react";
import LoginFormComponent from "./LoginForm.component";
import WelcomeComponent from "./Welcome.component";
import RegisterFormComponent from "./RegisterForm.component";

type Props = {};
type State = {
    loginFormWrapperClasses: string;
    registerFormWrapperClasses: string;
};

class LoginComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        (this: any).register = this.register.bind(this);
        (this: any).login = this.login.bind(this);
        this.state = {
            loginFormWrapperClasses: 'form-wrapper',
            registerFormWrapperClasses: 'form-wrapper hidden register'
        };

        if (localStorage.getItem('authToken')) {

        }
    }

    register() {
        this.setState({
            loginFormWrapperClasses: 'form-wrapper hidden',
            registerFormWrapperClasses: 'form-wrapper'
        });
    }

    login() {
        this.setState({
            loginFormWrapperClasses: 'form-wrapper',
            registerFormWrapperClasses: 'form-wrapper hidden register'
        });
    }

    render() {
        return (
            <div className="background">
                <div className={this.state.loginFormWrapperClasses}>
                    <LoginFormComponent apiLink="http://localhost:5000/" register={this.register}/>
                </div>
                <div className={this.state.registerFormWrapperClasses}>
                    <RegisterFormComponent apiLink="http://localhost:5000/" login={this.login}/>
                </div>
                <div className="welcome-wrapper">
                    <WelcomeComponent />
                </div>
            </div>
        )
    }
}

export default LoginComponent;
