
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStones, changeSetting } from '../actions';

import { ROOT_URL, timeCountDown } from '../tools/dm_tools'; //globální konstanta

import DolniMenu from './dolni_menu';



// ******************  Globální konstanty ******************
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

const SchemeAir = "1";
const SchemeBoiler = "2";
const SchemeWater = "3";

const DMbranaT1 = "1";
const DMbranaT2 = "2";
const DMbranaT3 = "3";

const DMgarageT1 = "0";   //otevřít
const DMgarageT2 = "";
const DMgarageT3 = "1";   //zavřít

// const GRID_SM = "col-3 col-sm-3 col-md-3 col.xl-3"; //teplota
const GRID_SM = "col-3"; //teplota
const GRID_MD = "col-8 col-sm-6"; //např.počasí - nepoužito
const GRID_FUL = "col-12 col-sm-12"; //kamera - napoužito

// const GRID_CAM = "col-12 col-sm-12 col-lg-12"; //kamera
const GRID_CAM = "col-12"; //kamera
const GRID_ALARMCAM = "col-12"; //kamera alarm
const GRID_WEAD = "col-12 col-sm-6 col-md-4"; //weather
const GRID_GATE = "col-3 col-sm-3 col-md-3 col.xl-3"; //brána


//pro chybovou hlasku

const NEKONECNO = "NEKONECNO"; //HTML značka je &infin;
const NIC = "0";

const BARVAPOZADI = "#d9d9d9";

// ****************** Globální konstanty ******************


const REFRESHTIME = 1000;
let serverDate = "2018-04-04 00:00:00";


// ****************** hlavní kostra a obal základního Stone ******************

function ErrorStoneLine(props) {
  //počítání rozdílu, že server nejede
  //
  // console.log("SS", props);
  // stone = props.stones;
  // console.log("stone", stone);
  let t = props.props.stone.lrespiot.split(/[- :]/);
  let d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
  let lastDate = new Date(d);
  // console.log("lastDate", lastDate);

  let novyDate = new Date();
  //pokud náhodou nejsou informace ze serveru, tak se dolní čas současný z FE klienta
  if (props.props.server){
    let t = props.props.server.value.split(/[- :]/);
    let d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    novyDate = new Date(d);
    // console.log("novyDate", novyDate);
    // novyDate = new Date(props.props.server.value);
  }
  let longText = false;
  let rozdilDate = (timeCountDown(lastDate.getTime(), novyDate.getTime() ,longText));

  // console.log("rozdilDate", rozdilDate);
  // console.log("lastDate", lastDate);
  // console.log("novyDate", novyDate);
  if (rozdilDate == "NEKONECNO") {
    // StonesIndex.changePozadi();
    // serverErrorColor = "red";
    return (
      <div style={{backgroundColor:"pink", color:"black"}} >&infin;</div>
    );
  }

  if (rozdilDate == "0") {
    // serverErrorColor = "inherit";
    //je to o jeden stone posunutý :-()
    return (
      <div>NIC</div>
    );
  }
  return (
    <div style={{backgroundColor:"pink", color:"black"}} >{rozdilDate}</div>
  );
}

function ErrorStoneLineGen(stoneTime, server) {
  //počítání rozdílu, že server nejede - a vrátí hodnoty


  // console.log("SS", stoneTime);
  // console.log("server", server);

  let lastDate = new Date();
  //pokud náhodou nejsou informace ze Stone, tak se dolní čas současný z FE klienta

  //puvodne jsem předal jsem stone-ted stoneTime
  // if (stoneTime.lrespiot) {
  //   let t = stoneTime.lrespiot.split(/[- :]/);
  // .... teď více univerzální

  if (stoneTime) {
    let t = stoneTime.split(/[- :]/);
    let d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    lastDate = new Date(d);
    // console.log("lastDate", lastDate);
  }

  let novyDate = new Date();
  //pokud náhodou nejsou informace ze serveru, tak se dolní čas současný z FE klienta
  if (server){
    let t = server.value.split(/[- :]/);
    let d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    novyDate = new Date(d);
    // console.log("novyDate", novyDate);
    // novyDate = new Date(props.props.server.value);
  }
  let longText = false;
  let rozdilDate = (timeCountDown(lastDate.getTime(), novyDate.getTime() ,longText));


  switch (true) {
    case rozdilDate == NEKONECNO:
      return NEKONECNO
      break;
    case rozdilDate == NIC:
      return NIC
      break;
    default:
      return rozdilDate
  }

}

