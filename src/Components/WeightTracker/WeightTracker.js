import React, { Component } from 'react';
import '../../App.scss';
import app, { database } from '../../config';
import DatePicker from "react-datepicker";
import * as moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import _ from 'lodash';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown, faGripLines } from "@fortawesome/free-solid-svg-icons";

import '@material/react-text-field/dist/text-field.css';
import TextField, { Input } from '@material/react-text-field';
import '../../../node_modules/react-linechart/dist/styles.css';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
let gsmData;
class WeightTracker extends Component {
  state = {
    date: new Date(),
    data: [],
    weight: '',
    weight2: '',
    initialiseData: undefined
  }

  componentDidMount = () => {    
    const user = app.auth().currentUser;
    if (user) {
      axios.get(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/initialise.json`)
        .then(result => {
          this.setState({ initialiseData: result.data[Object.keys(result.data)[0]] }, () => {
            axios.get(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/weights.json`)
            .then(result => {
              console.log(result);
              let array = Object.keys(result.data).map(function (key) {
                return result.data[key]
              });
              this.setState({
                data: array
              }, () => {
                am4core.useTheme(am4themes_animated);
                // Themes end
      
                var chart = am4core.create("chartdiv", am4charts.XYChart);
                chart.paddingRight = 20;
      
                var data = [];
                var visits = 10;
                var previousValue;
      
                for (var i = 0; i < 100; i++) {
                  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      
                  if (i > 0) {
                    // add color to previous data item depending on whether current value is less or more than previous value
                    if (previousValue <= visits) {
                      data[i - 1].color = chart.colors.getIndex(0);
                    }
                    else {
                      data[i - 1].color = chart.colors.getIndex(5);
                    }
                  }
      
                  data.push({ date: new Date(2018, 0, i + 1), value: visits });
                  previousValue = visits;
                }
                const abc = this.state.data.slice(-1)[0];
                let originalStart = parseFloat(this.state.initialiseData && this.state.initialiseData.initialWeight);
                const avg = parseFloat((parseFloat(this.state.initialiseData.goalWeight - abc.weight).toFixed(2)) / (this.calculateDate(this.state.initialiseData && this.state.initialiseData.goalDate) / 7)).toFixed(2) / 7;
                console.log(avg, 'avg');
                for (var index = 0; index < this.state.data.length; ++index) {
                  this.state.data[index]['weight2'] = originalStart;
                  originalStart += Number(avg);
                }
      
                chart.data = this.state.data
                console.log(this.state.data);
                this.setState({
                  weight2: this.state.data.slice(-1)[0]
                })
      
                chart.data = this.state.data;
      
                var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.grid.template.location = 0;
                dateAxis.renderer.axisFills.template.disabled = true;
                dateAxis.renderer.ticks.template.disabled = true;
                dateAxis.renderer.grid.template.disabled = true;
      
      
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.tooltip.disabled = true;
                valueAxis.renderer.minWidth = 35;
                valueAxis.renderer.axisFills.template.disabled = true;
                valueAxis.renderer.ticks.template.disabled = true;
                valueAxis.renderer.grid.template.disabled = true;
      
      
                let series2 = chart.series.push(new am4charts.LineSeries());
                series2.dataFields.dateX = "date";
                series2.dataFields.valueY = "weight2";
                chart.cursor = new am4charts.XYCursor();
      
                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.dateX = "date";
                series.dataFields.valueY = "weight";
                series.strokeWidth = 2;
                series.tooltipText = "value: {valueY}, day change: {valueY.previousChange}";
      
                // set stroke property field
                series.propertyFields.stroke = "color";
      
                this.chart = chart;
              })
            })
          });
        })
     
    }
    
  }

  calculateDate = (goalDate) => {
    console.log(goalDate)
    const date1 = new Date();
    const date2 = new Date(moment(goalDate, 'DD/MM/YYYY').format('MM/DD/YYYY'));
    console.log(date1, date2)
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays)
    return diffDays;
  }

  handleWeight = (e) => {
    this.setState({ weight: e.target.value });
  }
  handleDate = (e) => {
    this.setState({ date: e.target.value });
  }

  handleSubmit = () => {
    const user = app.auth().currentUser;

    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    axios.post(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/weights.json`,
      {
        weight: parseFloat(this.state.weight).toFixed(2),
        date: !this.state.date ? today : this.state.date
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleDate = (date) => {
    this.setState({ date: date });
  }

  render() {
    const abc = this.state.data.slice(-1)[0];
    console.log(abc);
    let slice = this.state.data;
    slice = _.chunk(slice, 7);
    const user = app.auth().currentUser;

    const { initialiseData } = this.state;
    console.log(this.state.weight2);
    return (
      <div className="App">
        <header>
          Welcome {user && user.displayName}
          <div className="flex">
            <div className={`inner-flex data-0`}>
              <div className="title">
                Current Weight
                </div>
              <div className="subtitle">
                {
                  abc && abc.weight + " KGS"
                }
              </div>
              <div className="small">
                {
                  abc && moment(abc.date).format('DD/MM/YYYY')
                }
              </div>
            </div>
            <div className={`inner-flex data-1`}>
              <div className="title">
                Goal Weight
                </div>
              <div className="subtitle">
                {initialiseData && initialiseData.goalWeight + " KGS"}
                </div>
              <div className="small">
                {initialiseData && initialiseData.goalDate}
                </div>
            </div>
            <div className={`inner-flex data-2`}>
              <div className="title">
                Days remaining
                </div>
              <div className="subtitle">
                {this.calculateDate(initialiseData && initialiseData.goalDate)}
              </div>
            </div>
            <div className={`inner-flex`}>
              <div className="title">
                Weight remaining
                </div>
              <div className="subtitle">
                {abc &&
                  parseFloat(60 - abc.weight).toFixed(2) + " KGS"
                }
              </div>
              <div className="small">
                {abc &&
                  parseFloat((parseFloat(60 - abc.weight).toFixed(2)) / (this.calculateDate(initialiseData && initialiseData.goalDate) / 7)).toFixed(2) + " KGS / PW"
                }
              </div>
            </div>
          </div>
          <div className="flex2">
            <div className={`inner-flex data-0`}>
              <div className="title">
                Forecast weight
                </div>
              <div className="subtitle">
                {
                  this.state.weight2 && parseFloat(this.state.weight2.weight2).toFixed(2) + " KGS"
                }
              </div>
            </div>
            <div className={`inner-flex data-1`}>
              <div className="title">
                Weight difference
                </div>
              <div className="subtitle">
                {this.state.weight2 && parseFloat(Number(abc && abc.weight) - (Number(this.state.weight2.weight2))).toFixed(2) + " KGS"}
              </div>
            </div>
            <div className={`inner-flex data-2`}>
              <div className="title">
                Weeks remaining
                </div>
              <div className="subtitle">
                {parseInt(this.calculateDate(initialiseData && initialiseData.goalDate) / 7)}
              </div>
            </div>
            <div className={`inner-flex`}>
              <div className="title">
                Days been
                </div>
              <div className="subtitle">
                {this.state.data &&
                  this.state.data.length + " days"
                }
              </div>
            </div>
          </div>
          <div className="flex2">
            {
              slice && slice.map((i, index, arr) => (
                <div className={`inner-flex ${arr.length - 1 === index ? 'last' : ''}`}>
                  <div className="title">
                    Weight change week {index + 1}
                  </div>
                  <div className="arrow">
                    <div>
                      {
                        parseFloat(i.slice(-1)[0].weight - i[0].weight).toFixed(2) + " KGS"
                      }
                    </div>
                    {
                      (i.slice(-1)[0].weight - i[0].weight < 0) ?
                        <FontAwesomeIcon icon={faAngleDown} size="2x" color="red" /> :
                        (i.slice(-1)[0].weight - i[0].weight === 0) ?
                          <FontAwesomeIcon icon={faGripLines} size="2x" color="grey" /> :
                          <FontAwesomeIcon icon={faAngleUp} size="2x" color="green" />
                    }
                  </div>
                  {
                    arr.length - 1 === index &&
                    <div className="active">Active week</div>
                  }
                </div>
              ))
            }
          </div>
          <div>
          </div>
          <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
        </header>
        <div>
          <TextField
            label='Enter Weight'
            className="field"
          ><Input
              value={this.state.weight}
              onChange={(e) => this.handleWeight(e)} />
          </TextField>
          <DatePicker
            placeholderText="Select a date"
            minDate={new Date("06/20/2019")}
            selected={this.state.date}
            onChange={this.handleDate}
          />
        </div>
        <button onClick={() => this.handleSubmit()}>CLICK HERE</button>
      </div>
    )
  }
}

export default WeightTracker;
