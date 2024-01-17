import { combineReducers, createStore } from 'redux';
import storeReducer from './reducers/storeReducer';

const rootReducer = combineReducers({
  storeData: storeReducer,
  // Other reducers if you have more
});

const store = createStore(rootReducer);

export default store;
