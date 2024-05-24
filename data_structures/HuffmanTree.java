public class HuffmanTree {
    HuffmanNode root;

    public HuffmanTree(HuffmanNode huff) {
        this.root = huff;
    }

    public void printLegend() {
        printLegend(root, "");
    }

    private void printLegend(HuffmanNode t, String s) {
        if (t.letter.length() > 1) {
            printLegend(t.left, (s+"0")); 
            printLegend(t.right, (s+"1"));
        }

        else {
            System.out.println(t.letter + "=" + s);
        }
    }

    public static BinaryHeap<HuffmanNode> legendToHeap(String legend) {
        String[] legend_arr = legend.split(" ");
        HuffmanNode[] huff_arr = new HuffmanNode[legend_arr.length/2];

        for (int i = 0; i < legend_arr.length; i += 2) {
            HuffmanNode huff = new HuffmanNode(legend_arr[i], Double.parseDouble(legend_arr[i+1]));
            huff_arr[i/2] = huff;
        }

        BinaryHeap<HuffmanNode> bheap = new BinaryHeap(huff_arr);
        return bheap;
    }

    public static HuffmanTree createFromHeap(BinaryHeap<HuffmanNode> b) {
        while (b.getSize() > 1) {
            HuffmanNode leftmin = b.deleteMin();
            HuffmanNode rightmin = b.deleteMin();

            HuffmanNode sub = new HuffmanNode(leftmin, rightmin);
            b.insert(sub);
        }

        HuffmanTree htree = new HuffmanTree(b.deleteMin());
        return htree;
    }

    public static void main(String[] args) {
        String legend = "A 20 E 24 G 3 H 4 I 17 L 6 N 5 O 10 S 8 V 1 W 2";
        BinaryHeap<HuffmanNode> bheap = legendToHeap(legend);
        
        bheap.printHeap();

        HuffmanTree hTree = createFromHeap(bheap);

        hTree.printLegend();
    }
}