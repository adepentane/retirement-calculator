import React from 'react';
import './CalculationInfoModal.css';

function CalculationInfoModal({ show, onClose }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>How We Calculate Your Results</h2>
        <p>
          This calculator projects your potential retirement savings based on the information you provide and several key financial assumptions.
        </p>
        <h4>Key Factors:</h4>
        <ul>
          <li><strong>Current Savings Growth:</strong> Your existing retirement savings are projected to grow based on the "Pre-retirement rate of return" you set.</li>
          <li><strong>Contributions Growth:</strong> Your monthly contributions are added to your savings and also grow at the "Pre-retirement rate of return". If your contributions are a percentage of your income, they are assumed to increase as your income increases.</li>
          <li><strong>Income Growth:</strong> Your annual income is projected to increase based on the "Annual income increase" rate you set. This impacts percentage-based contributions and your estimated income at retirement.</li>
          <li><strong>Retirement Needs:</strong> Your "What you'll need" amount is estimated by calculating the lump sum required at retirement to fund your desired retirement budget (adjusted for inflation) throughout your expected lifespan, considering the "Post-retirement rate of return".</li>
          <li><strong>Inflation:</strong> An assumed inflation rate impacts the future purchasing power of your money and the cost of living in retirement.</li>
        </ul>
        <p>
          The graph visualizes the growth of your savings (What you'll have) and a target savings trajectory (What you'll need) to help you see if you're on track.
        </p>
        <p>
          <em>Note: These calculations are estimates and for illustrative purposes only. Actual results may vary. Consult with a financial advisor for personalized advice.</em>
        </p>
        <button className="modal-understand-button" onClick={onClose}>I Understand</button>
      </div>
    </div>
  );
}

export default CalculationInfoModal; 