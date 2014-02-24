(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    //Allow using this built library as an AMD module
    //in another project. That other project will only
    //see this AMD call, not the internal modules in
    //the closure below.
    define([], factory);
  } else {
    // Set the window.Plyfe variable with a amd property
    // to false so we can pick it up inside of the main.js
    // to determine if we were loaded via a true AMD
    // loader or not.
    root.Plyfe = { amd: false };
    //Browser globals case. Just assign the
    //result to a property on the global.
    root.Plyfe = factory();
  }
}(this, function () {
  //almond, and your modules will be inlined here
