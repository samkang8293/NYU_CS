public interface Exchangeable {
    double MarsForex = 1.30;
    double SaturnForex = 0.87;
    double NeptuneForex = 2.00;
    
    public void exchange(Currency other, double amount);
}