import java.util.Scanner;

public class ExpressionTreeConverter {
    private Node root = null;

    public ExpressionTreeConverter(String postfix) {
        this.root = this.convert(postfix);
    }
    
    public Node convert(String postfix) {
        ArrayStack<Node> expression_stack = new ArrayStack<Node>();
        String[] postfix_split = postfix.split(" ");

        for (int i=0; i < postfix_split.length; i++) {
            if (isOperator(postfix_split[i])) {
                Node rightchild = expression_stack.pop();
                Node leftchild = expression_stack.pop();
                Node node = new Node(postfix_split[i], leftchild, rightchild);

                expression_stack.push(node);
            }
            else {
                Node numberNode = new Node(postfix_split[i]);
                expression_stack.push(numberNode);
            }
        }
        return expression_stack.pop();
    }
    public String prefix() {
        return prefix(root);
    }
    private String prefix(Node n) {
        if (n == null) {
            return "";
        }
        return n.toString() + prefix(n.leftChild) + prefix(n.rightChild);
    }
    public String infix() {
        return infix(root);
    }
    private String infix(Node n) {
        if (n == null) {
            return "";
        }
        String infix_expression = "";
        if (isOperator(n.toString())) {
            infix_expression += "(";
        }
        infix_expression += infix(n.leftChild);
        infix_expression += n.toString();
        infix_expression += infix(n.rightChild);
        if (isOperator(n.toString())) {
            infix_expression += ")";
        }
        return infix_expression;
    }
    public String postfix() {
        return postfix(root);
    }
    private String postfix(Node n) {
        if (n == null) {
            return "";
        }
        return postfix(n.leftChild) + postfix(n.rightChild) + n.toString();
    }

    public boolean isOperator(String op) {
        return op.equals("+") || op.equals("-") || op.equals("*") || op.equals("/") || op.equals("^");
    }

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("Type your expression:");
        String expression = input.nextLine();

        Converter converter = new Converter(expression);
        ExpressionTreeConverter expressiontree = new ExpressionTreeConverter(converter.toPostFix());

        System.out.println(expressiontree.prefix());
        System.out.println(expressiontree.infix());
        System.out.println(expressiontree.postfix());
    }
}