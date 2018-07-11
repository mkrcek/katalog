import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStone, fetchStones, deletePost, putStone, changeSetting } from '../actions';

// import ImageGallery from 'react-image-gallery';
// https://www.npmjs.com/package/react-image-gallery

import DolniMenu from './dolni_menu';


import { ROOT_URL } from '../tools/dm_tools'; //globální konstanta
import { API_KEY } from '../tools/dm_tools'; //globální konstanta

const MDserver = "-1";
const DMteplota = "1";
const DMkamera = "2";
const DMalarm = "3";
const DMCameraAlarm = "4";
const DMvoda = "5";
const DMsvetlo = "6";
const DMbrana = "7";
const DMpocasi = "8";
const DMgarage = "9";

const DMbranaT1 = "1";
const DMbranaT2 = "2";
const DMbranaT3 = "3";

const DMgarageT1 = "0";   //otevřít
const DMgarageT2 = "";
const DMgarageT3 = "1";   //zavřít




const GRID_SM = "col-3 col-sm-3 col-md-3 col.xl-3"; //teplota
const GRID_MD = "col-8 col-sm-6"; //např.počasí - nepoužito
const GRID_FUL = "col-12 col-sm-12"; //kamera - napoužito

const GRID_CAM = "col-12 col-sm-12 col-lg-12"; //kamera
const GRID_CAMAL = "col-12 col-sm-12 col-md-12"; //kamera alarm
const GRID_WEAD = "col-12 col-sm-6 col-md-4"; //weather
const GRID_GATE = "col-3 col-sm-3 col-md-3 col.xl-3"; //brána


const REFRESHTIME = 1000;

// let serverTimeRefresh; // pomocna promena na nastaveni "setInterval" pre download dat ze serveru

class StoneDetail extends Component {

  constructor() {
    super();
    this.state = {
      serverTimeRefresh: undefined
    };
  }


  componentWillUnmount() {
    // clearInterval(serverTimeRefresh);
    clearInterval(this.state.serverTimeRefresh);
    //když odcházím z hlavní obrazovky, vypínám "setInterval" pro download dat ze serveru
    //pokud by to zde nebylo, při vrácení z detailu se opět spustí další - paralelní "refresh" dat ze serveru....
    // console.log("on-montovna Detailu");
  }



  componentDidMount() {
    const { unid } = this.props.match.params; //bere věci z URL ...třeba :/comments
    // console.log("unid: " + unid);
    // this.props.fetchStone(unid);
    // console.log("montovna detailu1", this.props);

    // serverTimeRefresh = setInterval(function() {
    //   this.props.fetchStone(unid);
    //   console.log("fetching " + unid)
    // }.bind(this), REFRESHTIME);

    this.setState({serverTimeRefresh: setInterval(function() {
      this.props.fetchStone(unid);
      console.log("fetching " + unid)
    }.bind(this), REFRESHTIME)});


    //když přicházím NA hlavní obrazovku, zapínám "setInterval" pro download dat ze serveru
    //v Detailu stone je také potřeba udělat "refresh" je

    //normálněji bych měl spustit jen Stone - ale nějade to nejede
    //hlaska:
    //  Uncaught SyntaxError: Unexpected identifier
    //  setInterval (async)
    // serverTimeRefresh = setInterval(this.props.fetchStone(unid), 1000);
    // console.log("montovna detailu", this.props);

    //posune kurzor nazačátek stránky
    window.scrollTo(0, 0);
  }



  //odešle PUT s values
  onPutClick(values) {
    const { unid } = this.props.match.params;
    this.props.putStone(unid, values, () => {
      this.props.history.push('/');
    });
  }

  //zobrazi tlačítko ktere nasledne odesle PUT
  odeslatTlacitko(values, nameTlacitko) {
    return (
      <button
        className = "btn btn-lg btn-dark pull-xs-left"
        onClick={this.onPutClick.bind(this, values)}
        >
        {nameTlacitko}
      </button>
    );
  }
  // uzití v renderu: {this.odeslatTlacitko({"value": "3"}, "olga")}

