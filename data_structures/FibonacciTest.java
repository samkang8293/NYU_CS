import javax.swing.JOptionPane;

public class FibonacciTest 
{
	public static void main (String args[])
	{
		long number, fibonacciValue;
		String numberAsString;
		numberAsString = JOptionPane.showInputDialog("What Fib value do you want?");
		number = Long.parseLong( numberAsString );

		fibonacciValue = fibonacci( number );             
		
		System.out.println (fibonacciValue);
		System.exit (0);
		
	} 

	// recursive declaration of method fibonacci         
	public static long fibonacci( long n )                      
	{                                                    
		if ( n == 0 || n == 1 )                           
			return n;
		else                                              
			return fibonacci( n - 1 ) + fibonacci( n - 2 );
	} // end method fibonacci
} // end class FibonacciTest
