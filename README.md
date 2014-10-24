Plyfe Widgets
=============

Add Plyfe's widgets to your website. Widgets work on mobile, tablets and the
desktop.

How-To
------

To include Plyfe's widgets on your web page first include the `<script>` tag on your page.

```html
<script src="//d2hlj83egq3ows.cloudfront.net/components/plyfe-widgets-bootstrap/dist/plyfe-widgets-bootstrap-v0.min.js"></script>
```

The script will execute and look for tags on the page that have a 'plyfe-widget' class on them. Add the following where ever you want the widgets to show up.

```html
<div class="plyfe-widget" data-slot="[slot_id]"></div>
```

Old Style Widgets
-----------------

The old style of specifying widets looked like this:
```html
<div class="plyfe-widget"
  data-type="[widget_type_abbreviation]"
  data-id="[widget_id]">
</div>
```

Don't use this style anymore. Instead use the new system based on slots.

Plyfe CMS
---------

Use [Plyfe's CMS](https://plyfe.me/cms/) to help with the creation of the HTML.
