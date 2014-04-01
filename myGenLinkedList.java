public class myGenLinkedList<T> {

	private Node  head,tail;
	private int  size;

	myGenLinkedList(){
		head = null;
		tail = null;
		size =0;
	}

	/**
	 * Appends the specified element to the end of this list
	 * @param obj 
	 */
	public void add(T obj){
		Node temp = new Node(obj);
		if (head == null) {
			head = temp;
		}
		else {
			Node cur = head;
			Node pre = null;
			while (cur.next!=null){
				pre = cur;
				cur=cur.next;
			}
			cur.next = temp;
		}
	}

	/**
	 * Inserts the specified element at the specified position in this list.
	 * @param obj 
	 */
	public void add(T obj,int index){
		if (index <0 || index < getSize()) {
			add(obj);
		}
		else{
			Node temp = new Node(obj);
			int counter =-1;
			Node cur = head;
			Node pre = null;
			while (counter<index){
				pre = cur;
				cur=cur.next;
			}
			pre.next = temp;
			temp.next = cur;

		}
	}
	/**
	 * Removes all of the elements from this list.
	 */
	public void clear(){
		head = null;
	}
	/**
	 * Returns true	if this list contains the specified element.
	 * @param obj
	 * @return
	 */
	public boolean contains(T obj){

	}

	/**
	 *Returns the number of elements in this list.
	 * @return
	 */
	public int getSize(){
		Node cur = head;
		int ans =0;
		while(cur.next != null) { ans++;}
		return ans;
	}

	private class Node<T>{

		T data;
		Node next,prev;

		Node(){
			data=null;
			next =null;
			prev = null;
		}

		Node(T obj){
			data=obj;
			next =null;
			prev = null;
		}

		public Node getNext() { return next;}
		public Node getPrev() {return prev;}
		public T getData(){ return data;}
		public String toString(){
			return "" + data;
		}
	}

}
