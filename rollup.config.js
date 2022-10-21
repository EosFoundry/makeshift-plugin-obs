import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'makeshiftctrl-obs.js',
  output: {
    file: './makeshiftctrl-obs.mkshftpb.js',
    format: 'module'
  },
  plugins: [
    nodeResolve({
      exportConditions: ['node']
    }),
    commonjs()
  ]
};