import { combineReducers } from 'redux';
import auth from './slice/auth';
export const rootReducer = combineReducers({
    auth
});