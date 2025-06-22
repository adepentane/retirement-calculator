import React, { useState, useEffect } from 'react';
import './App.css';
// We will create these components in the next steps
import RetirementDetailsForm from './components/RetirementDetailsForm/RetirementDetailsForm';
import RetirementSummary from './components/RetirementSummary/RetirementSummary';
import AdvisorsMatch from './components/AdvisorsMatch/AdvisorsMatch';
import { calculateRetirementProjections } from './utils/calculations'; // Import the new function

const initialFormState = {
  currentAge: 45,
  annualPreTaxIncome: 1500000,
  currentRetirementSavings: 30000,
  monthlyContribution: 500,
  contributionType: '$',
  monthlyBudgetInRetirement: '70', // Store as string to allow % or raw value
  budgetType: '%',
  otherRetirementIncome: 0,
  // Advanced Details
  showAdvancedDetails: false,
  retirementAge: 67,
  lifeExpectancy: 95,
  preRetirementRateOfReturn: 6,
  postRetirementRateOfReturn: 5,
  inflationRate: 3,
  annualIncomeIncrease: 2,
};

function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [results, setResults] = useState({
    whatYouWillHave: 0,
    whatYouWillNeed: 0,
    savingsGrowthData: [], // Initialize for the graph data
    targetSavingsTrajectoryData: [], // Initialize for the target savings line
    retirementAgeForSummary: initialFormState.retirementAge,
    incomeAtRetirement: 0, // For helper text in form
    calculatedMonthlyBudgetInRetirement: 0, // For helper text in form
    // For Summary View
    initialSavingsForSummary: initialFormState.currentRetirementSavings,
    totalContributionsMade: 0,
    totalInvestmentGrowth: 0,
    yearsInRetirementForSummary: 0,
    firstYearWithdrawalForSummary: 0,
    // Fields from formData for easy access in Summary View's assumptions list
    currentAge: initialFormState.currentAge,
    lifeExpectancy: initialFormState.lifeExpectancy,
    preRetirementRateOfReturn: initialFormState.preRetirementRateOfReturn,
    postRetirementRateOfReturn: initialFormState.postRetirementRateOfReturn,
    inflationRate: initialFormState.inflationRate,
    annualIncomeIncrease: initialFormState.annualIncomeIncrease,
  });

  const handleDetailsChange = (field, value) => {
    const numericFields = [
      'currentAge', 'annualPreTaxIncome', 'currentRetirementSavings',
      'monthlyContribution', 'otherRetirementIncome', 'retirementAge',
      'lifeExpectancy', 'preRetirementRateOfReturn', 'postRetirementRateOfReturn',
      'inflationRate', 'annualIncomeIncrease'
    ];

    let processedValue = value;
    if (numericFields.includes(field)) {
      const parsed = parseFloat(value);
      processedValue = isNaN(parsed) ? (field === 'monthlyBudgetInRetirement' && formData.budgetType === '%' ? value : 0) : parsed; 
    } else if (field === 'monthlyBudgetInRetirement') { // Allow string for percentage input like "70"
        processedValue = value;
    }

    setFormData(prevData => ({
      ...prevData,
      [field]: processedValue,
    }));
  };

  // useEffect to recalculate when formData changes
  useEffect(() => {
    console.log("Form data changed, recalculating:", formData);
    const calculatedResults = calculateRetirementProjections(formData);
    setResults({
        whatYouWillHave: calculatedResults.whatYouWillHave,
        whatYouWillNeed: calculatedResults.whatYouWillNeed,
        savingsGrowthData: calculatedResults.savingsGrowthData, // Store graph data
        targetSavingsTrajectoryData: calculatedResults.targetSavingsTrajectoryData, // Store target trajectory data
        retirementAgeForSummary: formData.retirementAge, 
        incomeAtRetirement: calculatedResults.incomeAtRetirement, // Store for form helper text
        calculatedMonthlyBudgetInRetirement: calculatedResults.desiredAnnualRetirementIncome / 12,
        // Populate Summary View data
        initialSavingsForSummary: calculatedResults.initialSavingsForSummary,
        totalContributionsMade: calculatedResults.totalContributionsMade,
        totalInvestmentGrowth: calculatedResults.totalInvestmentGrowth,
        yearsInRetirementForSummary: calculatedResults.yearsInRetirementForSummary,
        firstYearWithdrawalForSummary: calculatedResults.firstYearWithdrawalForSummary,
        // Direct formData values needed for summary display
        currentAge: formData.currentAge,
        lifeExpectancy: formData.lifeExpectancy,
        preRetirementRateOfReturn: formData.preRetirementRateOfReturn,
        postRetirementRateOfReturn: formData.postRetirementRateOfReturn,
        inflationRate: formData.inflationRate,
        annualIncomeIncrease: formData.annualIncomeIncrease,
    });
  }, [formData]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Retirement Calculator</h1>
      </header>
      <main className="calculator-container">
        <section className="details-panel">
          <RetirementDetailsForm 
            formData={formData} 
            onDetailsChange={handleDetailsChange} 
            calculatedIncomeAtRetirement={results.incomeAtRetirement} // Pass for helper text
            calculatedMonthlyBudgetInRetirement={results.calculatedMonthlyBudgetInRetirement} // Pass for helper text
          />
        </section>
        <section className="summary-panel">
          <RetirementSummary 
            results={results} 
            retirementAge={formData.retirementAge} 
            savingsGrowthData={results.savingsGrowthData} 
            targetSavingsTrajectoryData={results.targetSavingsTrajectoryData} // Pass target trajectory data
          />
          <AdvisorsMatch />
        </section>
      </main>
    </div>
  );
}

export default App; 