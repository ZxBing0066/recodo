import React, { useContext } from 'react';
import { pageCls } from './cls';

import Docs from './Docs';
import Props from './Props';
import { DocContext } from './Provider';

const Page = ({ name }: { name: string }) => {
    const { docs } = useContext(DocContext);

    const doc = docs?.[name];
    const keys = Object.keys(doc || {});

    return (
        <div className={pageCls}>
            {keys.map(key => {
                return (
                    <div key={key}>
                        <Props name={name} subName={key} />
                        <Docs name={name} subName={key} />
                    </div>
                );
            })}
        </div>
    );
};

export default Page;
