// src/utils/calculations.js

/**
 * Calculates the future value of a present sum.
 * PV = Present Value
 * r = rate of return (annual, as a decimal, e.g., 0.06 for 6%)
 * n = number of years
 */
export function futureValue(PV, r, n) {
  if (n <= 0) return PV;
  return PV * Math.pow(1 + r, n);
}

/**
 * Calculates the future value of a series of payments (annuity).
 * PMT = Payment per period
 * r = rate of return per period (e.g., annual rate / 12 for monthly contributions)
 * numPeriods = total number of periods (e.g., years * 12 for monthly contributions)
 * Assumes payments are made at the end of each period.
 */
export function futureValueAnnuity(PMT, r_period, numPeriods) {
  if (numPeriods <= 0) return 0;
  if (r_period === 0) {
    return PMT * numPeriods;
  }
  return PMT * ((Math.pow(1 + r_period, numPeriods) - 1) / r_period);
}

/**
 * Calculates the income at retirement, factoring in annual increases and inflation.
 * currentAnnualIncome = Current gross annual income
 * annualIncomeIncreaseRate = Expected annual raise (e.g., 0.02 for 2%)
 * yearsToRetirement = Number of years until retirement
 * inflationRate = Expected annual inflation rate (e.g., 0.03 for 3%)
 *
 * This calculates the nominal income at retirement. To find its real value (purchasing power),
 * it would need to be discounted by inflation back to today's terms.
 * For "What you'll need", we typically use the income at retirement as the base for budget.
 */
export function calculatePreRetirementIncomeAtRetirement(
  currentAnnualIncome,
  annualIncomeIncreaseRate,
  yearsToRetirement
) {
  if (yearsToRetirement <= 0) return currentAnnualIncome;
  // Income grows with annual increases
  return currentAnnualIncome * Math.pow(1 + annualIncomeIncreaseRate, yearsToRetirement);
}

/**
 * Calculates the present value of a growing annuity.
 * Used to determine the lump sum needed at retirement.
 * C1 = Cash flow in the first period (first year's withdrawal amount at retirement)
 * r = Discount rate (post-retirement rate of return, as a decimal)
 * g = Growth rate of cash flows (inflation rate, as a decimal)
 * n = Number of periods (years in retirement)
 */
export function presentValueGrowingAnnuity(C1, r, g, n) {
  if (n <= 0) return 0;
  if (r === g) {
    // If discount rate and growth rate are the same, PV = C1 * n / (1+r)
    // This is a simplification. The formula C1 / (r-g) * [...] would have division by zero.
    // sum C1*(1+g)^i / (1+r)^(i+1) for i=0 to n-1
    // if r=g, then sum C1 / (1+r) = n * C1 / (1+r)
    return (C1 * n) / (1 + r);
  }
  if (r < g) {
    // If returns are less than inflation, the standard formula might give misleading results
    // or the fund depletes very quickly. This scenario requires careful handling.
    // For this calculator, let's calculate the sum of present values of each year's inflated withdrawal.
    let needed = 0;
    let withdrawal = C1;
    for (let i = 0; i < n; i++) {
      needed += withdrawal / Math.pow(1 + r, i + 1);
      withdrawal *= (1 + g);
    }
    return needed;
  }

  const term = Math.pow((1 + g) / (1 + r), n);
  return (C1 / (r - g)) * (1 - term);
}

/**
 * Main calculation orchestrator.
 * Takes formData object and returns { whatYouWillHave, whatYouWillNeed }
 */
