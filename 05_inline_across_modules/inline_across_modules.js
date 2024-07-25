
import {Logger} from './module.js';

function inner(y) {
  Logger.log(y);
}

function outer(z) {
  inner(z);
}

outer(42);
outer(null);