function StoneCore(props) {
  let pozadi = "black";
  let pismo = "white";

  if (props.chyba != NIC) {
    pozadi = "Red"
  } else {
    pozadi = "inherit"
  }

  return (
    <div className={'boxWrap ' + props.gridSize} style={{backgroundColor:pozadi}}>
      <Link to={`/${props.stone.unid}`} style={{backgroundColor:pozadi, color:pismo}}>
        {props.children}
      </Link>
    </div>
  );


}

// ****************** jednotlivé STONES ******************

function StoneTemperature (props) {
  let temperatureScheme = props.stone.subtype; //barevné schéma pro teplotu
  let tempVal = Number(props.stone.value); //protože tempVal je typu STRING musím jej převést na číslo. Zejména pro porovnávíní větší menší
  // let pozadi = props.settings.pozadi;
  let pozadi = "black";
  let pismo = "white";


  switch (temperatureScheme) {
    case SchemeAir: //air - vzduch
      switch (true) {
          case tempVal < 4:
            pozadi = "CornflowerBlue";
            pismo = "AliceBlue";
            break;
          case tempVal < 16:
            pozadi = "CornflowerBlue";
            pismo = "Black";
            break;
          case tempVal < 21:
            pozadi = "MediumOrchid";
            pismo = "Black";
            break;
          case tempVal < 31:
            pozadi = "Orange";
            pismo = "Black";
            break;
          case tempVal > 30:
            pozadi = "Red";
            pismo = "Black";
            break;
        } //switch air
      break;

    case SchemeBoiler: //boiler
      switch (true) {
        case tempVal < 4:
          pozadi = "CornflowerBlue";
          pismo = "AliceBlue";
          break;
        case tempVal < 35:
          pozadi = "CornflowerBlue";
          pismo = "Black";
          break;
        case tempVal < 70:
          pozadi = "MediumOrchid";
          pismo = "Black";
          break;
        case tempVal < 81:
          pozadi = "Orange";
          pismo = "Black";
          break;
        case tempVal > 80:
          pozadi = "Red";
          pismo = "Black";
          break;
      default:
    } //switch boiler

    case SchemeWater: //water - swimming pool
      switch (true) {
        case tempVal < 4:
          pozadi = "CornflowerBlue";
          pismo = "AliceBlue";
          break;
        case tempVal < 20:
          pozadi = "CornflowerBlue";
          pismo = "Black";
          break;
        case tempVal < 25:
          pozadi = "MediumOrchid";
          pismo = "Black";
          break;
        case tempVal < 30:
          pozadi = "Orange";
          pismo = "Black";
          break;
        case tempVal > 29:
          pozadi = "Red";
          pismo = "Black";
          break;
        default:
      } //switch swimming pool
        break;
    default:
  } //konec temperatureScheme


  //vyřešení zobrazení času ... a stavu čerpadla.... u všech teplomeru?
//lehce testováno - čeká jak omen dodá data. Přesunout na jiný STONE
  // let pozadi3 = "";
  // let tretiRadek = "NIC";
  // let mujJson = `0 2018-05-04 12:03:57`;  // nahradí omenouv NewTask
  // mujJson = "";
  //
  // if (mujJson != "") {
  //     let deviceDate = "";
  //     deviceDate = props.stone.lchvalue + ""; //cas z device, LivingStone
  //     if ((props.stone.lchvalue == `undefined`) || (props.stone.lchvalue == null) || (props.stone.lchvalue == "")  || (props.stone.lchvalue.charAt(0) != "2")) {
  //       deviceDate = "2018-05-07 00:00:00";
  //     }
  //     let textLostConTime = timeCountDown(deviceDate, serverDate, false);
  //
  //
  //     if (mujJson.charAt(0) == "0") {
  //       tretiRadek = "off " + textLostConTime;
  //       pozadi3 = "orange";
  //     } else {
  //       tretiRadek = "on " + textLostConTime;
  //       pozadi3 = "green";
  //     }
  //   }

  //ošetření chyby
  let textErroru = props.chyba;
  if (props.chyba != NIC) {
    pozadi = BARVAPOZADI;
    pismo = "Red";
  } else {
    textErroru = "";
  }

  //vyrendruj obsah Stone
  // <ErrorStoneLine props={props}/>
  return (
    <div className="boxContent" style={{backgroundColor:pozadi, color:pismo}}>
      <h1 >{props.stone.value}&deg;</h1>
      <div>{props.stone.webname}</div>
      <div>{textErroru}</div>
    </div>
  );
}

