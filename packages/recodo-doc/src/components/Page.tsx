import React, { useContext } from 'react';

import Docs from './Docs';
import Props from './Props';
import { DocContext } from './Provider';

const Page = ({ name }: { name: string }) => {
    const { docs } = useContext(DocContext);

    const doc = docs?.[name];
    const keys = Object.keys(doc || {});

    return (
        <>
            {keys.map(key => {
                return (
                    <>
                        <Props name={name} subName={key} />
                        <Docs name={name} subName={key} />
                    </>
                );
            })}
        </>
    );
};

export default Page;
