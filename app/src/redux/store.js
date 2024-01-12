import { combineReducers, createStore } from 'redux';
import csvReducer from './reducers/csvReducer';

const rootReducer = combineReducers({
  csvData: csvReducer,
  // Other reducers if you have more
});

const store = createStore(rootReducer);

export default store;
