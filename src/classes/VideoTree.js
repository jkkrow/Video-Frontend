class VideoNode {
  constructor(file) {
    this.file = file;
    this.children = [];
  }
}

class VideoTree {
  constructor(file) {
    this.root = new VideoNode(file);
  }

  find(name) {
    let currentNode = this.root;
    let queue = [];

    queue.push(currentNode);

    while (queue.length > 0) {
      currentNode = queue.shift();

      if (currentNode.file.name === name) return currentNode;

      if (currentNode.children.length)
        currentNode.children.forEach((child) => queue.push(child));
    }

    return null;
  }

  append(file, parentNode) {
    const parent = this.find(parentNode.name);

    if (!parent) return null;

    const newNode = new VideoNode(file);

    parent.children = [...parent.children, newNode];
  }

  change(currentFile, newFile) {
    const targetNode = this.find(currentFile.name);

    if (!targetNode) return null;

    targetNode.file = newFile;
  }
}

export default VideoTree;
