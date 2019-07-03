import React, { Component } from "react";
import { withRouter } from "react-router";
import app from "../../config";
import firebase from 'firebase'
import '@material/react-text-field/dist/text-field.css';
import TextField, { Input } from '@material/react-text-field';
import { useAuthState } from 'react-firebase-hooks/auth';

const Initialise = () => {
    const [user, initialising, error] = useAuthState(app.auth());
    if (user) {
        console.log('loggedin');
    }
    if (initialising) {
        return (
            <div>
                loading...
            </div>
        )
    }
    return (
        <div className="initialise">
            Initialise
        </div>
    )
};

export default withRouter(Initialise);