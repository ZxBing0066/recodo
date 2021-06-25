import React from 'react';

import examples from 'recodo-gen/recodo-gen-output/examples.json';
import docs from 'recodo-gen/recodo-gen-output/docs.json';

import Provider from '../src/components/Provider';
import Page from '../src/components/Page';

const getRemoteUrl = (codePath, componentName) => {
    return `https://raw.githubusercontent.com/UCloud-FE/react-components/master/src/components/${componentName}/__demo__/${codePath}`;
};
export default () => {
    return (
        <Provider content={{ examples, docs }} getRemoteUrl={getRemoteUrl}>
            <Page name={'Box'} />
        </Provider>
    );
};
