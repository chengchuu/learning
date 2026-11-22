/*
合并两个有序链表，返回合并后的有序链表
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
https://leetcode.com/problems/merge-two-sorted-lists/solution/
*/

console.log('begin');

const aa = new LList();
;[1, 2, 4].reduce((prev, curr) => {  
  if (prev === 0) {
    aa.insert(curr, 'head');
  } else {
    aa.insert(curr, prev);
  }
  return curr;
}, 0);
aa.display();

console.log('---');

const bb = new LList();
;[1, 3, 4].reduce((prev, curr) => {  
  if (prev === 0) {
    bb.insert(curr, 'head');
  } else {
    bb.insert(curr, prev);
  }
  return curr;
}, 0);
bb.display();

const mergeTwoLists = function(l1, l2) {
  let list = new Node()
  let head = list
  
  while (l1 !== null && l2 !== null) {

  // Select the smallest value from either linked list,
  // then increment that list forward.
      if (l1.val < l2.val) {
          list.next = new Node(l1.val)
          l1 = l1.next
      } else {
          list.next = new Node(l2.val)
          l2 = l2.next
      }
      
      list = list.next
  }
  
// It's possible that one linked list is shorter than the other so we just
// add on the remainder of the last linked list. It's already sorted :)
  if (l1 !== null)
      list.next = l1
  if (l2 !== null)
      list.next = l2
  
// return .next because this first element in the linkedlist is empty
  return head.next
};

console.log('end');

// Node类
function Node (element) {
  this.element = element;
  this.next = null;
}
// LinkedList类
function LList () {
  this.head = new Node('head');
  this.find = find;
  this.insert = insert;
  this.findPrevious = findPrevious;
  this.remove = remove;
  this.display = display;
}
// 查找
function find (item) {
  let currNode = this.head;
  while (currNode.element !== item) {
      currNode = currNode.next;
  }
  return currNode;
}
// 插入
function insert (newElement, item) {
  let newNode = new Node(newElement);
  let current = this.find(item);
  newNode.next = current.next;
  current.next = newNode;
}
// 显示
function display () {
  let currNode = this.head;
  while (currNode.next !== null) {
      currNode = currNode.next;
      console.log(currNode.element);
  }
}
// 检查下一个节点
function findPrevious (item) {
  let currNode = this.head;
  while (currNode.next !== null && currNode.next.element !== item) {
      currNode = currNode.next;
  }
  return currNode;
}
// 删除
function remove (item) {
  let prevNode = this.findPrevious(item);
  if (prevNode.next !== null) {
      prevNode.next = prevNode.next.next;
  }
}