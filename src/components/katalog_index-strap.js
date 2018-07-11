
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchKatalog } from '../actions';

import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Grid, Row, Col, code, Breadcrumb, Table, thead, tr, th, td,
    Well, form, FormGroup, ControlLabel, FormControl, option, Jumbotron, Button } from 'react-bootstrap';

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


class KatalogIndexStrap extends Component {
    
    

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

            <Grid fluid>
                <Row className="show-grid">
                    <Col>
                        <code>
                            <Navbar fixedTop>
                                <Navbar.Header>
                                    <Navbar.Brand>
                                        <a href="#">HOME</a>
                                    </Navbar.Brand>
                                </Navbar.Header>
                                <Nav>
                                    <NavItem eventKey={1} href="#">
                                        Soubor
                                    </NavItem>
                                    <NavItem eventKey={2} href="#">
                                        Editovat
                                    </NavItem>
                                    <NavDropdown eventKey={3} title="Firmy" id="basic-nav-dropdown">
                                        <MenuItem eventKey={3.1}>Přehled</MenuItem>
                                        <MenuItem eventKey={3.2}>Editace</MenuItem>
                                        <MenuItem eventKey={3.3}>Vytvoření</MenuItem>
                                        <MenuItem divider />
                                        <MenuItem eventKey={3.4}>Tisk</MenuItem>
                                    </NavDropdown>
                                    <NavDropdown eventKey={4} title="Uživatelé" id="basic-nav-dropdown2">
                                        <MenuItem eventKey={4.1}>Přehled</MenuItem>
                                        <MenuItem eventKey={4.2}>Editace</MenuItem>
                                        <MenuItem eventKey={4.3}>Práva a oprávnění</MenuItem>
                                        <MenuItem divider />
                                        <MenuItem eventKey={4.4}>Tisk</MenuItem>
                                    </NavDropdown>
                                </Nav>
                            </Navbar>
                        </code>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col md={2}>
                        <code>
                            <Nav bsStyle="pills" stacked >
                                <NavItem eventKey={1} href="#">Novinky </NavItem>
                                <NavItem eventKey={2} title="Item">Firmy</NavItem>
                                <NavItem eventKey={3} >Faktury</NavItem>
                                <NavItem eventKey={3.1} >Vydané</NavItem>
                                <NavItem eventKey={3.2} disabled>Přijaté</NavItem>
                                <NavItem eventKey={3} >Tisk</NavItem>
                            </Nav>
                        </code>
                    </Col>
                    <Col md={10}>
                        <code>
                            <Row className="show-grid">
                                <Breadcrumb>
                                    <Breadcrumb.Item href="#">Firmy</Breadcrumb.Item>
                                    <Breadcrumb.Item href="#">Přehled</Breadcrumb.Item>
                                    <Breadcrumb.Item active>Podrobnosti</Breadcrumb.Item>
                                </Breadcrumb>
                            </Row>
                            <Row className="show-grid">
                                <Row>
                                    <Col md={3}>
                                        <code>
                                            <form >
                                                <FormGroup controlId="formControlsSelect">
                                                    <ControlLabel>Řazení</ControlLabel>
                                                    <FormControl componentClass="select" placeholder="select" value={this.state.value} onChange={this.handleChange}>
                                                        <option value="nadpis">nadpis</option>
                                                        <option value="popis">popis</option>
                                                        <option value="prikaz">prikaz</option>
                                                        <option value="pozic">pozic</option>
                                                        <option value="typprikazu">typprikazu</option>
                                                        <option value="unid">unid</option>
                                                    </FormControl>
                                                </FormGroup>
                                            </form>
                                        </code>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <code>
                                            <Table striped bordered condensed hover className='scrollTable'>
                                                <thead>
                                                <tr>
                                                    {this.renderRadekHlavicka()}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.renderKatalog()}
                                                </tbody>
                                            </Table>
                                        </code>
                                    </Col>
                                </Row>

                            </Row>
                            <Row>
                                <div>
                                    <Well bsSize="large">Naprtosto úžasné koupání,</Well>
                                    <Well bsSize="small">když není co doma, v sobotu, na praní!</Well>
                                </div>
                            </Row>
                        </code>
                    </Col>

                </Row>

            </Grid>

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



export default connect(mapStateToProps, { fetchKatalog})(KatalogIndexStrap);
//zjednodušený zapis ES6 jako mapDispatchToProps
//nově i práce s globální promenou changeSetting
