public class RecursionPractice2 {
    public static int findMax(int[] a, int n) {
        if (n == 0) {
            return a[n];
        }
        return Math.max(a[n], findMax(a, --n));
    }
    public static void main(String[] args) {
        int[] a = {1,3,4,2,-1,12,3,1,5,11};
        System.out.println(findMax(a,a.length - 1));
    }
}