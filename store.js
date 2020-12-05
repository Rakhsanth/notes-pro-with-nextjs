import { useMemo } from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

// Redux presist related
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const initState = {};

const middleware = [thunk];

let store;

// redux-persists setup
const persistConfig = {
    key: 'root',
    storage,
    // stateReconciler: hardSet,
    autoMergeLevel2,
    // whitelist: ['auth'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(
//     persistedReducer, // rootReducer, is used if persist is not used
//     initialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// );

// export const persistor = persistStore(store);

function makeStore(initialState = initState) {
    return createStore(
        persistedReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middleware))
    );
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? makeStore(preloadedState);

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = makeStore({
            ...store.getState(),
            ...preloadedState,
        });
        // Reset the current store
        store = undefined;
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store;
    // Create the store once in the client
    if (!store) store = _store;

    return _store;
};

export function useStore(initialState) {
    const store = useMemo(() => initializeStore(initialState), [initialState]);
    return store;
}
