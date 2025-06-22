import React, { useState } from 'react';
import './RetirementDetailsForm.css';

function RetirementDetailsForm({ 
  formData, 
  onDetailsChange, 
  calculatedIncomeAtRetirement, // From App.js results state
  calculatedMonthlyBudgetInRetirement // From App.js results state
}) {
  // Local state for UI elements like the toggle, not directly part of the calculation data
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);

  // Handler for simple input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    // Let App.js handle numeric conversion via onDetailsChange logic
    onDetailsChange(id, value);
  };

  // Specific handler for type toggles if needed, or can be combined
  const handleContributionTypeChange = (type) => {
    onDetailsChange('contributionType', type);
  };

  const handleBudgetTypeChange = (type) => {
    onDetailsChange('budgetType', type);
  };

  const formatCurrency = (value, showDecimals = true) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: showDecimals ? 2 : 0, 
      maximumFractionDigits: showDecimals ? 2 : 0 
    }).format(value || 0);
  };

  // Helper text for Monthly Contributions
  let monthlyContributionHelpText = '';
  const monthlyIncome = (formData.annualPreTaxIncome || 0) / 12;
  if (formData.contributionType === '%' && monthlyIncome > 0) {
    const dollarAmount = monthlyIncome * (parseFloat(formData.monthlyContribution) / 100);
    monthlyContributionHelpText = `${formData.monthlyContribution}% of monthly income (${formatCurrency(dollarAmount)})`;
  } else if (formData.contributionType === '$' && monthlyIncome > 0 && parseFloat(formData.monthlyContribution) > 0) {
    const percentageAmount = (parseFloat(formData.monthlyContribution) / monthlyIncome) * 100;
    if (percentageAmount >= 0 && isFinite(percentageAmount)) {
        monthlyContributionHelpText = `${percentageAmount.toFixed(1)}% of monthly income`;
    }
  }

  // Helper text for Monthly Budget in Retirement
  let monthlyBudgetHelpText = '';
  const incomeAtRetirementMonthly = (calculatedIncomeAtRetirement || 0) / 12;

  if (formData.budgetType === '%' && incomeAtRetirementMonthly > 0) {
    // calculatedMonthlyBudgetInRetirement is already the dollar amount based on percentage
    monthlyBudgetHelpText = `${formData.monthlyBudgetInRetirement}% of pre-retirement income (${formatCurrency(calculatedMonthlyBudgetInRetirement)})`;
  } else if (formData.budgetType === '$' && incomeAtRetirementMonthly > 0 && parseFloat(formData.monthlyBudgetInRetirement) > 0) {
    const budgetAsPercentage = (parseFloat(formData.monthlyBudgetInRetirement) / incomeAtRetirementMonthly) * 100;
    if (budgetAsPercentage >= 0 && isFinite(budgetAsPercentage)) {
        monthlyBudgetHelpText = `${budgetAsPercentage.toFixed(1)}% of pre-retirement income`;
    }
  }

  return (
    <form className="retirement-details-form" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
      <h2>Retirement details</h2>

      <div className="form-group">
        <label htmlFor="currentAge">Current age</label>
        <input
          type="number"
          id="currentAge"
          value={formData.currentAge}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="annualPreTaxIncome">Annual pre-tax income</label>
        <input
          type="number"
          id="annualPreTaxIncome"
          value={formData.annualPreTaxIncome}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="currentRetirementSavings">Current retirement savings</label>
        <input
          type="number"
          id="currentRetirementSavings"
          value={formData.currentRetirementSavings}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="monthlyContribution">Monthly contributions</label>
        <div className="form-group-inline">
            <div className="input-wrapper">
                <input
                type="number" 
                id="monthlyContribution"
                value={formData.monthlyContribution}
                onChange={handleChange}
                />
                <div className="toggle-buttons">
                    <button type="button" className={formData.contributionType === '$' ? 'active' : ''} onClick={() => handleContributionTypeChange('$')}>$</button>
                    <button type="button" className={formData.contributionType === '%' ? 'active' : ''} onClick={() => handleContributionTypeChange('%')}>%</button>
                </div>
            </div>
        </div>
        {monthlyContributionHelpText && <small className="form-text text-muted help-text">{monthlyContributionHelpText}</small>}
      </div>

      <div className="form-group">
        <label htmlFor="monthlyBudgetInRetirement">Monthly budget in retirement</label>
        <div className="form-group-inline">
            <div className="input-wrapper">
                <input
                type="number" 
                id="monthlyBudgetInRetirement"
                value={formData.monthlyBudgetInRetirement}
                onChange={handleChange}
                placeholder={formData.budgetType === '%' ? 'e.g. 70' : 'e.g. 5000'}
                />
                <div className="toggle-buttons">
                    <button type="button" className={formData.budgetType === '$' ? 'active' : ''} onClick={() => handleBudgetTypeChange('$')}>$</button>
                    <button type="button" className={formData.budgetType === '%' ? 'active' : ''} onClick={() => handleBudgetTypeChange('%')}>%</button>
                </div>
            </div>
        </div>
        {monthlyBudgetHelpText && <small className="form-text text-muted help-text">{monthlyBudgetHelpText}</small>}
      </div>

      <div className="form-group">
        <label htmlFor="otherRetirementIncome">Other retirement income (annual)</label>
        <input
          type="number"
          id="otherRetirementIncome"
          value={formData.otherRetirementIncome}
          onChange={handleChange}
        />
      </div>

      <div className="advanced-details-toggle">
        <button type="button" onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}>
          ADVANCED DETAILS {showAdvancedDetails ? '^' : 'v'} 
        </button>
      </div>

      {showAdvancedDetails && (
        <div className="advanced-details-fields">
          <div className="form-group">
            <label htmlFor="retirementAge">Retirement age</label>
            <input
              type="number"
              id="retirementAge"
              value={formData.retirementAge}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lifeExpectancy">Life expectancy</label>
            <input
              type="number"
              id="lifeExpectancy"
              value={formData.lifeExpectancy}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="preRetirementRateOfReturn">Pre-retirement rate of return (%)</label>
            <input
              type="number"
              id="preRetirementRateOfReturn"
              value={formData.preRetirementRateOfReturn}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="postRetirementRateOfReturn">Post-retirement rate of return (%)</label>
            <input
              type="number"
              id="postRetirementRateOfReturn"
              value={formData.postRetirementRateOfReturn}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="inflationRate">Inflation rate (%)</label>
            <input
              type="number"
              id="inflationRate"
              value={formData.inflationRate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="annualIncomeIncrease">Annual income increase (%)</label>
            <input
              type="number"
              id="annualIncomeIncrease"
              value={formData.annualIncomeIncrease}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </form>
  );
}

export default RetirementDetailsForm; 