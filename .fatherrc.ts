import { IBundleOptions } from 'father-build/src/types';
import { readdirSync } from 'fs';
import { join } from 'path';

// utils must build ahead
// runtime must build before renderer-react
const headPkgs = ['shared-utils'];
const noBuildPkgs = []; //暂时不需要fatherbuild
const nromalPkgs = readdirSync(join(__dirname, 'packages')).filter(
  (pkg) => pkg.charAt(0) !== '.' && !headPkgs.includes(pkg) && !noBuildPkgs.includes(pkg)
);

const options: IBundleOptions = {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  pkgs: [...headPkgs, ...nromalPkgs],
  runtimeHelpers: true,
  extraBabelPlugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]]
};

export default options;
