import './Login.component.scss';
import * as React from "react";
import LoginFormComponent from "./LoginForm.component";
import WelcomeComponent from "./Welcome.component";

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.register = this.register.bind(this)
        this.state = {
            formWrapperClasses: ['form-wrapper']
        }
    }

    register() {
        this.setState({
            formWrapperClasses: ['form-wrapper', 'hidden']
        });
    }

    render() {
        return (
            <div className="background">
                <div className={this.state.formWrapperClasses.join(' ')}>
                    <LoginFormComponent apiLink="http://localhost:5000/" register={this.register}/>
                </div>
                <div className="welcome-wrapper">
                    <WelcomeComponent />
                </div>
            </div>
        )
    }
}

export default LoginComponent;
