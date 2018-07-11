import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStones, putStone, changeSetting } from '../actions';




function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      <div>M-E-N-U</div>
      {props.children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}


class DolniMenu extends Component {

  componentDidMount() {
    // this.props.fetchStone("0");
    // // this.props.fet
    // console.log("Dolni menu sestaveno", this.props);
  }



  //odešle PUT s values
  onPutClick(values) {
    this.props.putStone("MENU", values, () => {
      this.props.history.push('/');
      // pokliku se odešle MENU s hodnout 1
      // zatím se nepřesměrovává nikam , protože neexistuje O: this.props.history.push
    });
  }

  formatTime (datumCas) {
    let t = datumCas.split(/[- :]/);
    // Apply each element to the Date function
    let d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    let actiondate = new Date(d);

    if (d != "Invalid Date") {
      let minuta = actiondate.getMinutes();
      if (minuta < 10) {
        minuta = "0" + minuta.toString();
      }
      let sekunda = actiondate.getSeconds();
      if (sekunda < 10) {
        sekunda = "0" + sekunda.toString();
      }
      var cas = actiondate.getHours() + ":" + minuta + ":" + sekunda;

      let denVTydnu = "";
      switch (actiondate.getDay()) {
        case 1:
          denVTydnu = "Pondělí"
          break;
        case 2:
          denVTydnu = "Úterý"
          break;
        case 3:
          denVTydnu = "Středa"
          break;
        case 4:
          denVTydnu = "Čtvrtek"
          break;
        case 5:
          denVTydnu = "Pátek"
          break;
        case 6:
          denVTydnu = "Sobota"
          break;
        case 0:
          denVTydnu = "Neděle"
          break;
        default:
        denVTydnu = "Fakt netuším"
      }
      let datum = denVTydnu + " " + actiondate.getDate() + "." + actiondate.getMonth() + ".";

      return (
        <div>
          <span style={{fontSize: "0.7rem" }} >{datum}</span>
          <span style={{fontSize: "1.5rem" }} >{cas}</span>
        </div>
      );
    }

    return (
      <div>
        <span style={{fontSize: "1.5rem" }} >"SERVER je nedostupný ..."</span>
      </div>
    );

  }

  render() {
    // let ooo = this.props.settings.serverDate;
    // console.log(ooo);
    // console.log(this.props);




    let barva = "inherit";
    if (this.props.errorMsg) {
      barva = "red";
    } else {
      barva = "inherit";
    }

    let barva2 = "inherit";
    if (this.props.cas == "NENI SERVER TIME") {
      barva2 = "red";
    } else {
      barva2 = "inherit";
    }

    return (
      <div className="row col-12 justify-content-between align-items-end fixed-bottom" style={{backgroundColor:"LightGoldenRodYellow"}} >
        <div  className="col-1">
          <Link to="/">
              <i style={{fontSize:"1.5rem", color:"RED"}} className="pekneIkony">&#xf015;</i>
          </Link>
        </div>
        <div  className="col-1">
          <Link to="/katalog">
              katalog
          </Link>
        </div>
        <div
          className="col-2 text-left"
          style={{color:barva}}
          >
          <h5 onClick={this.onPutClick.bind(this, {"value":"1"})}>{this.props.errorMsg}</h5>
        </div>

        <div className="col text-right" style={{backgroundColor:barva2}}>
          {this.formatTime(this.props.cas)}
        </div>
      </div>
    );
  }
}

DolniMenu.defaultProps = {
  errorMsg: "nejak text",
  cas: "2020-04-04 22:22:00"
}

//test práce s globální promenou settings
function mapStateToProps(state) {
  return {
    stones: state.stone,
    settings: state.settings
  };
}

// export default DolniMenu;
//zjednodušený zapis ES6 jako mapDispatchToProps

export default connect(mapStateToProps, { fetchStones, putStone, changeSetting})(DolniMenu);

//zjednodušený zapis ES6 jako mapDispatchToProps
//nově i práce s globální promenou changeSetting
