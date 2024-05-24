public class Saturn extends Currency {
    public Saturn(double funds) {
        super(funds);
        currencyName = "SaturnSilver";
    }
    public double toEarthDollars(double amount) {
        double SaturnExchanged = amount/SaturnForex;
        return SaturnExchanged;
    }
    public double fromEarthDollars(double DoubleDollars) {
        double Dollars = DoubleDollars * SaturnForex;
        return Dollars;
    }

    public void exchange(Currency other, double amount) {
        if (amount > this.totalFunds) {
            System.out.println("Uh oh! Saturn only has an available balance of " + String.format("%.2f",this.totalFunds) + ", which is less than $" + String.format("%.2f",amount));
        }
        else {
            double newExchange = other.fromEarthDollars(this.toEarthDollars(amount));

            if (other.currencyName.equals("MarsMoney")) {
                System.out.println("Converting from SaturnSilver to MarsMoney and initiating transfer...");
                System.out.println("$" + String.format("%.2f",amount) + " SaturnSilver = $" + String.format("%.2f",this.toEarthDollars(amount)) + " EarthDollars =" + " $" + String.format("%.2f",newExchange) + " MarsMoney");
    
                this.totalFunds = totalFunds - amount;
                other.totalFunds = other.totalFunds + newExchange;
    
                System.out.println("Saturn has a total of $" + String.format("%.2f",this.totalFunds) + " SaturnSilver");
                System.out.println("Mars has a total of $" + String.format("%.2f",other.totalFunds) + " MarsMoney");
            }
            else if (other.currencyName.equals("NeptuneNuggets")) {
                System.out.println("Converting from SaturnSilver to NeptuneNuggets and initiating transfer...");
                System.out.println("$" + String.format("%.2f",amount) + " MarsMoney = $" + String.format("%.2f",this.toEarthDollars(amount)) + " EarthDollars =" + " $" + String.format("%.2f",newExchange) + " NeptuneNuggets");
    
                this.totalFunds = totalFunds - amount;
                other.totalFunds = other.totalFunds + newExchange;
    
                System.out.println("Saturn has a total of $" + String.format("%.2f",this.totalFunds) + " SaturnSilver");
                System.out.println("Neptune has a total of $" + String.format("%.2f",other.totalFunds) + " NeptuneNuggets");
            }
        }
    }
}