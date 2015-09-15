module.exports = createLegend;

function createLegend(allSettings, folderName, legend) {
  var renderer = allSettings.renderer();
  var gui = allSettings.gui();
  var group = gui.addFolder(folderName);
  var model = Object.create(null);
  var hiddenLinks = Object.create(null);
  var hiddenNodes = Object.create(null);

  for (var i = 0; i < legend.length; ++i) {
    var item = legend[i];
    model[item.name] = item.color;
    hiddenLinks[item.name] = [];
    hiddenNodes[item.name] = [];
    group.addColor(model, item.name)
      .onChange(colorNodes)
      .name(toggle(item.name));
  }

  group.open();

  listToToggleEvents();
  colorNodes();

  function listToToggleEvents() {
    var checkboxes = group.domElement.querySelectorAll('input.toggle');

    for (var i = 0; i < checkboxes.length; ++i) {
      checkboxes[i].addEventListener('change', handleChange, false);
    }

    function handleChange(e) {
      e.preventDefault();
      e.stopPropagation();

      if (this.checked) {
        showGroup(this.id);
      } else {
        hideGroup(this.id);
      }
    }
  }

  function colorNodes() {
    var graph = renderer.graph();
    graph.forEachNode(colorNode);
    renderer.focus();

    function colorNode(node) {
      for (var i = 0; i < legend.length; ++i) {
        var item = legend[i];
        if (!item.filter(node)) continue;
        renderer.nodeColor(node.id, model[item.name]);
      }
    }
  }

  function showGroup(groupName) {
    var links = hiddenLinks[groupName];
    var nodes = hiddenNodes[groupName];
    if (!links) return;
    if (!nodes) return;
    var graph = renderer.graph();
    graph.beginUpdate();

    // Add back the nodes
    for (var i = 0; i < nodes.length; ++i) {
      graph.addNode(nodes[i].id, nodes[i].data);
    }

    // Add back the links
    for (var i = 0; i < links.length; ++i) {
      var link = links[i];
      graph.addLink(link.fromId, link.toId, link.data);
    }
    graph.endUpdate();

    links.splice(0, links.length);
    nodes.splice(0, nodes.length);
    colorNodes();
  }

  function hideGroup(groupName) {
    var links = hiddenLinks[groupName];
    var nodes = hiddenNodes[groupName];
    if (!links && !nodes) return;
    var legendItem = getLegendItemByName(groupName);
    if (!legendItem) return;

    var graph = renderer.graph();
    graph.forEachNode(noteLinksAndNodesToRemove);

    graph.beginUpdate();
    for (var i = 0; i < links.length; ++i) {
      graph.removeLink(links[i]);
    }
    for (var i = 0; i < nodes.length; ++i) {
      graph.removeNode(nodes[i].id);
    }
    graph.endUpdate();

    colorNodes();

    function noteLinksAndNodesToRemove(node) {
      if (legendItem.filter(node)) {
        nodes.push(node);
        var tmp_links = graph.getLinks(node.id);
        for (var i = 0; i < tmp_links.length; i++) {
          links.push(tmp_links[i]);
        }
      }
    }
  }

  function getLegendItemByName(name) {
    for (var i = 0; i < legend.length; ++i) {
      if (legend[i].name === name) return legend[i];
    }
  }

  function toggle(name) {
    return [
      '<span style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">',
      '<input type="checkbox" name="checkbox" id="' + name + '" class="toggle" value="value" checked>',
      '<label for="' + name + '">' + name + '</label>',
      '</span>'
    ].join('\n');
  }
}
