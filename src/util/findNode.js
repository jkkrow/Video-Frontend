export const findNode = (tree, node) => {
  let currentNode = tree.root;
  let queue = [];

  queue.push(currentNode);

  while (queue.length > 0) {
    currentNode = queue.shift();

    if (
      currentNode.info.name === node.file.name &&
      currentNode.info.layer === node.layer &&
      currentNode.info.optionTitle === node.optionTitle
    )
      return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};
