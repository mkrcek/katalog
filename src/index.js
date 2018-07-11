import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {HashRouter, Route, Switch} from 'react-router-dom';
//https://reacttraining.com/react-router/web/api/HashRouter
// import { HashRouter } from 'react-router-dom'




import promise from 'redux-promise';

import reducers from './reducers';
import PostsNew from   './components/posts_new';

import StonesIndex from './components/stones_index';
import StoneDetail from  './components/stone_detail';
import DolniMenu from './components/dolni_menu';


import KatalogIndex from './components/katalog_index';
import KatalogIndexStrap from './components/katalog_index-strap';


import { fetchStones} from '../src/actions';



const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
// let mojeUrl = window.location.protocol + "//" + window.location.host + '/1996/';

// setInterval(fetchStones, 1000);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <HashRouter>
      <div>
        <div>
          <Switch>
            {/*<Route path="/posts/new" component={PostsNew} />
            <Route path="/katalog" component={KatalogIndex} />
            <Route path="/:unid" component={StoneDetail} />
            <Route path="/" component={StonesIndex} />*/}

            <Route path="/katalog" component={KatalogIndex} />
            <Route path="/" component={KatalogIndexStrap} />
          </Switch>

          {/*
            <StonesIndex/>
            */}
        </div>
      </div>
    </HashRouter>
  </Provider>
  , document.querySelector('.container-fluid')

);
