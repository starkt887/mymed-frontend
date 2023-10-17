import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./userReducer";
import appReducer from "./appReducer";
import meetReducer from "./meetReducer";
import notificationReducer from "./notificationReducer";
import storageLocal from "redux-persist/lib/storage"; // Local Storage
// import storageSession from "redux-persist/lib/storage/session"; // Session Storage
import { encryptTransform } from "redux-persist-transform-encrypt";

const reducers = combineReducers({
  app: appReducer,
  user: userReducer,
  meet: meetReducer,
  notification: notificationReducer,
});

const persistConfig = {
  key: "root",
  storage: storageLocal,
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_REDUX_KEY,
    }),
  ],
};

const rootReducer = (state, action) => {
  if (action.type === "app/__RESET__") {
    storageLocal.removeItem("persist:root");
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [],
});

const persistor = persistStore(store);

export { store, persistor };
