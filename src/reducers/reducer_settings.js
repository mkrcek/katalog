import _ from 'lodash';

import { CHANGE_SETTING } from '../actions';

export default function(state = {
  pozadi : "green",
  pismo : "black",
  serverDate : "2020-04-04 22:22:00"
}, action) {
  switch (action.type) {
    case  CHANGE_SETTING:
      return action.payload;
      // ----- toto bylo původně
    default:
      return state;
      // return _.mapKeys(action.payload.data, '0');
  }
}


//FETCH_POST

      // const post = action.payload.data;
      // const newState = { ...state };
      // newState[post.id] = post;
      // return newState;
