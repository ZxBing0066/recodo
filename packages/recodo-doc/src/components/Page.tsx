import React, { createContext, useContext, useEffect, useRef } from 'react';
import { componentWrapCls, pageCls } from './cls';
import { Hn } from './Components';

import Docs from './Docs';
import Props from './Props';
import { DocContext } from './Provider';

export const GroupContext = createContext({ name: '', subName: '' });

const Page = ({ name, reportAnchorList }: { name: string; reportAnchorList?: (anchorList: any) => void }) => {
    const { docs } = useContext(DocContext);

    const doc = docs?.[name];
    const keys = Object.keys(doc || {});
    const rootRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (!rootRef.current) return;
        const h = [
            ...rootRef.current.querySelectorAll(
                '.recodo-component-wrap>h2,.recodo-props>h3,.recodo-props>h4,.recodo-doc>h3,.recodo-doc>h4'
            )
        ];
        const group = { children: [], level: 0 };
        let pos = group;
        h.forEach(h => {
            const level = +h.tagName.replace(/^(H|h)/, '');
            if (level > pos.level) {
                const i = {
                    level,
                    text: (h as HTMLElement).innerText || h.querySelector('a')?.innerText,
                    link: (h.querySelector('.recodo-anchor') as HTMLLinkElement)?.href,
                    id: h.querySelector('.recodo-anchor')?.id,
                    children: [],
                    parent: pos,
                    h
                };
                pos.children.push(i);
                pos = i;
            } else {
                const findParent = function (level, pos) {
                    if (pos.level < level) {
                        return pos;
                    }
                    return findParent(level, pos.parent);
                };
                const parent = findParent(level, pos);
                const i = {
                    level,
                    text: (h as HTMLElement).innerText || h.querySelector('a')?.innerText,
                    link: (h.querySelector('.recodo-anchor') as HTMLLinkElement)?.href,
                    id: h.querySelector('.recodo-anchor')?.id,
                    children: [],
                    parent,
                    h
                };
                parent.children.push(i);
                pos = i;
            }
        });
        reportAnchorList?.(group);
    }, []);

    return (
        <div className={pageCls} ref={rootRef}>
            {keys.map(key => {
                return (
                    <GroupContext.Provider key={key} value={{ name: name, subName: key }}>
                        <div className={componentWrapCls}>
                            <Hn level={2}>{key}</Hn>
                            <Props name={name} subName={key} />
                            <Docs name={name} subName={key} />
                        </div>
                    </GroupContext.Provider>
                );
            })}
        </div>
    );
};

export default Page;
