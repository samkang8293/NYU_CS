import java.util.Scanner;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class HuffmanConverter {
    public static final int NUMBER_OF_CHARACTERS = 256;
    
    private String contents;
    private HuffmanTree huffmanTree;
    private int count[];
    private String code[];

    public HuffmanConverter(String input) {
        this.contents = input;
        this.count = new int[NUMBER_OF_CHARACTERS];
        this.code = new String[NUMBER_OF_CHARACTERS];
    }

    public void recordFrequencies() {
        for (int i = 0; i < contents.length(); i++) {
            count[(int) contents.charAt(i)]++;
        }
    }

    public void frequenciesToTree() {
        ArrayList<HuffmanNode> huff_list = new ArrayList<HuffmanNode>();
        
        for (int i = 0; i < this.count.length; i++) {
            if (!(this.count[i] == 0)) {
                HuffmanNode temp = new HuffmanNode("" + (char) i, (double) count[i]);
                huff_list.add(temp);
            }
        }

        HuffmanNode[] huffman_arr = new HuffmanNode[huff_list.size()];
        for (int j = 0; j < huff_list.size(); j++) {
            huffman_arr[j] = huff_list.get(j);
        }

        BinaryHeap<HuffmanNode> bh = new BinaryHeap<HuffmanNode>(huffman_arr);
        System.out.println("Initial Heap Values: ");
        bh.printHeap();

        System.out.println();

        this.huffmanTree = HuffmanTree.createFromHeap(bh);
        System.out.println("HuffmanTree legend from the initial heap: ");
        huffmanTree.printLegend();
    }

    public void treeToCode() {
        treeToCode(huffmanTree.root,"");
    }

    private void treeToCode(HuffmanNode t, String s) {
        if (t.letter.length() > 1) {
            treeToCode(t.left, s+"1");
            treeToCode(t.right, s+"0");
        }
        else if (t.letter.length() == 1) {
            code[(int) t.letter.charAt(0)] = s;
        }
    }

    public String encodeMessage() {
        String str = "";
        for (int i = 0; i < contents.length(); i++) {
            str += code[(int) contents.charAt(i)];
        }
        return str;
    }

    public static String readContents(String filename) throws IOException {
        File myfile = new File(filename);
        Scanner scan = new Scanner(myfile);
        StringBuilder sb = new StringBuilder();

        while (scan.hasNextLine()) {
            sb.append(scan.nextLine());
            sb.append("\n");
        }
        scan.close();

        return sb.toString();
    }

    public String decodeMessage(String encodedStr) {
        String message = "";
        int index = 0;

        for (int i = 1; i < encodedStr.length(); i++) {
            String sub = encodedStr.substring(index, i);
            HuffmanNode hnode = this.huffmanTree.root;

            for (int j=0; j < sub.length(); j++) {
                if (sub.charAt(j) == '1') {
                    hnode = hnode.left;
                }
                else if (sub.charAt(j) == '0') {
                    hnode = hnode.right;
                }
            }

            if (hnode.left == null && hnode.right == null) {
                message += hnode.letter;
                index = i;
            }
        }
        return message;
    }

    public static void main(String args[]) throws IOException{
        HuffmanConverter converter = new HuffmanConverter(readContents(args[0]));
        converter.recordFrequencies();
        converter.frequenciesToTree();
        
        System.out.println();

        converter.treeToCode();

        String huffman_encoding = converter.encodeMessage();
        System.out.println("Huffman Encoding: \n" + huffman_encoding + "\n");
        System.out.println("Message size in ASCII encoding: " + converter.contents.length()*8);
        System.out.println("Message size in Huffman encoding: " + huffman_encoding.length());
        System.out.println("");

        String output = converter.decodeMessage(huffman_encoding);
        System.out.println("Decoded message: \n" + output);
    }
}