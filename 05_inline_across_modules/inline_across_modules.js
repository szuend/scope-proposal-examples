
import {Logger} from './module.js';

function inner(y) {
  if (y) {
    Logger.log(y);
  }
}

function outer(z) {
  if (z) {
    inner(z);
  }
}

outer(42);
outer('hello');
outer(null);