function StoneLight (props) {
  let pozadi = "black";
  let pismo = "white";
  let tempVal = Number(props.stone.value); //protože tempVal je typu STRING musím jej převést na číslo. Zejména pro porovnávíní větší menší
  switch (true) {
    case tempVal == 1:
      pozadi = "GoldenRod";
      pismo = "Black";
      break;
    default:
      pozadi = "#F3F3F3";
      pismo = "Black";
  }

  //ošetření chyby
  let textErroru = props.chyba;
  if (props.chyba != NIC) {
    pozadi = "";
    pismo = "Red";
  } else {
    textErroru = "";
  }

  //vyrendruj obsah Stone
  return (
    <div className="boxContent" style={{backgroundColor:pozadi, color:pismo}}>
      <h1 ><i style={{fontSize:"5vw", color:"Black"}} className="pekneIkony">&#xf0eb;</i></h1>
      <div>{props.stone.webname}</div>
      <div>{textErroru}</div>
    </div>
  );
}

function StonePir (props) {
  let pozadi = "black";
  let pismo = "white";
  let tempVal = Number(props.stone.value); //protože tempVal je typu STRING musím jej převést na číslo. Zejména pro porovnávíní větší menší
  switch (true) {
    case tempVal != 0:
      pozadi = "Tomato";
      pismo = "Black";
      break;
    default:
      pozadi = "#F3F3F3";
      pismo = "Black";
  }

  //ošetření chyby
  let textErroru = props.chyba;
  if (props.chyba != NIC) {
    pozadi = BARVAPOZADI;
    pismo = "Red";
  } else {
    textErroru = "";
  }

  //vyrendruj obsah Stone
  return (
    <div className="boxContent" style={{backgroundColor:pozadi, color:pismo}}>
      <h1 ><i style={{fontSize:"5vw", color:"Black"}} className="pekneIkony">&#xf071;</i></h1>
      <div>{props.stone.webname}</div>
      <div>{textErroru}</div>
    </div>
  );
}

function StoneCamera (props) {
  let pozadi = "black";
  let pismo = "white";
  pozadi = "#F3F3F3";
  pismo = "Black";

  // //počítání rozdílu, že server nejede
  // let lastDate = new Date(props.stone.lrespiot);
  // let novyDate = new Date();
  // let longText = false;
  // let rozdilDate = (timeCountDown(lastDate.getTime(), novyDate.getTime() ,longText));

  //ošetření chyby
  let textErroru = props.chyba;
  if (props.chyba != NIC) {
    pozadi = BARVAPOZADI;
    pismo = "Red";
  } else {
    textErroru = "";
  }

  //vyrendruj obsah Stone
  return (
    <div className="boxContent-camera" style={{backgroundColor:pozadi, color:pismo}}>
      <h1>
        <img style={{width: "100%"}} src = {`${ROOT_URL}/${props.stone.subtype}`} alt="haha" className="img-fluid" />
      </h1>
      <div>{props.stone.webname}</div>
      <div>{textErroru}</div>
    </div>
  );
}

function StoneWater (props) { //water nebo Analog :-)
  let pozadi = "black";
  let pismo = "white";
  let tempVal = Number(props.stone.value); //protože tempVal je typu STRING musím jej převést na číslo. Zejména pro porovnávíní větší menší
  let temperatureScheme = Number(props.stone.subtype); //barevné schéma pro teplotu

  switch (true) {
    case tempVal < temperatureScheme:
      pozadi = "Red";
      pismo = "Black";
      break;
    default:
      pozadi = "LightGreen";
      pismo = "Black";
  }

  //ošetření chyby
  let textErroru = props.chyba;
  if (props.chyba != NIC) {
    pozadi = BARVAPOZADI;
    pismo = "Red";
  } else {
    textErroru = "";
  }

    //vyrendruj obsah Stone
  return (
    <div className="boxContent" style={{backgroundColor:pozadi, color:pismo}}>
      <h1 >{props.stone.value}%</h1>
      <div>{props.stone.webname}</div>
      <div>{textErroru}</div>
    </div>
  );
}

