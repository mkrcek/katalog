import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import StonesReducer from './reducer_stones';
import SettingsReducer from './reducer_settings';

import KatalogReducer from './reducer_katalog';

const rootReducer = combineReducers({
  stones: StonesReducer,
  katalog: KatalogReducer,
  form: formReducer,
  settings: SettingsReducer
});

export default rootReducer;
