import { HttpsAgent } from 'agentkeepalive';
import axios from 'axios';
import { applyMiddleware, compose, createStore } from 'redux';
import { default as thunk } from 'redux-thunk';
import rootReducer from '../reducers';

const keepaliveHttpsAgent = new HttpsAgent({
  freeSocketTimeout: 15000,
  maxFreeSockets: 256,
  maxSockets: 512,
  timeout: 15000,
});

export default function() {
  const state = __WEB__ ? { ...window.__INITIAL_STATE__ } : {};

  const http = axios.create({
    baseURL: 'https://api.rasp.yandex.net/v3.0/',
    timeout: 15000,
    httpsAgent: keepaliveHttpsAgent,
  });

  const middlewares = [thunk.withExtraArgument(http)];

  let enhancer;

  if (__DEV__) {
    const composeEnhancers = (!__SERVER__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    enhancer = composeEnhancers(applyMiddleware(...middlewares));
  } else {
    enhancer = applyMiddleware(...middlewares);
  }

  const store = createStore(rootReducer, state, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default));
  }

  return store;
}