function StoneGate (props) { // :-)
  let pozadi = "black";
  let pismo = "white";
  let tempVal = Number(props.stone.value); //protože tempVal je typu STRING musím jej převést na číslo. Zejména pro porovnávíní větší menší
  let stavText = "";

  switch (true) {
    case tempVal === 0:
      pozadi = "#F3F3F3";
      pismo = "Black";
      stavText = "Zavřeno";
      break;
    default:
      pozadi = "GoldenRod";
      pismo = "Black";
      stavText = tempVal;
  }


  //ošetření chyby
  let textErroru = props.chyba;
  if (props.chyba != NIC) {
    pozadi = BARVAPOZADI;
    pismo = "Red";
  } else {
    textErroru = "";
  }

  //vyrendruj obsah Stone
  return (
    <div className="boxContent" style={{backgroundColor:pozadi, color:pismo}}>
      <h1 >{stavText}</h1>
      <div>{props.stone.webname}</div>
      <div>{textErroru}</div>
    </div>
  );
}

function StoneWeather (props) { //Počasí :-)
  let pozadi = "black";
  let pismo = "white";
  pozadi = "#F3F3F3";
  pismo = "Black";

  //ošetření chyby
  let textErroru = props.chyba;
  if (props.chyba != NIC) {
    pozadi = BARVAPOZADI;
    pismo = "Red";
  } else {
    textErroru = "";
  }

  //vyrendruj obsah Stone
  return (
    <div className="boxContent" style={{backgroundColor:pozadi, color:pismo}}>
      <h1 ><img id="sensor-pocasi-url" style={{width: "90%"}} src = {`${ROOT_URL}/${props.stone.subtype}`} alt="pocasi" className="img-responsive" /></h1>
      <div>{props.stone.webname}</div>
      <div>{textErroru}</div>
    </div>
  );
}

function StoneCameraAlarm (props) {
  let pozadi = "black";
  let pismo = "white";
  pozadi = "Red";
  pismo = "Black";
  let newURL = "images/image-no-alarm.jpg";

  switch (true) {
    case props.stone.value != "":
      pozadi = "Red";
      pismo = "Black";
      newURL = props.stone.subtype;  //adresa ze serveru
      break;
    default:
      pozadi = "#F3F3F3";
      pismo = "Black";
      newURL = "images/image-no-alarm.jpg";
  }

  //ošetření chyby
  let textErroru = props.chyba;
  if (props.chyba != NIC) {
    pozadi = BARVAPOZADI;
    // pismo = "Red";
  } else {
    textErroru = "";
  }

  //vyrendruj obsah Stone
  return (
      <div>
        <div className="row boxContent-camera col-12 justify-content-between align-items-end" style={{backgroundColor:"Crimson ", color:pismo}}>
          <div className = "col" style={{backgroundColor:"Crimson", color:pismo}}>
            <p>{props.stone.webname} </p>
            <div>{textErroru}</div>
          </div>

          <div className = "col">
            <img  src = {`${ROOT_URL}/${props.stone.subtype}`} alt="haha" className="img-fluid" />
          </div>
          <div className = "col">
            <img  src = {`${ROOT_URL}/${props.stone.subtype}`} alt="haha" className="img-fluid" />
          </div>
          <div className = "col">
            <img  src = {`${ROOT_URL}/${props.stone.subtype}`} alt="haha" className="img-fluid" />
          </div>

      </div>
    </div>
  );

  // return (
  //   <div className="boxContent-camera" style={{backgroundColor:pozadi, color:pismo}}>
  //     <h1>
  //       <img id="sensor-kamera-url" style={{width: "100%"}} src = {`${ROOT_URL}/${props.stone.subtype}`} alt="haha" className="img-fluid" />
  //     </h1>
  //     <div>{props.stone.webname}</div>
  //     <div>{textErroru}</div>
  //   </div>
  // );

}

