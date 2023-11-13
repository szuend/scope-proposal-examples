
import {Logger} from './module.js';

function inner(x) {
  Logger.log(x);
}

function outer(x) {
  inner(x);
}

outer(42);
outer(null);
