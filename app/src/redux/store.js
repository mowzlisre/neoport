import { combineReducers, createStore } from 'redux';
import { storeReducer, statusReducer} from './reducers/storeReducer';

const rootReducer = combineReducers({
  storeData: storeReducer,
  status: statusReducer,
  // Other reducers if you have more
});

const store = createStore(rootReducer);

export default store;
