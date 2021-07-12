import React from 'react';
import examples from 'recodo-gen/recodo-gen-output/examples.json';
import docs from 'recodo-gen/recodo-gen-output/docs.json';

import '../src/index.scss';
import { Provider, Page } from '../src/';

const getRemoteUrl = (codePath, componentName) => {
    return `https://raw.githubusercontent.com/UCloud-FE/react-components/master/src/components/${componentName}/__demo__/${codePath}`;
};

const App = ({ name, scope }: { name: string; scope: any }) => {
    return (
        <Provider content={{ examples, docs }} getRemoteUrl={getRemoteUrl} scope={{ React, ...scope }}>
            <Page name={name} />
        </Provider>
    );
};

export default App;
