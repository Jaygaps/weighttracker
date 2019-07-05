import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import './Initialise.scss';
import app from "../../config";
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase'
import '@material/react-text-field/dist/text-field.css';
import TextField, { Input } from '@material/react-text-field';
import axios from 'axios';
import * as moment from 'moment';
import DatePicker from "react-datepicker";

var today = new Date();
var dd = today.getDate();

var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;

const Initialise = (props) => {
    const [user, initialising, error] = useAuthState(app.auth());
    const [input, setInput] = useState({});
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        axios.get('https://weighttracker-ffaf8.firebaseio.com/weighttracker-ffaf8.json')
            .then(result => {console.log(result)})
        if (user) {
            if (user.displayName) {
                axios.get(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/initialise.json`)
                .then(result => 
                    {
                        setUserData(result.data[Object.keys(result.data)[0]]);
                    }
                )
            }
        }
    }, []);

    const handleInputChange = (event) => {
        event.persist();
        setInput(input => ({...input, [event.target.name]: event.target.value}));
    }

    const handleCalendar = (event) => {
        setInput(input => ({...input, 'goalDate': event, 'initialDate': new Date()}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        user.updateProfile({ displayName: input.displayName}).then(() => {
            axios.post(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/initialise.json`, input)
                .then(res => { console.log(res)})
                .catch(err => { console.log(err)});
            axios.post(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/weights.json`,
            {
                weight: parseFloat(input.initialWeight).toFixed(2),
                date: today
            })
            .then(() => {
                props.history.push("/app");
            })
        });
    }

    return (
        <div className="initialise">
            <div className="heading">Get started</div>
            <form>
                <div className="wrapper">
                    <TextField
                        label='Enter Display Name'
                        className="field"
                        floatingLabelClassName="sad"
                    ><Input

                        name="displayName"
                        value={input.displayName}
                        onChange={handleInputChange} />
                    </TextField>
                </div>
                <div className="wrapper">
                    <TextField
                        label='Enter Initial Weight in KGS'
                        className="field"
                    ><Input
                        type="number"
                        name="initialWeight"
                        value={input.initialWeight}
                        onChange={handleInputChange} />
                    </TextField>
                </div>
                <div className="wrapper">
                    <TextField
                        label='Enter goal Weight in KGS'
                        className="field"
                    ><Input
                        type="number"
                        name="goalWeight"
                        value={input.goalWeight}
                        onChange={handleInputChange} />
                    </TextField>
                </div>
                <div className="wrapper">
                    <DatePicker
                        placeholderText="Select a goal date"
                        minDate={new Date()}
                        selected={input.goalDate}
                        onChange={handleCalendar}
                    />
                </div>
                <div className="wrapper">
                    <button className="button" onClick={handleSubmit}>Submit</button>
                </div>
            </form>
        </div>
    )
};

export default withRouter(Initialise);