import {combineReducers} from 'redux';

const initialStateTask = {
  taskData: null,
};

const TaskReducer = (state = initialStateTask, action) => {
  if (action.type === 'SET_TASK') {
    return {taskData: action.taskData};
  }
  return state;
};

const reducer = combineReducers({
  TaskReducer,
});

export default reducer;
