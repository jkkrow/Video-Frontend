class Node {
  constructor(name) {
    this.name = name;
    this.next = [];
  }
}

class VideoTree {
  constructor(name) {
    this.name = name;
    this.next = [];
  }

  findByName = (name) => {
    while (true) {
      if (this.name === name) break;

      this.next.find((node) => node.name === name);
    }
  };

  addNext = (name) => {
    const newNode = new Node(name);

    this.next.push(newNode);
  };
}

const tree = {
  name: "file_1",
  next: [
    {
      name: "file_2",
      next: [],
    },
    {
      name: "file_3",
      next: [],
    },
  ],
};
