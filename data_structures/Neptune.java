public class Neptune extends Currency {
    public Neptune(double funds) {
        super(funds);
        currencyName = "NeptuneNuggets";
    }

    public double toEarthDollars(double amount) {
        double NeptuneExchanged = amount/NeptuneForex;
        return NeptuneExchanged;
    }

    public double fromEarthDollars(double DoubleDollars) {
        double Dollars = DoubleDollars * NeptuneForex;
        return Dollars;
    }

    public void exchange(Currency other, double amount) {
        if (amount > this.totalFunds) {
            System.out.println("Uh oh! Mars only has an available balance of " + String.format("%.2f",this.totalFunds) + ", which is less than $" + String.format("%.2f",amount));
        }
        else {
            double newExchange = other.fromEarthDollars(this.toEarthDollars(amount));

            if (other.currencyName.equals("MarsMoney")) {
                System.out.println("Converting from NeptuneNuggets to MarsMoney and initiating transfer...");
                System.out.println("$" + String.format("%.2f",amount) + " NeptuneNuggets = $" + String.format("%.2f",this.toEarthDollars(amount)) + " EarthDollars =" + " $" + String.format("%.2f",newExchange) + " MarsMoney");
    
                this.totalFunds = totalFunds - amount;
                other.totalFunds = other.totalFunds + newExchange;
    
                System.out.println("Neptune has a total of $" + String.format("%.2f",this.totalFunds) + " NeptuneNuggets");
                System.out.println("Mars has a total of $" + String.format("%.2f",other.totalFunds) + " MarsMoney");
            }
            else if (other.currencyName.equals("SaturnSilver")) {
                System.out.println("Converting from NeptuneNuggets to SaturnSilver and initiating transfer...");
                System.out.println("$" + String.format("%.2f",amount) + " NeptuneNuggets = $" + String.format("%.2f",this.toEarthDollars(amount)) + " EarthDollars =" + " $" + String.format("%.2f",newExchange) + " SaturnSilver");
    
                this.totalFunds = totalFunds - amount;
                other.totalFunds = other.totalFunds + newExchange;
    
                System.out.println("Neptune has a total of $" + String.format("%.2f",this.totalFunds) + " NeptuneNuggets");
                System.out.println("Saturn has a total of $" + String.format("%.2f",other.totalFunds) + " SaturnSilver");
            }
        }
    }
}