import mod from '@rapiop/mod';
import rawResolver from '@rapiop/mod/lib/resolver/raw';
import amdResolver from '@rapiop/mod/lib/resolver/amd';

mod.registerModuleResolver(rawResolver);
mod.registerModuleResolver(amdResolver);

export default mod;