function StoneGarage (props) { // :-)
  let pozadi = "black";
  let pismo = "white";
  // má úplně jinou strukuru json! Není třeba VALUE !! a všechny nové údaje jsou čísla.
  // {
  //   "door": 47,
  //   "CurrentDoorState": 4,
  //   "TargetDoorState": 1,
  //   "TargetDoorOpen": 0,
  //   "ObstructionDetected": true
  // }
  let tempVal = Number(props.stone.door); //protože tempVal je typu STRING musím jej převést na číslo. Zejména pro porovnávíní větší menší

  let stavText = "";

  console.log("tempVal", tempVal);
  switch (true) {
    case tempVal === 0:   //bylo jen ==
      pozadi = "#F3F3F3"; // bylo jen "F3F3F3"
      pismo = "Black";
      stavText = "Zavřeno";
      break;
    default:
      pozadi = "GoldenRod";
      pismo = "Black";
      stavText = tempVal + "%";
  }

  //ošetření chyby
  let textErroru = props.chyba;
  if (props.chyba != NIC) {
    pozadi = "DimGray";
    pismo = "Red";
  } else {
    textErroru = "";
  }


  //vyrendruj obsah Stone
  return (
    <div className="boxContent" style={{backgroundColor:pozadi, color:pismo}}>
      <h1 >{stavText}</h1>
      <div>{props.stone.webname}</div>
      <div>{textErroru}</div>
    </div>
  );

}

// let serverTimeRefresh; // pomocna promena na nastaveni "setInterval" pre download dat ze serveru

class StonesIndex extends Component {

  constructor() {
    super();
    this.state = {
      casServeru: 0,
      serverTimeRefresh: undefined
      // vydefinování a nastaveni úvodní "promene"
      // poziceNaObrazovce: 0,
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.serverTimeRefresh);
    // ctení z promene (state) serverTimeRefresh

    //když odcházím z hlavní obrazovky, vypínám "setInterval" pro download dat ze serveru
    //pokud by to zde nebylo, při vrácení z detailu se opět spustí další - paralelní "refresh" dat ze serveru....

  }
  componentDidMount() {
    this.setState({serverTimeRefresh: setInterval(this.props.fetchStones, REFRESHTIME)});
    //nastavení promene serverTimeRefresh do State. přes setState - a tak je to spravné :-)


    // this.props.fetchStones();
    // jen jednou načtení - když nechci opakovat každou sekundu REFRESHTIME

    //když přicházím NA hlavní obrazovku, zapínám "setInterval" pro download dat ze serveru
    //v Detailu stone je také potřeba udělat "refresh" je

    // this.setState((prevState, props) => {
    //       return { casServeru: serverDate }
    //     });

  }

