public class RecursionPractice {

    public static String reverse(String s) {
        // base case: s.length() = 1, return s
        if (s.length()==1) {
            return s;
        }
        return reverse(s.substring(1,s.length())) + s.charAt(0);
    }

    public static void main(String[] args) {
        String abcd = "ABCD";
        System.out.println(reverse(abcd));
    }
}