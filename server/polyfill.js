import { Buffer } from 'node:buffer';

// Polyfill SlowBuffer for Node 20+ compatibility
// Fixes 'TypeError: Cannot read properties of undefined (reading 'prototype')' in buffer-equal-constant-time
if (typeof global.SlowBuffer === 'undefined') {
    global.SlowBuffer = Buffer;
}

if (global.SlowBuffer && !global.SlowBuffer.prototype.equal && global.SlowBuffer.prototype.equals) {
    global.SlowBuffer.prototype.equal = global.SlowBuffer.prototype.equals;
}
