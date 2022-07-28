import { transform } from 'recodo-compiler';

export const _poly = { assign: Object.assign };

const opts = {
    objectAssign: '_poly.assign',
    transforms: {
        dangerousForOf: true,
        dangerousTaggedTemplateString: true,
        asyncAwait: false
    }
};

export default (code: string) => transform(code, opts).code;
