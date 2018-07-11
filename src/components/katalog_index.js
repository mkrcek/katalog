
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchKatalog } from '../actions';

import { ROOT_URL, timeCountDown } from '../tools/dm_tools'; //globální konstanta

import DolniMenu from './dolni_menu';



// ******************  Globální konstanty ******************

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


const REFRESHTIME = 50000;
let serverDate = "2018-04-04 00:00:00";


//klikací navigační menu //

const NavItem = props => {
    const pageURI = window.location.pathname+window.location.search
    const liClassName = (props.path === pageURI) ? "nav-item active" : "nav-item";
    const aClassName = props.disabled ? "nav-link disabled" : "nav-link"
    return (
        <li className={liClassName}>
            <a href={props.path} className={aClassName}>
                {props.name}
                {(props.path === pageURI) ? (<span className="sr-only">(current)</span>) : ''}
            </a>
        </li>
    );
}

class NavDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: false
        };
    }
    showDropdown(e) {
        e.preventDefault();
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn
        }));
    }
    render() {
        const classDropdownMenu = 'dropdown-menu' + (this.state.isToggleOn ? ' show' : '')
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown"
                   aria-haspopup="true" aria-expanded="false"
                   onClick={(e) => {this.showDropdown(e)}}>
                    {this.props.name}
                </a>
                <div className={classDropdownMenu} aria-labelledby="navbarDropdown">
                    {this.props.children}
                </div>
            </li>
        )
    }
}

// klikací navigační menu - KONEC

// ****************** hlavní kostra a obal základního Stone ******************



function KatalogCore(props) {
  let pozadi = "inherit";
  let pismo = "inherit";

  // console.log("props", props);

  return (
    <div className={'boxWrap ' + props.gridSize} style={{backgroundColor:pozadi}}>
      <Link to={`/${props.katalog.unid}`} style={{backgroundColor:pozadi, color:pismo}}>
        {props.children}
      </Link>
    </div>
  );

}


let serverTimeRefresh; // pomocna promena na nastaveni "setInterval" pre download dat ze serveru

class KatalogIndex extends Component {

  constructor() {
    super();
    this.state = {
      casServeru: 0,
      serverTimeRefresh: undefined,
      value: 'pozic',   //výchozí hodnota pro třídění
      // poziceNaObrazovce: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //pro třídění
  handleChange(event) {
    this.setState({value: event.target.value});
  }


  //pro třídění
  handleSubmit(event) {
    alert('Řazeno podle sloupce: ' + this.state.value);
    event.preventDefault();
  }

  componentWillUnmount() {
    clearInterval(this.state.serverTimeRefresh);
    //když odcházím z hlavní obrazovky, vypínám "setInterval" pro download dat ze serveru
  }

  componentDidMount() {
    console.log("Inicializace KATALOGU");
    this.props.fetchKatalog();
    this.setState({serverTimeRefresh: setInterval(this.props.fetchKatalog, REFRESHTIME)});

    // serverTimeRefresh = setInterval(this.props.fetchKatalog, REFRESHTIME);

    //když přicházím NA hlavní obrazovku, zapínám "setInterval" pro download dat ze serveru
  }

  renderRadekHlavicka() {

    let celyKatalog = _.map(this.props.katalog, katalog => {
          return(
              katalog
          );
      });

    return _.map(celyKatalog[0], function(stoneItem, stoneKey)  {
      return (
        <th style = {{ fontSize:"15"}}>{stoneKey}</th>
      );
    });
  }



  renderRadekDetail(props) {
    //tabulka se všemi údaji, které mám k dispozici:
    // return _.map(this.props.stone, stoneItem, stoneKey => {
    // console.log("props.katalog", props);
    return _.map(props, function(stoneItem, stoneKey)  {
      return (
        <td style = {{ fontSize:"15"}}>
          {stoneItem}
        </td>
      );
    });
  }


  renderKatalog() {
    //namapování ale nejdříve setřídění podle pozic

    // console.log("katalog", this.props.katalog);
    return _.map(_.sortBy(this.props.katalog, (el) => {
      //podle čeho se bude třídit a je nastaveno v ROLETOVéM MENU
      switch (this.state.value) {
        case 'nadpis':
          return (el.nadpis)
          break;
        case 'popis':
          return (el.popis)
          break;
        case 'prikaz':
          return (el.prikaz)
          break;
        case 'pozic':
          return Number(el.pozic)
          break;
        case 'typprikazu':
          return Number(el.typprikazu)
          break;
        case 'unid':
          return Number(el.unid)
          break;
        default:
          return Number(el.pozic)
      }


      }), katalog => {
          return(
              <tr key={katalog.unid}>
                {this.renderRadekDetail(katalog)}
              </tr>
          );

      });

  }



  render() {

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">BOOTSTRAP KATALOG</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">

                    <NavItem path="/" name="Home" />
                    <NavItem path="/" name="Page2" />
                    <NavItem path="/" name="Disabled" disabled="true" />
                    <NavDropdown name="Dropdown">
                        <a className="dropdown-item" href="/">Action</a>
                        <a className="dropdown-item" href="/">Another action</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="/">Something else here</a>
                    </NavDropdown>

                </ul>
                <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </nav>
    );
  }
}


//test práce s globální promenou settings
function mapStateToProps(state) {
  return {
    katalog: state.katalog,
    settings: state.settings
  };
}



export default connect(mapStateToProps, { fetchKatalog})(KatalogIndex);
//zjednodušený zapis ES6 jako mapDispatchToProps
//nově i práce s globální promenou changeSetting
