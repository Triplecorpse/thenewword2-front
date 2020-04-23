import './LoginForm.component.scss';
import * as React from "react";

class LoginFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return (
            <div className="login-form-component" >
                <form className="form" onSubmit={this.submit}>
                    <label>
                        Login
                        <input type="text" name="login" value={this.state.login} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Password
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                    </label>
                    <button type="submit">OK</button>
                </form>
            </div>
        );
    }

    submit(e) {
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