  renderStones() {
    //namapování ale nejdříve setřídění podle weborder


    return _.map(_.sortBy(this.props.stones, (el) => {
        return Number(el.weborder)
      }), stone => {

      let sensorWebType = stone.webtype;
      // console.log(this.props);
      let chybovaHlaska = ErrorStoneLineGen(stone.lrespiot, this.props.server);

      // console.log(chybovaHlaska);
// console.log(window.scrollY);



      switch (sensorWebType) {
            case MDserver: //informace ze serveru, unid="0"
                // serverDate = stone.value;
              break;
            case DMteplota: //teplota
              return (
                <StoneCore gridSize={GRID_SM} stone={stone} chyba = {chybovaHlaska} key={stone.unid} >
                  <StoneTemperature stone={stone} server={this.props.server} chyba = {chybovaHlaska}/>
                </StoneCore>
              );
              break;
            case DMvoda: //voda
              return (
                <StoneCore gridSize={GRID_SM} stone={stone} chyba={chybovaHlaska}  key={stone.unid} >
                  <StoneWater stone={stone} server={this.props.server} chyba={chybovaHlaska} />
                </StoneCore>
              );
              break;
            case DMsvetlo: //svetlo
              return (
                <StoneCore gridSize={GRID_SM} stone={stone} chyba={chybovaHlaska}  key={stone.unid} >
                  <StoneLight stone={stone} server={this.props.server} chyba={chybovaHlaska} />
                </StoneCore>
              );
              break;
            case DMalarm: //alarm - PIR
              return (
                <StoneCore gridSize={GRID_SM} stone={stone} chyba = {chybovaHlaska} key={stone.unid}>
                  <StonePir stone={stone} server={this.props.server} chyba = {chybovaHlaska}/>
                </StoneCore>
              );
              break;
            case DMbrana: //brána
              return (
                <StoneCore gridSize={GRID_SM} stone={stone} chyba = {chybovaHlaska} key={stone.unid}>
                  <StoneGate stone={stone} server={this.props.server} chyba = {chybovaHlaska}/>
                </StoneCore>
              );
              break;
            case DMkamera: //kamera
              return (
                <StoneCore gridSize={GRID_CAM} stone={stone} chyba = {chybovaHlaska} key={stone.unid}>
                  <StoneCamera stone={stone} server={this.props.server} chyba = {chybovaHlaska}/>
                </StoneCore>
              );
              break;
            case DMpocasi: //počasí
              return (
                <StoneCore gridSize={GRID_SM} stone={stone} chyba = {chybovaHlaska} key={stone.unid} >
                  <StoneWeather stone={stone} server={this.props.server} chyba = {chybovaHlaska}/>
                </StoneCore>
              );
              break;
            case DMCameraAlarm: //Obrazek z kamery po alarmu
              chybovaHlaska = ErrorStoneLineGen(stone.lchvalue, this.props.server);

              //zobrazuje se trochu jiný čas - tedy lchvalue místo lrespiot
              return (
                <StoneCore gridSize={GRID_ALARMCAM} stone={stone} chyba = {chybovaHlaska} key={stone.unid}>
                  <StoneCameraAlarm stone={stone} server={this.props.server} chyba = {chybovaHlaska}/>
                </StoneCore>
              );
              break;
            case DMgarage: //Obrazek z kamery po alarmu
              return (
                <StoneCore gridSize={GRID_SM} stone={stone} chyba = {chybovaHlaska} key={stone.unid}>
                  <StoneGarage stone={stone} server={this.props.server} chyba = {chybovaHlaska}/>
                </StoneCore>
              );
              break;
            default:
              return (
                <StoneCore gridSize={GRID_SM} stone={stone} chyba = {chybovaHlaska} key={stone.unid} >
                  <StoneTemperature stone={stone} server={this.props.server} chyba = {chybovaHlaska}/>
                </StoneCore>
              );
              break;
          } //switch


    });
  }

  //práce s globální promenou (... znamená že nevytvoří nový objekt)
  changeTime() {
    this.props.changeSetting({
      ...this.props.settings,
      serverDate: "1.1.2000"
    })
  }

  //práce s globální promenou (... znamená že nevytvoří nový objekt)
  changePozadi() {
    this.props.changeSetting({
      ...this.props.settings,
      pozadi: "green"
    })
  }

  render() {

    return (
      <div>
        {/*
          <div className="row col-12 fixed-top" style={{backgroundColor:"LightGoldenRodYellow"}} >
            horní menu
          </div>
        */}
        <div className = "row">
          {this.renderStones()}
        </div>
        <div className="row">
          <DolniMenu
            errorMsg={ this.props.server && this.props.server.error || !this.props.server && ""}
            cas={ this.props.server && this.props.server.value || !this.props.server && "NENI SERVER TIME"}
          />
        {/* LOGIKA
              jestliže existuje objekt(this.props.server), tak zobraz čas (value)
              jinak napíše NENI SERVER TIME
              možná je lepší to přepsat do promenych
              https://hackernoon.com/conditional-rendering-on-react-57a864c2d04d

              middleName="7 alarmů"
              */}
        </div>
      </div>
    );
  }

}



//test práce s globální promenou settings
function mapStateToProps(state) {
  return {
    stones: state.stones,
    settings: state.settings,
    server: state.stones["0"]
  };
}

export default connect(mapStateToProps, { fetchStones,  changeSetting})(StonesIndex);
//zjednodušený zapis ES6 jako mapDispatchToProps
//nově i práce s globální promenou changeSetting
