export const findById = (tree, id) => {
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

export const findByChildId = (tree, id) => {
  let currentNode = tree.root;
  let queue = [];

  queue.push(currentNode);

  while (queue.length > 0) {
    currentNode = queue.shift();

    if (currentNode.children.find((item) => item?.id === id)) return currentNode;

    if (currentNode.children.length)
      currentNode.children.forEach((child) => queue.push(child));
  }

  return null;
};
