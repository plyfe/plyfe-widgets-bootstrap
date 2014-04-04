Plyfe Widgets
=============

Add Plyfe's widgets to your website. Widgets work on mobile, tablets and the
desktop.

How-To
------

To include Plyfe's widgets on your web page first include the `<script>` tag on your page.

```html
<script src="//d2hlj83egq3ows.cloudfront.net/system/production/assets/plyfe-widgets.js"></script>
```

The script will execute and look for tags on the page that have a 'plyfe-widget' class on them. Add the following where ever you want the widgets to show up.

```html
<div class="plyfe-widget"
  data-venue="[venue_id]"
  data-type="[widget_type_abbriviation]"
  data-id="[widget_id]">
</div>
```

Use Plyfe's widget building tool to help with the creation of the HTML.
