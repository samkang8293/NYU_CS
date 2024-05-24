public class RecursionPractice3 {
    public static int convert(String s) {
        if (s.length() == 1) {
            return s.charAt(0) - 48;                
        }
        return convert(s.substring(0,s.length()-1))*10 + (s.charAt(s.length()-1))-48; 
    }
    public static void main(String[] args) {
        String num = "1234";
        System.out.println(convert(num));
    }
}