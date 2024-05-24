import java.util.Scanner;

public class PostfixCalculator {
    String postfix;

    public PostfixCalculator(String s) {
        this.postfix = new Converter(s).toPostFix();
    }

    public double calculate() {
        ArrayStack<Double> numberstack = new ArrayStack<Double>();
        double number = 0;
        String[] postfix_split = postfix.split(" ");

        for (String val : postfix_split) {

            if (val.equals("+")) {
                number = numberstack.pop() + numberstack.pop();
                numberstack.push(number);
            }
            else if (val.equals("-")) {
                double sub = numberstack.pop();
                if (sub < numberstack.top()) {
                    number = numberstack.pop() - sub;
                }
                else {
                    number = numberstack.pop() - numberstack.pop();
                }
                numberstack.push(number);
            }
            else if (val.equals("*")) {
                number = numberstack.pop() * numberstack.pop();
                numberstack.push(number);
            }
            else if (val.equals("/")) {
                double divisor = numberstack.pop();
                if (divisor < numberstack.top()) {
                    number = numberstack.pop() / divisor;
                }
                else {
                    number = numberstack.pop() / numberstack.pop();
                }
                numberstack.push(number);
            }
            else if (val.equals("^")) {
                double exponent = numberstack.pop();
                number = Math.pow(numberstack.pop(), exponent);
                numberstack.push(number);
            }
            else {
                double num = Double.parseDouble(val);
                numberstack.push(num);
            }
        }
        number = numberstack.pop();
        return number;
    }

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("Enter an expression: ");
        String expression = input.nextLine();

        PostfixCalculator pfcalc = new PostfixCalculator(expression);
        System.out.println(pfcalc.postfix);
        System.out.println(pfcalc.calculate());
    }
}