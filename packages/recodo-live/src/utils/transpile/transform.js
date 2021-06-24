import { transform as _transform } from 'recodo-compiler';

export const _poly = { assign: Object.assign };

const opts = {
    objectAssign: '_poly.assign',
    transforms: {
        dangerousForOf: true,
        dangerousTaggedTemplateString: true
    }
};

export default code => _transform(code, opts).code;
