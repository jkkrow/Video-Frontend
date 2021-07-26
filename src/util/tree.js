export const findNode = (tree, id) => {
  let currentNode = tree.root;
  let queue = [];

  queue.push(currentNode);

  while (queue.length > 0) {
    currentNode = queue.shift();

    if (currentNode.id === id) return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};
