import mod from '@rapiop/mod';
import rawResolver from '@rapiop/mod/lib/resolver/raw';

mod.registerModuleResolver(rawResolver);

export default mod;
