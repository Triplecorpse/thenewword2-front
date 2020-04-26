// @flow

import './LoginForm.component.scss';
import * as React from "react";

type Props = {
    login: () => void;
    apiLink: string;
};
type State = {
    login: string;
    password: string;
    confirm: string;
    email: string;
};

class RegisterFormComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            confirm: '',
            email: ''
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
                        Email
                        <input type="email" name="email" value={this.state.password} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Гасло
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Підтвердження гасла
                        <input type="password" name="confirm" value={this.state.password} onChange={this.handleChange}/>
                    </label>
                    <div className="actions">
                        <button type="button" className="register" onClick={this.props.login}>Повернутися до логіна</button>
                        <button type="submit">Зареєструватися</button>
                    </div>
                </form>
            </div>
        );
    }

    submit(e: SyntheticEvent<EventTarget>) {
        const body = {
            login: this.state.login,
            password: this.state.password,
            confirm: this.state.confirm,
            email: this.state.email
        };

        e.preventDefault();
        fetch(this.props.apiLink + 'user/register', {
            method: 'post',
            body: JSON.stringify(body)
        });
    }
}

export default RegisterFormComponent
