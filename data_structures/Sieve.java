import java.util.Scanner;

public class Sieve {
    public void primesTo(int n) throws IllegalArgumentException {
        LinkedQueue<Integer> numbers = new LinkedQueue<Integer>();
        LinkedQueue<Integer> primes = new LinkedQueue<Integer>();

        if (n < 2) {
            throw new IllegalArgumentException("Primes up to 2 are: 2");
        }

        else if (n == 2) {
            System.out.print("Primes up to 2 are: 2");
        }
        else if (n == 3) {
            System.out.print("Primes up to 3 are: 2 3");
        }
        else {
            for (int i = 2; i <= n; i++) {
                numbers.enqueue(i);
            }

            int p = numbers.first();

            while (p <= Math.sqrt(n)) {
                for (int j = 0; j <= n; j++) {
                    int num = numbers.dequeue();
                    if (isPrime(num)) {
                        primes.enqueue(num);
                    }
                    else {
                        numbers.enqueue(num);
                    }
                }
                p = numbers.first();
            }

            System.out.print("Primes up to " + n + " are: ");

            while (!primes.isEmpty()) {
                int prime = primes.dequeue();

                System.out.print(prime + " ");
            }
        }
    }

    public boolean isPrime(int num) {
        if (num <= 1) {
            return false;
        }
        else {
            for (int i = 2; i*i <= num; i++) {
                if (num % i == 0 && num != i) {
                    return false;
                }
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner stdin = new Scanner(System.in);
        System.out.println("Enter the upper bound:");
        int upper_bound = stdin.nextInt();

        Sieve sieve = new Sieve();
        sieve.primesTo(upper_bound);
    }
}   