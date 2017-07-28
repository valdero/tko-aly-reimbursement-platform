//import './css/fonts.css';
import 'normalize.css';
//import './css/common.css';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Router, browserHistory } from 'react-router';

//import { customPage } from './actions';
//import { state$, RxStateProvider } from 'client/state';
//import { routes } from 'client/routes';
import { getWindow, getDocument } from 'common/util';

const win = getWindow();
const doc = getDocument();

if (win === undefined || doc === undefined) {
    throw new Error('This file is client-side only, document needs to be defined!');
}

const scrollToTop = () => {
    win.scrollTo(0, 0);
};

const App = (
    <div>
        Hello World!
    </div>
);

ReactDom.render(
    App,
    doc.getElementById('app'),
);
