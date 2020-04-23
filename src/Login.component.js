import './Login.component.scss';
import * as React from "react";
import LoginFormComponent from "./LoginForm.component";
import WelcomeComponent from "./Welcome.component";
import RegisterFormComponent from "./RegisterForm.component";

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.register = this.register.bind(this)
        this.login = this.login.bind(this)
        this.state = {
            loginFormWrapperClasses: ['form-wrapper'],
            registerFormWrapperClasses: ['form-wrapper', 'hidden', 'register']
        }
    }

    register() {
        this.setState({
            loginFormWrapperClasses: ['form-wrapper', 'hidden'],
            registerFormWrapperClasses: ['form-wrapper']
        });
    }

    login() {
        this.setState({
            loginFormWrapperClasses: ['form-wrapper'],
            registerFormWrapperClasses: ['form-wrapper', 'hidden', 'register']
        });
    }

    render() {
        return (
            <div className="background">
                <div className={this.state.loginFormWrapperClasses.join(' ')}>
                    <LoginFormComponent apiLink="http://localhost:5000/" register={this.register}/>
                </div>
                <div className={this.state.registerFormWrapperClasses.join(' ')}>
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
