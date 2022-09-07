import {
  createStore, combineReducers, applyMiddleware
} from 'redux';
import createPromiseMiddleware from 'redux-promise-middleware';
import chartReducer from './routes/Chart/reducer';
import todoReducer from './routes/Todo/reducer';
import homeReducer from './routes/Homes/reducer';

const reducer = combineReducers({
  chart: chartReducer,
  toda: todoReducer,
  home: homeReducer
});

const middlewares = [createPromiseMiddleware()];


const storeEnhancers = applyMiddleware(...middlewares);

const initialState = {};
export default createStore(reducer, initialState, storeEnhancers);
