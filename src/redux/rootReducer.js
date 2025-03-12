import { combineReducers } from "@reduxjs/toolkit";
import assessmentReducer from "./slices/assessment";
import sectionsReducer from "./slices/sections";
import rewardsReducer from "./slices/rewards";
import usersReducer from "./slices/users";

const rootReducer = combineReducers({
  assessment: assessmentReducer,
  sections: sectionsReducer,
  rewards: rewardsReducer,
  users: usersReducer,
});

export default rootReducer;
