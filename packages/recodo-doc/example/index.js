import React from 'react';
import ReactDOM from 'react-dom';
import mod from '@rapiop/mod';
import amdResolver from '@rapiop/mod/lib/resolver/amd';
import { moduleMap } from '@rapiop/mod/lib/module';

import './index.css';
import App from './App';

window.__recodo_module_namespace__ = moduleMap;

mod.registerModuleResolver(amdResolver);

mod.export('react', React);
mod.export('react-dom', ReactDOM);

mod.config({
    modules: {
        '@ucloud-fe/react-components': {
            js: 'https://cdn.jsdelivr.net/npm/@ucloud-fe/react-components@1.1.6/dist/main.min.js',
            type: 'amd',
            dep: ['moment', 'react', 'react-dom']
        },
        moment: {
            js: 'https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js',
            type: 'amd'
        },
        lodash: {
            js: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
            type: 'amd'
        },
        'prop-types': { js: 'https://cdn.jsdelivr.net/npm/prop-types@15.7.2/prop-types.min.js', type: 'amd' },
        react: { js: [] },
        'react-dom': { js: [] }
    }
});

const renderDoc = (name, dom) => {
    mod.import(['@ucloud-fe/react-components', 'moment', 'lodash', 'prop-types']).then(dependences => {
        const [components, moment, lodash, PropTypes] = dependences;
        console.log(App);
        ReactDOM.render(
            <App
                name={name}
                scope={{ ...components, components, moment, lodash, React, ReactDOM, PropTypes, _: lodash }}
            />,
            dom
        );
    });
};

renderDoc('AutoComplete', document.getElementById('app'));
