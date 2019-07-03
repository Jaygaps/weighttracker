import React, { Component } from 'react';
import '../../App.scss';
import app, { database } from '../../config';

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
    data: [],
    weight: '',
    date: '',
    weight2: '',
  }

  componentDidMount = () => {    
    axios.get('https://weighttracker-ffaf8.firebaseio.com/weights.json')
      .then(result => {
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
          let originalStart = parseFloat(53.35);
          const avg = parseFloat((parseFloat(60 - abc.weight).toFixed(2)) / (this.calculateDate() / 7)).toFixed(2) / 7;

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
  }

  calculateDate = () => {
    const date1 = new Date();
    const date2 = new Date('10/01/2019');
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  handleWeight = (e) => {
    this.setState({ weight: e.target.value });
  }
  handleDate = (e) => {
    this.setState({ date: e.target.value });
  }

  handleSubmit = () => {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    axios.post('https://weighttracker-ffaf8.firebaseio.com/weights.json',
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

  render() {
    const abc = this.state.data.slice(-1)[0];
    console.log(this.state.data.length);
    let slice = this.state.data;
    slice = _.chunk(slice, 7);
    const user = app.auth().currentUser;
    console.log(user);
    if (user) {
      user.updateProfile({ displayName: 'Jayraj'});
    } else {
      console.log('ssss')
    }
    // console.log(user.displayName);
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
                  abc && abc.date
                }
              </div>
            </div>
            <div className={`inner-flex data-1`}>
              <div className="title">
                Goal Weight
                </div>
              <div className="subtitle">
                60 KGS
                </div>
              <div className="small">
                01/10/2019
                </div>
            </div>
            <div className={`inner-flex data-2`}>
              <div className="title">
                Days remaining
                </div>
              <div className="subtitle">
                {this.calculateDate()}
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
                  parseFloat((parseFloat(60 - abc.weight).toFixed(2)) / (this.calculateDate() / 7)).toFixed(2) + " KGS / PW"
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
                {parseInt(this.calculateDate() / 7)}
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
          <TextField
            label='Enter Date'
            className="field"
          ><Input
              value={this.state.date}
              onChange={(e) => this.handleDate(e)} />
          </TextField>
        </div>
        <button onClick={() => this.handleSubmit()}>CLICK HERE</button>
      </div>
    )
  }
}

export default WeightTracker;
