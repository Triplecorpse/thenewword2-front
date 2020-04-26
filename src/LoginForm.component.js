// @flow

import './LoginForm.component.scss';
import * as React from "react";

type Props = {
    register: () => void;
    apiLink: string;
};
type State = {
    login: string;
    password: string;
}

class LoginFormComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            login: '',
            password: ''
        };

        (this: any).handleChange = this.handleChange.bind(this);
        (this: any).submit = this.submit.bind(this);
    }

    handleChange(e: SyntheticInputEvent<EventTarget>) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return (
            <div className="login-form-component" >
                <form className="form" onSubmit={this.submit}>
                    <label>
                        Ім'я користувача
                        <input type="text" name="login" value={this.state.login} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Гасло
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                    </label>
                    <div className="actions">
                        <button type="button" className="register" onClick={this.props.register}>Зареєструватися</button>
                        <button type="submit">Продовжити</button>
                    </div>
                </form>
            </div>
        );
    }

    submit(e: SyntheticEvent<EventTarget>) {
        const body = {
            login: this.state.login,
            password: this.state.password
        };

        e.preventDefault();
        fetch(this.props.apiLink + 'user/login', {
            method: 'post',
            body: JSON.stringify(body)
        });
    }
}

export default LoginFormComponent
