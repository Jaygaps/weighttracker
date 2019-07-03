import React, { Component } from "react";
import { withRouter } from "react-router";
import app from "../../config";
import firebase from 'firebase'
import '@material/react-text-field/dist/text-field.css';
import TextField, { Input } from '@material/react-text-field';

let emailRegex = /\S+@\S+\.\S+/g;
class Signin extends Component {
    state = {
        email: '',
        emailValidation: null,
        password: '',
        passwordValidation: null,
        formError: '',
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        app.auth().signInWithEmailAndPassword(email, password)
            .then(() => 
                this.props.history.push("/initialise")
            )
            .catch((error) => this.setState({ formError: error.message }));
    }

    handleEmail = (e) => {
        this.setState({
            email: e.target.value,
        }, () => {
            this.setState({ emailValidation: !this.state.email.match(emailRegex) })
        });
    }

    handlePassword = (e) => {
        this.setState({
            password: e.target.value,
        }, () => {
            this.setState({ passwordValidation: this.state.password.length < 6 });
        });
    }

    handleEmailValidation = () => {
        this.setState({ emailValidation: !this.state.email.match(emailRegex) })
    }

    handlePasswordValidation = () => {
        this.setState({ passwordValidation: this.state.password.length < 6 })
    }

    render() {
        // console.log(app.auth().currentUser);
        const { emailValidation, passwordValidation, formError } = this.state;
        // console.log(passwordValidation && emailValidation);
        return (
            <div className="signup">
                {formError &&
                    <div className="form-error">
                        {formError}
                    </div>
                }
                <div className="title">Sign in</div>
                <form onSubmit={this.onSubmit} className="form">
                    <TextField
                        label='Enter Email'
                        className="field"
                    ><Input
                        value={this.state.email}
                        onBlur={() => this.handleEmailValidation()}
                        onChange={(e) => this.handleEmail(e)} />
                    </TextField>
                    { (emailValidation !== null && emailValidation) && 
                        <div className="error">
                            Please enter a valid email address
                        </div>
                    }
                    <TextField
                        label='Enter Password'
                        className="field"
                    ><Input
                        value={this.state.password}
                        type="password"
                        onBlur={() => this.handlePasswordValidation()}
                        onChange={(e) => this.handlePassword(e)} />
                    </TextField>
                    { (passwordValidation !== null && passwordValidation) && 
                        <div className="error">
                            Please enter a password with longer than 6 characters
                        </div>
                    }
                    <button
                        disabled={passwordValidation === null || passwordValidation || emailValidation === null || emailValidation}
                        type="submit"
                        className={`button ${(passwordValidation !== null && emailValidation !==null && !passwordValidation && !emailValidation) ? 'valid': 'notvalid'}`}
                    >
                        Sign In
                    </button>
                </form>
                <div className="login">Sign up</div>
            </div>
        )
    }
};

export default withRouter(Signin);