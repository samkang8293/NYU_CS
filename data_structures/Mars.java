public class Mars extends Currency {
    public Mars(double funds) {
        super(funds);
        currencyName = "MarsMoney";
    }

    public double toEarthDollars(double amount) {
        double MarsExchanged = amount/MarsForex;
        return MarsExchanged;
    }

    public double fromEarthDollars(double DoubleDollars) {
        double Dollars = DoubleDollars * MarsForex;
        return Dollars;
    }

    public void exchange(Currency other, double amount) {
        if (amount > this.totalFunds) {
            System.out.println("Uh oh! Mars only has an available balance of " + String.format("%.2f",this.totalFunds) + ", which is less than $" + String.format("%.2f",amount));
        }
        else {
            double newExchange = other.fromEarthDollars(this.toEarthDollars(amount));

            if (other.currencyName.equals("SaturnSilver")) {
                System.out.println("Converting from MarsMoney to SaturnSilver and initiating transfer...");
                System.out.println("$" + String.format("%.2f",amount) + " MarsMoney = $" + String.format("%.2f",this.toEarthDollars(amount)) + " EarthDollars =" + " $" + String.format("%.2f",newExchange) + " SaturnSilver");
    
                this.totalFunds = totalFunds - amount;
                other.totalFunds = other.totalFunds + newExchange;
    
                System.out.println("Mars has a total of $" + String.format("%.2f",this.totalFunds) + " MarsMoney.");
                System.out.println("Saturn has a total of $" + String.format("%.2f",other.totalFunds) + " SaturnSilver");
            }
            else if (other.currencyName.equals("NeptuneNuggets")) {
                System.out.println("Converting from MarsMoney to NeptuneNuggets and initiating transfer...");
                System.out.println("$" + String.format("%.2f",amount) + " MarsMoney = $" + String.format("%.2f",this.toEarthDollars(amount)) + " EarthDollars =" + " $" + String.format("%.2f",newExchange) + " NeptuneNuggets");
    
                this.totalFunds = totalFunds - amount;
                other.totalFunds = other.totalFunds + newExchange;
    
                System.out.println("Mars has a total of $" + String.format("%.2f",this.totalFunds) + " MarsMoney.");
                System.out.println("Neptune has a total of $" + String.format("%.2f",other.totalFunds) + " NeptuneNuggets");
            }
        }
    }
}