  //hlavička detailu
  renderStoneHead() {

    let buttonText = "";
    let buttonColor = "btn-success";
    let buttonValue = "0";

    // console.log("OKO", this.props);

    switch (this.props.stone.webtype) {
      case DMkamera :
          return (
            <div className="row col-12 justify-content-between align-items-end" >
              <div className="col-12 text-center">
                <img style={{width: "100%"}} src = {`${ROOT_URL}/${this.props.stone.subtype}`} alt="haha" className="img-fluid" />
              </div>
              <div className="col-12 text-center">
                <h2>{this.props.stone.webname}</h2>
              </div>
              <div className="col-12 text-center">
                <button
                  className = "btn btn-lg btn-success pull-xs-left"
                  onClick={this.onPutClick.bind(this, {"value":"1"})}
                  >odeslání PUT s hodnotou 1
                </button>
              </div>
            </div>
          );
        break;
        case DMCameraAlarm:
            return (
              <div className="row col-12 justify-content-between align-items-end" >
                <div className="col-12 text-center">
                  <img style={{width: "100%"}} src = {`${ROOT_URL}/${this.props.stone.subtype}`} alt="haha" className="img-fluid" />
                </div>
                <div className="col-12 text-center">
                  <h2>{this.props.stone.webname}</h2>
                </div>
                <div className="col-12 text-center">
                  <button
                    className = "btn btn-lg btn-success pull-xs-left"
                    onClick={this.onPutClick.bind(this, {"value":"1"})}
                    >odeslání PUT s hodnotou 1
                  </button>
                </div>
              </div>
            );
          break;
      case DMsvetlo:
          buttonText = "";
          buttonColor = "btn-success";

          if (this.props.stone.value == 1) {
            buttonText = "vypni";
            buttonColor = "btn-danger";
          } else {
            buttonText = "zapni";
            buttonColor = "btn-success";
          }
          return (
            <div className="row col-12 justify-content-between align-items-end" >
              <div className="col-12 text-center">
                <h2>{this.props.stone.webname}</h2>
              </div>
              <div className="col-12 text-center">
                <button
                  className = {`btn btn-lg ${buttonColor} btn-block`}
                  onClick={this.onPutClick.bind(this, {"value":"1"})}
                  >
                  {buttonText}
                </button>
              </div>
            </div>
          );

        break;
      case DMbrana:
          return (
            <div className="row col-12 justify-content-between align-items-end">
              <div className="col-12 text-center">
                  <img style={{width: "100%"}} src = {`${ROOT_URL}/${this.props.stone.subtype}`} alt="haha" className="img-fluid" />
              </div>

              <div className="col-12 text-center">
                <h2>{this.props.stone.webname}</h2>
              </div>

              <div className="col-12 text-center">
                <button
                  className = "btn btn-lg btn-danger pull-xs-left"
                  onClick={this.onPutClick.bind(this, {"value":"1"})}
                  >odeslání 1
                </button>
                <button
                  className = "btn btn-lg btn-success pull-xs-left"
                  onClick={this.onPutClick.bind(this, {"value":"2"})}
                  >odeslání 2
                </button>
                <button
                  className = "btn btn-lg btn-dark pull-xs-left"
                  onClick={this.onPutClick.bind(this, {"value":"3"})}
                  >odeslání 3
                </button>
              </div>
            </div>
          );
        break;
      case DMgarage:
          buttonText = "";
          buttonColor = "btn-success";
          buttonValue = "0";

          if (this.props.stone.door == "0") {
            buttonText = "otevřít";
            buttonColor = "btn-danger";
            buttonValue = DMgarageT1;
          } else {
            buttonText = "zavřít";
            buttonColor = "btn-success";
            buttonValue = DMgarageT3;
          }




          return (
            <div className="row col-12 justify-content-between align-items-end">
              <div className="col-12 text-center">
                  <img style={{width: "100%"}} src = {`${ROOT_URL}/${this.props.stone.subtype}`} alt="haha" className="img-fluid" />
              </div>
              <div className="col-12 text-center">
                <h2>{this.props.stone.webname}</h2>
              </div>
              <div className="col-12 text-center">
                <button
                  className = {`btn btn-lg ${buttonColor} btn-block`}
                  onClick={this.onPutClick.bind(this, {"value":buttonValue})}
                  >
                  {buttonText}
                </button>
              </div>
            </div>
          );
        break;
      default:  //teplota a vse ostatni
      return (
        <div className="row col-12 justify-content-between align-items-end">
          <div className="col-12 text-center" >
            <h2>{this.props.stone.webname}</h2>
          </div>
          <div className="col-12 text-center">
            <h2 >{this.props.stone.value}</h2>
          </div>
        </div>
      );

    }
  } //konec renderStoneHead

  renderStoneDetails() {
    //tabulka se všemi údaji, které mám k dispozici:
    // return _.map(this.props.stone, stoneItem, stoneKey => {
    return _.map(this.props.stone, function(stoneItem, stoneKey)  {
      return (
        <tr key={stoneKey}>
           <td>{stoneKey}</td>
           <td>{stoneItem}</td>
         </tr>
      );
    });
  }


  render() {
    const { stone } = this.props;
    if (!stone) {
      return (
        <div>
          <div>Loading data, wait please, my friend. It will be in a second ..</div>
          <Link to="/"> <h1>...zpět</h1> </Link>
        </div>
      );
    }

    let putMessage = {"value": "1","value2": "2" };



    return (
      <div>
        <div className="row col-12 fixed-top" style={{backgroundColor:"LightGoldenRodYellow"}} >
          <Link to="/"> <h1>&larr; zpět</h1> </Link>
        </div>

        <div className = "row body-detail" style={{paddingTop:"6vw"}}>
          {this.renderStoneHead()}
        </div>

        <div className = "row" style={{paddingTop:"20"}}>
          <h2>Detaily:</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Položka</th>
                  <th>Hodnota</th>
                </tr>
              </thead>
              <tbody>
                  {this.renderStoneDetails()}
              </tbody>
            </table>
        </div>

        <div className = "row">
            <DolniMenu
              errorMsg={ this.props.server && this.props.server.error || !this.props.server && ""}
              cas={this.props.server && this.props.server.value || !this.props.server && "NENI SERVER TIME"}
            />
        </div>
      </div>
    );
  }


}

function mapStateToProps({ stones }, ownProps) {
  return {
    stone: stones[ownProps.match.params.unid],
    server: stones["0"]
  };
}

export default connect(mapStateToProps, { fetchStone, fetchStones, putStone })(StoneDetail);



//?? otazky *****
// - jak zjistit index v detailu
//je to takto správně: return _.map(this.props.stone, function(stoneItem, stoneKey)  {
