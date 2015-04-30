(function (root, factory) {
  // Protect against the case of multiple <script> tags on a page.
  if(root.Plyfe) { return; }

  //Browser globals case. Just assign the result to a property on the global.
  root.Plyfe = factory();
}(this, function () {
  // almond, and your modules will be inlined here
