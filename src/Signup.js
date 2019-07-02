import React, { Component } from "react";
import { withRouter } from "react-router";
import app from "./config";
import firebase from 'firebase'
import './App.scss';

class Signup extends Component {
    async onSubmit(e) {
        e.preventDefault();
        const { email, password } = e.target.elements;
        app.auth().createUserWithEmailAndPassword(email.value, password.value);

        // try {
            
        // const user = await app
        //     .auth()
        //     .createUserWithEmailAndPassword(email.value, password.value);
        // this.props.history.push("/");
        // } catch (error) {
    }

    render() {
        console.log(app.auth().currentUser);
        
        return (
            <div className="signup">
                <div className="title">Sign up</div>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Email
                         <input
                            name="email"
                            type="email"
                            placeholder="Email"
                        />
                    </label>
                    <label>
                        Password
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                    </label>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        )
    }
};

export default withRouter(Signup);