import java.util.List;
import java.util.ArrayList;

public class Converter {
    String infix;

    public Converter(String s) {
        this.infix = s;
    }

    // from ParserHelper
    public static List<String> parse(char[] input) {
	    List<String> parsed = new ArrayList<String>();
	    for (int i = 0; i < input.length; ++i) {
	        char c = input[i];
	        if (Character.isDigit(c)) {
	            String number = input[i] + "";
	            for (int j = i + 1; j < input.length; ++j) {
	                if (Character.isDigit(input[j])) {
	                    number += input[j];
	                    i = j;
	                } else {
	                    break;
	                }
	            }
	            parsed.add(number);
	        } else if (c == '*' || c == '/' || 
	                   c == '+' || c == '^' || 
	                   c == '-' || c == '(' || c == ')') {
	            parsed.add(c + "");
	        }
	    }
	    return parsed;
	}

    public String toPostFix() {
        ArrayStack<String> postfix_stack = new ArrayStack<String>();
        String postfix = "";
        char[] token = new char[infix.length()];

        for (int i = 0; i < token.length; i++) {
            char reader = infix.charAt(i);
            token[i] = reader;
        }

        List<String> parsed = parse(token);

        for (String val : parsed) {
            if (val.equals("(")) {
                postfix_stack.push(val);
            }
            else if (val.equals(")")) {
                while (!postfix_stack.isEmpty() && !postfix_stack.top().equals("(")) {
                    postfix += postfix_stack.pop() + " ";
                }
                postfix_stack.pop();
            }
            else if (val.equals("+") || val.equals("-") || val.equals("*") || val.equals("/") || val.equals("^")) {
                while (!postfix_stack.isEmpty() && precedence(val) <= precedence(postfix_stack.top())) {
                    postfix += postfix_stack.pop() + " ";
                }
                postfix_stack.push(val);
            }
            else {
                postfix += val + " ";
            }
        }
        while (!postfix_stack.isEmpty()) {
            postfix += postfix_stack.pop() + " ";
        }
        return postfix;
    }

    public static int precedence(String op) {
        switch(op) {
            case "+":
                return 1;
            case "-":
                return 1;
            case "*":
                return 2;
            case "/":
                return 2;
            case "^":
                return 3;
        }
        return 0;
    }
}