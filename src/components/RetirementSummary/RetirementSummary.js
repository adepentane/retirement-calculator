import React, { useState } from 'react';
import './RetirementSummary.css';
import RetirementGraph from '../RetirementGraph/RetirementGraph';
import CalculationInfoModal from '../CalculationInfoModal/CalculationInfoModal';

function RetirementSummary({ results, retirementAge, savingsGrowthData, targetSavingsTrajectoryData }) {
  const [activeView, setActiveView] = useState('graph');
  const [showCalcInfoModal, setShowCalcInfoModal] = useState(false);

  const formatCurrency = (value, showDecimals = false) => {
    if (value === undefined || value === null || isNaN(value)) {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD', 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      }).format(0);
    }
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: showDecimals ? 2 : 0, 
      maximumFractionDigits: showDecimals ? 2 : 0 
    }).format(value);
  };

  const yearsUntilRetirement = results.retirementAgeForSummary - results.currentAge;

  const toggleCalcInfoModal = (e) => {
    e.preventDefault();
    setShowCalcInfoModal(!showCalcInfoModal);
  };

  return (
    <div className="retirement-summary">
      <h2>Retirement savings at age {results.retirementAgeForSummary}</h2>
      <div className="summary-values">
        <div className="summary-value-item">
          <p>What you'll have</p>
          <p className="amount">{formatCurrency(results.whatYouWillHave)}</p>
        </div>
        <div className="summary-value-item">
          <p>What you'll need</p>
          <p className="amount">{formatCurrency(results.whatYouWillNeed)}</p>
        </div>
      </div>
      <p className="how-calculated-link">
        <a href="#" onClick={toggleCalcInfoModal}>How did we calculate your results?</a>
      </p>
      <div className="view-toggle">
        <button 
          className={activeView === 'graph' ? 'active' : ''} 
          onClick={() => setActiveView('graph')}
        >
          GRAPH VIEW
        </button>
        <button 
          className={activeView === 'summary' ? 'active' : ''} 
          onClick={() => setActiveView('summary')}
        >
          SUMMARY VIEW
        </button>
      </div>
      
      {activeView === 'graph' && (
        <div className="graph-display-area"> 
          <RetirementGraph 
            savingsGrowthData={savingsGrowthData} 
            targetSavingsTrajectoryData={targetSavingsTrajectoryData} 
            retirementAge={results.retirementAgeForSummary} 
            whatYouWillNeed={results.whatYouWillNeed} 
          />
        </div>
      )}

      {activeView === 'summary' && (
        <div className="summary-view-content">
          <h3>Retirement Projection Summary</h3>
          <ul className="summary-details-list">
            <li>
              <span>Current Age:</span> 
              <strong>{results.currentAge}</strong>
            </li>
            <li>
              <span>Retirement Age:</span> 
              <strong>{results.retirementAgeForSummary}</strong>
            </li>
            <li>
              <span>Life Expectancy:</span> 
              <strong>{results.lifeExpectancy}</strong>
            </li>
            <li>
                <span>Years Until Retirement:</span>
                <strong>{yearsUntilRetirement >= 0 ? yearsUntilRetirement : 0}</strong>
            </li>
            <li>
              <span>Retirement Span:</span> 
              <strong>{results.yearsInRetirementForSummary} years</strong>
            </li>
            <li className="separator"></li>
            <li>
              <span>Initial Current Savings:</span> 
              <strong>{formatCurrency(results.initialSavingsForSummary)}</strong>
            </li>
            <li>
              <span>Total Contributions:</span> 
              <strong>{formatCurrency(results.totalContributionsMade)}</strong>
            </li>
            <li>
              <span>Total Investment Growth (Pre-Retirement):</span> 
              <strong>{formatCurrency(results.totalInvestmentGrowth)}</strong>
            </li>
            <li className="separator"></li>
             <li>
              <span>Projected Pre-Tax Income at Retirement (Annual):</span> 
              <strong>{formatCurrency(results.incomeAtRetirement)}</strong>
            </li>
            <li>
              <span>Desired First Year Withdrawal (Annual):</span> 
              <strong>{formatCurrency(results.firstYearWithdrawalForSummary)}</strong>
            </li>
            <li>
              <span>Lump Sum Needed at Retirement:</span> 
              <strong>{formatCurrency(results.whatYouWillNeed)}</strong>
            </li>
             <li>
              <span>Projected Savings at Retirement:</span> 
              <strong>{formatCurrency(results.whatYouWillHave)}</strong>
            </li>
            <li className={results.whatYouWillHave >= results.whatYouWillNeed ? 'on-track' : 'shortfall'}>
                <span>Status:</span>
                <strong>
                    {results.whatYouWillHave >= results.whatYouWillNeed 
                        ? `On Track (Surplus of ${formatCurrency(results.whatYouWillHave - results.whatYouWillNeed)})` 
                        : `Shortfall of ${formatCurrency(results.whatYouWillNeed - results.whatYouWillHave)}`}
                </strong>
            </li>
          </ul>
          
          <h4>Assumptions:</h4>
          <ul className="summary-assumptions-list">
            <li>Pre-Retirement Rate of Return: {results.preRetirementRateOfReturn}%</li>
            <li>Post-Retirement Rate of Return: {results.postRetirementRateOfReturn}%</li>
            <li>Annual Income Increase: {results.annualIncomeIncrease}%</li>
            <li>Inflation Rate: {results.inflationRate}%</li>
          </ul>
        </div>
      )}
      <CalculationInfoModal show={showCalcInfoModal} onClose={() => setShowCalcInfoModal(false)} />
    </div>
  );
}

export default RetirementSummary; 