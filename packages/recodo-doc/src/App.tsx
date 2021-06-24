import React from 'react';

import examples from 'recodo-gen/recodo-gen-output/examples.json';
import docs from 'recodo-gen/recodo-gen-output/docs.json';

import Provider from './components/Provider';
import Page from './components/Page';

export default () => {
    return (
        <Provider content={{ examples, docs }}>
            <Page name={'Box'} />
        </Provider>
    );
};
