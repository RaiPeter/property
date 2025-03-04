import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./features/slices/authSlice";
import propertyReducer from "./features/slices/propertiesSlice"

// Load persisted state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error("Failed to load state", error);
    return undefined;
  }
};

// Save Redux state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (error) {
    console.error("Failed to save state", error);
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    properties : propertyReducer
  },
  preloadedState: loadState(),
})

store.subscribe(() => {
  saveState(store.getState()); // Save Redux state on every update
});

export default store;
