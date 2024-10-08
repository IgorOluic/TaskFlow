import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appReducer from './app/appSlice';
import authReducer from './auth/authSlice';
import projectsReducer from './projects/projectsSlice';
import columnsReducer from './columns/columnsSlice';
import tasksReducer from './tasks/tasksSlice';
import invitationsReducer from './invitations/invitationsSlice';
import membersReducer from './members/membersSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: persistedReducer,
    projects: projectsReducer,
    columns: columnsReducer,
    tasks: tasksReducer,
    invitations: invitationsReducer,
    members: membersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
