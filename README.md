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
<script src="//d2hlj83egq3ows.cloudfront.net/components/plyfe-widgets-bootstrap/dist/plyfe-widgets-bootstrap-v1.1.min.js"></script>
<div class="plyfe-widget" data-slot="S8d"></div>
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

The following is the list of settings defined in `Plyfe.settings`.

- `scheme`: The HTTP scheme to use when constructing the slot URL to plyfe.me. (**default** `'https'`)
- `env`: The environment to point to. See the (environment.js)[https://github.com/plyfe/plyfe-widgets-bootstrap/blob/master/src/env.js] file for the list of valid environments. (**default** `'production'`)
- `domain`: Override for domain specified by `env`. (**default**: `'plyfe.me'`)
- `port`: Override for port specified by `env`. (**default**: `'443'`)
- `authToken`: A valid auth token returned by the OAuth call to plyfe.me. Used for Single Sign On. (**default** `null`)
- `selector`: The CSS Selector to use to find cards. (**default**: `'.plyfe-widget'`)
- `theme`: The default theme to use for all cards. (**DEPRECATED! default** `null`)

#### Data attributes

Settings can also be defined by adding data attributues to the bootstrap JS `<script>` tag.

- data-auth-token
- data-scheme
- data-env
- data-domain
- data-port
- data-theme

#### Plyfe Object

The bootstrap JS file creates a `Plyfe` global on `window`. It has the following properties:

- `settings`: Exposes the settings object
- `createWidgets`: Creates all cards found by the `Plyfe.settings.selector`
- `createWidget`: Create one widget manually by passing in the HTML element (e.g. `Plyfe.createWidget(document.getElementById('custom-widget'));`).
- `logIn`: Complete the single signon process by authenticating the `authToken`.
- `onCardStart`: Callback function that is called with `card` and `user` objects each time a user first interacts with a card.
- `onCardComple`: Callback function that is called with `card` and `user` objects each time a user completes a card.
