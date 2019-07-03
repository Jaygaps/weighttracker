import React, { Component } from "react";
import { withRouter } from "react-router";
import app from "../../config";
import firebase from 'firebase'
import '@material/react-text-field/dist/text-field.css';
import TextField, { Input } from '@material/react-text-field';

let emailRegex = /\S+@\S+\.\S+/g;
class Initialise extends Component {
    state = {
        email: '',
        emailValidation: null,
        password: '',
        passwordValidation: null,
        formError: '',
    }

    render() {
        return (
            <div className="initialise">
                Initialise
            </div>
        )
    }
};

export default withRouter(Initialise);