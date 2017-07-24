import load from 'load-script';

let reference;
let stack = [];

export function wrapper (ctx) {
  if (reference) ctx(reference);
  else stack.push(ctx);
}

load('https://js.recurly.com/v4/recurly.js', err => {
  if (err) return console.error(err);
  reference = global.recurly;
  stack.forEach(ctx => ctx(reference));
});