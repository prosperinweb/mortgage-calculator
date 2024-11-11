export const calculateMortgage = (
    amount: number,
    interestRate: number,
    years: number,
    type: 'repayment' | 'interest-only'
  ) => {
    // Input validation
    if (amount <= 0 || interestRate <= 0 || years <= 0) {
      throw new Error('Invalid input parameters');
    }
  
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;
  
    try {
      if (type === 'interest-only') {
        const monthlyPayment = amount * monthlyRate;
        const totalPayment = monthlyPayment * numberOfPayments + amount;
        return {
          monthlyPayment: Math.round(monthlyPayment * 100) / 100,
          totalPayment: Math.round(totalPayment * 100) / 100,
          interestTotal: Math.round(monthlyPayment * numberOfPayments * 100) / 100,
        };
      }
  
      const monthlyPayment =
        (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalPayment = monthlyPayment * numberOfPayments;
      const interestTotal = totalPayment - amount;
  
      return {
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100,
        interestTotal: Math.round(interestTotal * 100) / 100,
      };
    } catch (error) {
      throw new Error('Error calculating mortgage payments');
    }
  };