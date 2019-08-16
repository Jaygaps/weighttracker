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
import { withRouter } from "react-router";

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
    initialiseData: undefined,
    sortedWeeks: {},
  }

  componentDidMount = () => {    
    const user = app.auth().currentUser;
    if (user) {
      axios.get(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/initialise.json`)
        .then(result => {
          this.setState({ initialiseData: result.data[Object.keys(result.data)[0]] }, () => {
            axios.get(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/weights.json`)
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
                let originalStart = parseFloat(this.state.initialiseData && this.state.initialiseData.initialWeight);
                const avg = ((this.state.initialiseData.goalWeight - this.state.initialiseData.initialWeight) / 90);
                for (var index = 0; index < this.state.data.length; ++index) {
                  if (index == 0){
                  this.state.data[index]['DayDiff'] = 0;
                  this.state.data[index]['weight2'] = originalStart;

                  } else {
                    const a = new Date(this.state.data[index-1].date);
                    const b = new Date(this.state.data[index].date);
                      this.state.data[index]['DayDiff'] = parseInt((b - a) / (1000 * 60 * 60 * 24));
                      this.state.data[index]['weight2'] = Number(this.state.data[index-1].weight2) + Number(avg * this.state.data[index].DayDiff);

                    }
                    this.state.data[index]['lineColor'] = "#784BA0";
                  // const start = moment(this.state.data[index].date);
                  // const end = moment(this.state.data[index].date);
                  
                  // const diff = end.diff(start, 'days');
                  // console.log(diff, 'dff')
                  // this.state.data[index]['diffDates'] = diff;
                  // originalStart += Number(avg * this.state.data[index].DayDiff);
                }
      
                this.setState({
                  weight2: this.state.data.slice(-1)[0]
                });

                let sorted = this.state.data;
                sorted = _.sortBy(sorted, [function(o) { return o.date; }]);

      
                chart.data = sorted;
      
               
                var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

                var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis1.title.text = "Weight";

                var series3 = chart.series.push(new am4charts.LineSeries());
                series3.dataFields.valueY = "weight";
                series3.dataFields.dateX = "date";
                series3.name = "Your weight";
                series3.strokeWidth = 2;
                series3.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";
                series3.propertyFields.stroke = "lineColor";


                var bullet3 = series3.bullets.push(new am4charts.CircleBullet());
                bullet3.circle.radius = 3;
                bullet3.circle.strokeWidth = 2;
                bullet3.circle.stroke = "lineColor";
                bullet3.circle.fill = am4core.color("#fff");

                var series4 = chart.series.push(new am4charts.LineSeries());
                series4.dataFields.valueY = "weight2";
                series4.dataFields.dateX = "date";
                series4.name = "Estimated weight";
                series4.strokeWidth = 1;
                series4.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";

                // series4.stroke = chart.colors.getIndex(0).lighten(0.5);
                series4.strokeDasharray = "3,3";

                var bullet4 = series4.bullets.push(new am4charts.CircleBullet());
                bullet4.circle.radius = 3;
                bullet4.circle.strokeWidth = 2;
                bullet4.circle.fill = am4core.color("#fff");

                // Add cursor
                chart.cursor = new am4charts.XYCursor();

                // Add legend
                chart.legend = new am4charts.Legend();
                chart.legend.position = "top";

                this.chart = chart;
              })
            })
          });
        })
     
    }
    
  }

  calculateDate = (goalDate) => {
    const date1 = new Date();
    const date2 = new Date(moment(goalDate).format('MM/DD/YYYY'));
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
      .then(() => window.location.reload())
      .catch(err => {
        console.log(err);
      });
  }

  handleDate = (date) => {
    this.setState({ date: date });
  }

  deleteWeight = (data) => {
    const user = app.auth().currentUser;

    axios.get(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/weights.json`, data)
      .then((res) => { 
        const result = res.data;
        Object.keys(result).map(function (key) {
          if ((result[key].date === data.date) && (result[key].weight === data.weight)) {
            axios.delete(`https://weighttracker-ffaf8.firebaseio.com/${user.displayName}/weights/${key}.json`)
              .then(() => window.location.reload())
          }
        });
      })
      .catch((err) => { console.log(err) })    
  }

  render() {
    let sortedData = this.state.data;
    sortedData = _.sortBy(sortedData, [function(o) { return o.date; }]);
    const abc = sortedData.slice(-1)[0];
    
    let byweek ={};
    function groupweek(value, index, array)
    {
      
      let d = new Date(value['date']);
      d = Math.floor(d.getTime()/(1000*60*60*24*7));
        byweek[d]=byweek[d]||[];
        byweek[d]['d'] = d;
        byweek[d].push(value);
      }
      
    sortedData.map(groupweek)
    let sortedWeeks = Object.keys(byweek).map(function (key) {
      return byweek[key]
    });          
    
    const user = app.auth().currentUser;
    const { initialiseData } = this.state;

    let end = moment(new Date());
    let now = initialiseData && moment(initialiseData.initialDate);
    let duration;
    if (now && end) {
      duration = end.diff(now, 'days');
    }
    return (
      <div className="App">
        <div className="header-section">
          <header>
            Welcome {user && user.displayName}
          </header>
          <div className="side">
            <div className="section first">
              {initialiseData && 'Initial weight: ' + initialiseData.initialWeight + " KGS"}
            </div>
            <div className="section">
              {duration + ' days been'}
            </div>
          </div>
        </div>
          <div className="flex">
            <div className={`inner-flex data-0`}>
              <div className="flexer">
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
                    abc && 'Last updated: ' + moment(abc.date).format('DD/MM/YYYY')
                  }
                </div>
              </div>
              <div className="flexer">
                <div className="title">
                  Goal Weight
                  </div>
                <div className="subtitle">
                  {initialiseData && initialiseData.goalWeight + " KGS"}
                  </div>
                <div className="small">
                  {initialiseData && moment(initialiseData.goalDate).format('DD/MM/YYYY')}
                </div>
              </div>
            </div>
            <div className={`inner-flex data-2`}>
              <div className="flexer">
                <div className="title">
                  Days remaining
                  </div>
                <div className="subtitle">
                  {this.calculateDate(initialiseData && initialiseData.goalDate)}
                </div>
              </div>
              <div className="flexer">
                <div className="title">
                  Weight remaining
                  </div>
                <div className="subtitle">
                  {
                    abc && initialiseData && parseFloat(Number(initialiseData.goalWeight) - Number(abc.weight)).toFixed(2) + " KGS"
                  }
                </div>
                <div className="small">
                  {abc && initialiseData &&
                    parseFloat((parseFloat(initialiseData.goalWeight - abc.weight).toFixed(2)) / (this.calculateDate(initialiseData && initialiseData.goalDate) / 7)).toFixed(2) + " KGS / PW"
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="flex2">
            <div className={`inner-flex data-0`}>
              <div className="title">
                Weight expected to be today
              </div>
              <div className="subtitle">
                {
                  abc && parseFloat(abc.weight2).toFixed(2) + " KGS"
                }
              </div>
            </div>
            <div className={`inner-flex data-1`}>
              <div className="title">
                Overall weight change
                </div>
              <div className="subtitle">
                {parseFloat(Number(abc && abc.weight) - (Number(initialiseData && initialiseData.initialWeight))).toFixed(2) + " KGS"}
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
          </div>
          <div className="graph">
            <div className="title">Graph analysis</div>
            {
              this.state.data && this.state.data.length === 1 &&
              <div>Please enter 1 more weight to see graph details</div>
            }
            <div id="chartdiv" style={{ width: "100%", height: "500px" }}>
            </div>
          </div>
        <div className="wrapped">
          <div className="flexed">
            <p>Enter weight</p>
            <TextField
              label='Enter Weight'
              className="field"
            ><Input
                type="number"
                value={this.state.weight}
                onChange={(e) => this.handleWeight(e)} />
            </TextField>
            <DatePicker
              placeholderText="Select a date"
              minDate={new Date("06/20/2019")}
              selected={this.state.date}
              onChange={this.handleDate}
            />
            <button className="button" onClick={() => this.handleSubmit()}>Enter weight</button>
          </div>
          <div className="flexed">
            <p>History</p>
              {
                sortedData && 
                sortedData.map((data, arr) => (
                  <div className="history">
                    <div className="date">
                      {
                        moment(data.date).format('DD MMMM YYYY')
                      }
                    </div>
                    <div className="weight">
                      {arr !== 0 &&
                        <span onClick={() => this.deleteWeight(data)}>Delete weight</span>
                      }
                      {
                        data.weight + " KGS"
                      }
                    </div>
                  </div>  
                ))
              }
          </div>
          
        </div>
        <div className="wrapped">
          <div className="flexed">
          <p>Weight difference per week</p>
          {
              sortedWeeks && sortedWeeks.map((weeks, i, arr) => (
                <div className={`inner-flex ${arr.length - 1 === i ? 'last' : ''}`}>
                  <div className="title">
                    {
                      `Change in week ${i + 1}`
                    }
                  </div>
                  <div className="arrow">
                    <div>
                    {
                      (weeks.slice(-1)[0].weight - weeks[0].weight < 0) ?
                        <FontAwesomeIcon icon={faAngleDown} size="2x" color="red" /> :
                        (weeks.slice(-1)[0].weight - weeks[0].weight === 0) ?
                          <FontAwesomeIcon icon={faGripLines} size="2x" color="grey" /> :
                          <FontAwesomeIcon icon={faAngleUp} size="2x" color="green" />
                    }
                  </div>
                  <div className="bold">
                      {
                        parseFloat(weeks.slice(-1)[0].weight - weeks[0].weight).toFixed(2) + " KGS"
                      }
                    </div>
                  </div>
                 </div>           
                
              ))
            }
          </div>
          <div className="flexed">
            <p>Coming Soon</p>
          </div>
          
        </div>
      </div>
    )
  }
}

export default withRouter(WeightTracker);