export function calculateRetirementProjections(formData) {
  const {
    currentAge,
    annualPreTaxIncome,
    currentRetirementSavings,
    monthlyContribution: rawMonthlyContribution,
    contributionType,
    monthlyBudgetInRetirement: rawMonthlyBudget,
    budgetType,
    otherRetirementIncome, // This is annual other income in retirement
    retirementAge,
    lifeExpectancy,
    preRetirementRateOfReturn: preRetRate, // %
    postRetirementRateOfReturn: postRetRate, // %
    inflationRate: inflRate, // %
    annualIncomeIncrease: incomeIncreaseRate, // %
  } = formData;

  // Convert percentage rates to decimals
  const r_pre = preRetRate / 100;
  const r_post = postRetRate / 100;
  const inflation = inflRate / 100;
  const incomeIncrease = incomeIncreaseRate / 100;

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);

  let monthlyContributionAmount = parseFloat(rawMonthlyContribution) || 0;
  if (contributionType === '%') {
    const monthlyIncome = (annualPreTaxIncome || 0) / 12;
    monthlyContributionAmount = monthlyIncome * (parseFloat(rawMonthlyContribution) / 100);
  }
  const annualContribution = monthlyContributionAmount * 12;
  const totalContributionsMade = annualContribution * yearsToRetirement;

  // --- Calculate "What you'll have" --- 
  let actualSavingsBalance = currentRetirementSavings;
  const savingsGrowthData = []; // For the graph

  // Accumulation phase (up to retirement)
  for (let year = 0; year < yearsToRetirement; year++) {
    savingsGrowthData.push({ age: currentAge + year, value: actualSavingsBalance });
    // Assuming contributions are made throughout the year and growth happens at year end
    // More accurately, contributions could be monthly, but for annual graph points:
    actualSavingsBalance += annualContribution; // Add contributions made during the year
    actualSavingsBalance *= (1 + r_pre);      // Apply annual growth
  }
  savingsGrowthData.push({ age: retirementAge, value: actualSavingsBalance }); // Value at retirement age
  const whatYouWillHave = actualSavingsBalance;
  const totalInvestmentGrowth = whatYouWillHave - currentRetirementSavings - totalContributionsMade;

  // --- Calculate "What you'll need" (Lump sum at retirement) --- 
  const incomeAtRetirement = calculatePreRetirementIncomeAtRetirement(
    annualPreTaxIncome,
    incomeIncrease,
    yearsToRetirement
  );

  let desiredAnnualRetirementIncome;
  if (budgetType === '%') {
    desiredAnnualRetirementIncome = incomeAtRetirement * (parseFloat(rawMonthlyBudget) / 100);
  } else {
    // If it's a dollar amount, assume it's today's dollars and inflate it to retirement age.
    // The screenshot implies "Monthly budget in retirement ($70,598)" which seems to be already an amount *at retirement*.
    // If user enters a fixed dollar amount, we should clarify if it's in today's value or future value.
    // Assuming the input fixed dollar amount for budget is *in today's dollars*.
    // So, we inflate it to the start of retirement.
    // The example "Monthly budget in retirement ($70,598)" might be a calculated value shown to user.
    // Let's assume the user enters desired budget in TODAY's terms if fixed $.
    desiredAnnualRetirementIncome = futureValue(parseFloat(rawMonthlyBudget) * 12, inflation, yearsToRetirement);
    // However, if the field implies "70% of pre-retirement income ($70,598)", then 70598 IS the future value.
    // Let's stick to the simpler interpretation based on NerdWallet: "enter your estimated monthly retirement budget... before taxes".
    // If they give a fixed $, it's that future value. If %, it's based on future income.
    // Let's assume the fixed dollar amount provided by the user IS the target amount at retirement.
    if (budgetType === '$') {
        desiredAnnualRetirementIncome = parseFloat(rawMonthlyBudget) * 12;
    }
  }

  // 2c. Net annual retirement income needed from savings
  // (subtracting other fixed income like pensions, social security - already an annual figure in formData)
  const netAnnualIncomeNeededFromSavings = Math.max(0, desiredAnnualRetirementIncome - (parseFloat(otherRetirementIncome) || 0));

  // 2d. Lump sum needed at retirement
  // Use Present Value of a Growing Annuity
  const whatYouWillNeedAtRetirement = presentValueGrowingAnnuity(
    netAnnualIncomeNeededFromSavings,
    r_post, // Post-retirement return rate
    inflation, // Inflation rate (growth rate of withdrawals)
    yearsInRetirement
  );

  // Distribution phase (during retirement for graph)
  let currentBalanceForGraph = whatYouWillHave;
  let firstYearWithdrawal = netAnnualIncomeNeededFromSavings; // This is the nominal amount for the first year of retirement

  for (let year = 0; year < yearsInRetirement; year++) {
    // Withdraw at the beginning of the year, then let remaining balance grow.
    const withdrawalThisYear = firstYearWithdrawal * Math.pow(1 + inflation, year);
    currentBalanceForGraph -= withdrawalThisYear;
    if (currentBalanceForGraph < 0) currentBalanceForGraph = 0; // Cannot go below zero
    
    savingsGrowthData.push({ age: retirementAge + year + 1, value: currentBalanceForGraph });
    
    currentBalanceForGraph *= (1 + r_post); // Remaining balance grows
    if (currentBalanceForGraph < 0) currentBalanceForGraph = 0; 
  }
  // Ensure the graph data extends to life expectancy
  if (yearsInRetirement > 0 && savingsGrowthData[savingsGrowthData.length -1].age < lifeExpectancy) {
      savingsGrowthData.push({ age: lifeExpectancy, value: Math.max(0, currentBalanceForGraph) });
  }
  // If no years in retirement, ensure the graph still ends at life expectancy if it's beyond retirement age
  else if (yearsInRetirement === 0 && retirementAge < lifeExpectancy) {
    for (let age = retirementAge + 1; age <= lifeExpectancy; age++) {
        savingsGrowthData.push({ age: age, value: whatYouWillHave }); // No withdrawals, balance remains
    }
  }

  // --- Generate data for "What you'll need over time" graph line ---
  const targetSavingsTrajectoryData = [];
  // Before retirement: Present value of whatYouWillNeedAtRetirement, discounted to each year
  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = currentAge + year;
    const yearsRemainingToRetirement = yearsToRetirement - year;
    const targetValue = whatYouWillNeedAtRetirement / Math.pow(1 + r_pre, yearsRemainingToRetirement);
    targetSavingsTrajectoryData.push({ age: age, value: targetValue });
  }

  // During retirement: Deplete the whatYouWillNeedAtRetirement amount
  let targetBalance = whatYouWillNeedAtRetirement;
  for (let year = 0; year < yearsInRetirement; year++) {
    const age = retirementAge + year + 1;
    const withdrawalThisYear = netAnnualIncomeNeededFromSavings * Math.pow(1 + inflation, year);
    targetBalance -= withdrawalThisYear;
    if (targetBalance < 0) targetBalance = 0;
    targetSavingsTrajectoryData.push({ age: age, value: targetBalance });
    targetBalance *= (1 + r_post);
    if (targetBalance < 0) targetBalance = 0;
  }
   if (yearsInRetirement > 0 && targetSavingsTrajectoryData[targetSavingsTrajectoryData.length -1].age < lifeExpectancy) {
      targetSavingsTrajectoryData.push({ age: lifeExpectancy, value: Math.max(0, targetBalance) });
  }
   else if (yearsInRetirement === 0 && retirementAge < lifeExpectancy && whatYouWillNeedAtRetirement > 0) {
     for (let age = retirementAge + 1; age <= lifeExpectancy; age++) {
        targetSavingsTrajectoryData.push({ age: age, value: whatYouWillNeedAtRetirement }); 
    }
  }

  // Consolidate and sort graph data to ensure unique ages and correct order
  const consolidateAndSort = (data) => {
    const uniqueData = Array.from(new Map(data.map(item => [item.age, item])).values());
    return uniqueData.sort((a, b) => a.age - b.age);
  }

  return {
    whatYouWillHave: isNaN(whatYouWillHave) ? 0 : whatYouWillHave,
    whatYouWillNeed: isNaN(whatYouWillNeedAtRetirement) ? 0 : whatYouWillNeedAtRetirement,
    savingsGrowthData: consolidateAndSort(savingsGrowthData),
    targetSavingsTrajectoryData: consolidateAndSort(targetSavingsTrajectoryData),
    // Summary View Data Points:
    initialSavingsForSummary: currentRetirementSavings,
    totalContributionsMade: isNaN(totalContributionsMade) ? 0 : totalContributionsMade,
    totalInvestmentGrowth: isNaN(totalInvestmentGrowth) ? 0 : totalInvestmentGrowth,
    yearsInRetirementForSummary: yearsInRetirement,
    firstYearWithdrawalForSummary: isNaN(netAnnualIncomeNeededFromSavings) ? 0 : netAnnualIncomeNeededFromSavings,
    // Other existing data:
    retirementAgeForSummary: retirementAge,
    incomeAtRetirement, // For summary view
    desiredAnnualRetirementIncome // For summary view
  };
}

// More functions will be added here for detailed calculations. 