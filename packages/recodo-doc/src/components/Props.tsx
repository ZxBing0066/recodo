import React, { useContext } from 'react';

import { DocContext } from './Provider';

const Props = ({ name, subName }: { name: string; subName?: string }) => {
    const { examples } = useContext(DocContext);

    const info = examples?.[name]?.[subName || name]?.info;
    const props = info?.props;

    console.log(props);

    return (
        <div>
            <h2>props</h2>
        </div>
    );
};

export default Props;
