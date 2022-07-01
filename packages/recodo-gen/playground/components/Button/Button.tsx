import React, { ReactNode, HTMLAttributes } from 'react';

var a: any = {};
console.log(a?.c);

const Button = ({
    size,
    style,
    ...rest
}: {
    /** content */
    children: ReactNode;
    /** size of the button */
    size: 'sm' | 'md' | 'lg';
} & HTMLAttributes<HTMLButtonElement>) => {
    console.log(rest?.about);
    return <button {...rest} style={{ lineHeight: { sm: 24, md: 30, lg: 36 }[size] }} />;
};

export default Button;
