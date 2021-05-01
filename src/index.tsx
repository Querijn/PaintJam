import React from 'react';
import ReactDOM from 'react-dom';

import {RecoilRoot} from 'recoil';

import App from './App';

import 'css-reset-and-normalize/css/button-reset.min.css';
import 'css-reset-and-normalize/css/link-reset.min.css';
import 'css-reset-and-normalize/css/reset-and-normalize.min.css';

import './stylesheets/index.sass';

ReactDOM.render(
    <React.StrictMode>
      <RecoilRoot>
        <App/>
      </RecoilRoot>
    </React.StrictMode>,
    document.getElementById('root'),
);
