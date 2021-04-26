class Node {
  constructor(name) {
    this.name = name;
    this.next = [];
  }
}

class VideoTree {
  constructor(name) {
    this.root = new Node(name);
  }

  find(name) {
    let currentNode = this.root;
    let queue = [];

    queue.push(currentNode);

    while (queue.length > 0) {
      currentNode = queue.shift();

      if (currentNode.name === name) return currentNode;

      if (currentNode.next.length)
        currentNode.next.forEach((child) => queue.push(child));
    }

    return null;
  }

  append(name, parentName) {
    const parentNode = this.find(parentName);

    if (!parentNode) return null;

    const newNode = new Node(name);

    parentNode.next.push(newNode);
  }

  change(name, newName) {
    const targetNode = this.find(name);

    if (!targetNode) return null;

    targetNode.name = newName;
  }
}

export default VideoTree;
