import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import template from './template';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import configureStore from './store/configureStore';
import Helmet from 'react-helmet';

const favicon = `
  <link rel="apple-touch-icon" sizes="180x180" href="${require('img/favicon/apple-touch-icon.png')}">
  <link rel="icon" type="image/png" sizes="32x32"href="${require('img/favicon/favicon-32x32.png')}">
  <link rel="icon" type="image/png" sizes="16x16" href="${require('img/favicon/favicon-16x16.png')}">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="mask-icon" href="${require('img/favicon/safari-pinned-tab.svg')}" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#603cba">
  <meta name="theme-color" content="#ffffff">
`;

const renderApp = (req: any, res: any) => {
  const store = configureStore();
  const sheet = new ServerStyleSheet();

  const root = (
    <Provider store={store}>
      <StaticRouter>
        <App />
      </StaticRouter>
    </Provider>
  );

  const html = renderToString(sheet.collectStyles(root));

  const helmet = Helmet.renderStatic();

  const meta = `
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
  `;

  const styles = sheet.getStyleTags();

  let scripts = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())};</script>`;

  if (__DEV__) {
    scripts +=
      `<script type="text/javascript" src=http://localhost:3001/client.bundle.js?rand=${Math.random()}"></script>`;
  } else {
    try {
      const assets = JSON.parse(fs.readFileSync(path.resolve('./dist/assets.json'), 'utf8'));
      scripts = `
        <script type="text/javascript" src="${assets.client.js}"></script>
        <script type="text/javascript" src="${assets.vendor.js}"></script>
      `;
    } catch (e) {
      console.log(e);
    }
  }

  res.send(template(meta, html, styles, scripts, favicon));
};

export default renderApp;
