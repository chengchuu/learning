const { SinglyList } = require('./LinkedList.js');

const newLL = new SinglyList();

newLL.insertLast('a');
newLL.insertLast('b');
newLL.insertLast('c');
newLL.insertLast('d');
newLL.insertLast('e');

function reverseLinkedList (head) {
  let previous = null;
  let current = head;

  while (current) {
    let nextNode = current.next;
    current.next = previous;

    previous = current;
    current = nextNode;
  }

  return previous;
}

let reversedHead = reverseLinkedList(newLL.head);

while (reversedHead) {
  console.log('reversedLL', reversedHead.data);
  reversedHead = reversedHead.next;
}

console.log('------------')

const rNewLL = new SinglyList();

rNewLL.insertLast('a');
rNewLL.insertLast('b');
rNewLL.insertLast('c');
rNewLL.insertLast('d');
rNewLL.insertLast('e');

function reverseLinkedListRecursively(head) {
  if (!head || !head.next) {
    return head;
  }

  let reversedHead = reverseLinkedListRecursively(head.next);

  head.next.next = head;
  head.next = null;

  return reversedHead;
}

let rReversedHead = reverseLinkedListRecursively(rNewLL.head);

while (rReversedHead) {
  console.log('rReversedHead', rReversedHead.data);
  rReversedHead = rReversedHead.next;
}
