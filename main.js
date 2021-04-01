var nodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT),
    text,
    node,
    find = /the/gi,
    replace = "THE";

while (nodes.nextNode()) {
    node = nodes.currentNode;
    text = node.nodeValue;
    node.nodeValue = text.replace(find, replace);
}
