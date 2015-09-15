# nodelegend

Creates dat.gui legend to change ngraph.pixel nodes.

# usage

``` js
var renderGraph = require('ngraph.pixel');
var createSetings = require('config.pixel');
var createLegend = require('nodelegend');

var renderer = renderGraph(graph);
var settings = createSettings(renderer);

// add a new group called "Groups", with two colors:
createLegend(settings, 'Groups', [{
  name: 'First',
  color: 0xff0000,
  filter: function(node) {
    return node.id <= 50;
  }
}, {
  name: 'Second',
  color: 0x00ff00,
  filter: function(node) {
    return node.id > 50;
  }
}]);
```


# install

With [npm](https://npmjs.org) do:

```
npm install nodelegend
```

# acknowledgement

Thanks for the awesome ngraph library by @anvaka!

# license

MIT
