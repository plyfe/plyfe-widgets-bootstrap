Plyfe Cards
=============

Add Plyfe's cards to your website. Cards work on mobile, tablets and the desktop.

Create
------

An easy to use no-coding-required [card builder](https://plyfe.me/cms/) is available for anyone to use to build their own cards. Embedding the cards onto your website is as easy as cutting and pasting the embed HTML code.

Examples
--------

On [plyfe.com](http://plyfe.com/) there are [examples of live cards](http://plyfe.com/showcase) that you can build using the card builder. Here is an example of the HTML code that you would put on your site to load a trivia card.

```html
<script src="//d2hlj83egq3ows.cloudfront.net/components/plyfe-widgets-bootstrap/dist/plyfe-widgets-bootstrap-v1.#.min.js"></script>
<div class="plyfe-widget" data-slot="S8d"></div>
```

Additional Data Attributes
--------------------------

Passing an external custom id through slot codes is support by adding the following,

`data-custom-id="#{custom_id}`

```html
<script src="//d2hlj83egq3ows.cloudfront.net/components/plyfe-widgets-bootstrap/dist/plyfe-widgets-bootstrap-v1.#.min.js"></script>
<div class="plyfe-widget" data-slot="S8d" data-custom-id="5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"></div>
```

An click tracker id can be passed to the cards through the slot embed code that will be ultimately sent with all external links.
Passing an external click tracker id through slot codes is support by adding the following,

`data-click-tracker-id="#{click_tracker_id}`

```html
<script src="//d2hlj83egq3ows.cloudfront.net/components/plyfe-widgets-bootstrap/dist/plyfe-widgets-bootstrap-v1.#.min.js"></script>
<div class="plyfe-widget" data-slot="S8d" data-click-tracker-id="5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"></div>
```

API
---

You can customize your embedded Plyfe card via a JavaScript API to control how they work on your site. When the bootstrap JS file is loaded there is a global `Plyfe` object that you can use.

### Initialization

By default when the bootstrap file first loads it waits until the DOM is ready then it scans for cards using CSS selector defined in `Plyfe.settings.selector.`

If you do not want cards to load automatically you can define a global initalization callback by adding a `data-init-name` to the bootstrap `<script>` tag. If you set the `data-init-name` to `"PlyfeInit"` which is a valid function name defined on `window`(e.g. `window.PlyfeInit = function() }{;`) your callback will now be responsible for loading cards.

In your custom initialization function you can change setting that you want the bootstrap JS file to use for all cards. Calling `Plyfe.createWidgets()` will scan for cards and load them.

### Settings <a id="settings"></a>

You can customize the settings the bootstrap JS will use to load cards by either editing data attributes on the `<script>` tag or by customizing settings in a custom initialization function.

You can change the CSS selector used by `createWidgets()` by changing the `Plyfe.settings.selector` setting.

#### Plyfe Object

The bootstrap JS file creates a `Plyfe` global on `window`. It has the following properties:

- `settings`: Exposes the settings object
- `createWidgets`: Creates all cards found by the `Plyfe.settings.selector`
- `createWidget`: Create one widget manually by passing in the HTML element (e.g. `Plyfe.createWidget(document.getElementById('custom-widget'));`).
- `onCardStart`: Callback function that is called with `card` and `user` objects each time a user first interacts with a card.
- `onCardComplete`: Callback function that is called with `card` and `user` objects each time a user completes a card.
- `onChoiceSelection`: Callback function that is called with `card`, `user` and `choice` objects each time a user selects a choice when interacting with a card.
