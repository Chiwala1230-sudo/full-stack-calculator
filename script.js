
//   ZRA PAYE CALCULATOR - JAVASCRIPT
//   I built this calculator myself
//   It uses the 2026 tax bands from the design


// Wait for the page to load before running any code
document.addEventListener('DOMContentLoaded', function() {
    
    
    // GET ALL THE ELEMENTS FROM THE PAGE

    
    // Input fields
    const basicPayInput = document.getElementById('basicPay');
    const allowancesInput = document.getElementById('allowances');
    const statutoryInput = document.getElementById('statutory');
    
    // Display fields (where results will show)
    const grossPaySpan = document.getElementById('grossPay');
    const napsaSpan = document.getElementById('napsa');
    const nhimaSpan = document.getElementById('nhima');
    const totalContributionsSpan = document.getElementById('totalContributions');
    const totalTaxSpan = document.getElementById('totalTax');
    const totalDeductionsSpan = document.getElementById('totalDeductions');
    const netSalarySpan = document.getElementById('netSalary');
    
    // Tax band display fields
    const chargeable1 = document.getElementById('chargeable1');
    const taxDue1 = document.getElementById('taxDue1');
    const chargeable2 = document.getElementById('chargeable2');
    const taxDue2 = document.getElementById('taxDue2');
    const chargeable3 = document.getElementById('chargeable3');
    const taxDue3 = document.getElementById('taxDue3');
    const chargeable4 = document.getElementById('chargeable4');
    const taxDue4 = document.getElementById('taxDue4');
    
    
    // CONSTANTS - Fixed values used in calculations

    
    const NAPSA_RATE = 0.05;     // 5% NAPSA contribution
    const NHIMA_RATE = 0.01;     // 1% National Health Insurance
    
    // Tax bands for 2026 (based on the design)
    // Band 1: First 5,100 @ 0%
    // Band 2: Next 4,100 @ 20%
    // Band 3: Next 4,400 @ 30%
    // Band 4: Above 13,600 @ 37%
    const TAX_BANDS = [
        { min: 0, max: 5100, rate: 0 },
        { min: 5100, max: 9200, rate: 0.20 },    // 5100 + 4100 = 9200
        { min: 9200, max: 13600, rate: 0.30 },   // 9200 + 4400 = 13600
        { min: 13600, max: Infinity, rate: 0.37 }
    ];
    
    
    // HELPER FUNCTION - Format numbers as currency

    function formatMoney(amount) {
        // Fix to 2 decimal places and add commas for thousands
        return 'K ' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    

    // TAX CALCULATION FUNCTION
    // Calculates PAYE tax and returns tax amount and band details
    
    function calculatePAYEWithBands(income) {
        let totalTax = 0;
        let remainingIncome = income;
        
        // Array to store chargeable income for each band
        let bandIncomes = [0, 0, 0, 0];
        // Array to store tax for each band
        let bandTaxes = [0, 0, 0, 0];
        
        // Band 1: 0 - 5100 (0% tax)
        if (remainingIncome > 0) {
            let bandAmount = Math.min(remainingIncome, 5100);
            bandIncomes[0] = bandAmount;
            bandTaxes[0] = 0; // 0% tax
            remainingIncome -= bandAmount;
        }
        
        // Band 2: 5100 - 9200 (20% tax)
        if (remainingIncome > 0) {
            let bandAmount = Math.min(remainingIncome, 4100);
            bandIncomes[1] = bandAmount;
            bandTaxes[1] = bandAmount * 0.20;
            totalTax += bandTaxes[1];
            remainingIncome -= bandAmount;
        }
        
        // Band 3: 9200 - 13600 (30% tax)
        if (remainingIncome > 0) {
            let bandAmount = Math.min(remainingIncome, 4400);
            bandIncomes[2] = bandAmount;
            bandTaxes[2] = bandAmount * 0.30;
            totalTax += bandTaxes[2];
            remainingIncome -= bandAmount;
        }
        
        // Band 4: Above 13600 (37% tax)
        if (remainingIncome > 0) {
            bandIncomes[3] = remainingIncome;
            bandTaxes[3] = remainingIncome * 0.37;
            totalTax += bandTaxes[3];
        }
        
        return {
            tax: totalTax,
            bandIncomes: bandIncomes,
            bandTaxes: bandTaxes
        };
    }
    
    
    // MAIN CALCULATION FUNCTION
    // This runs whenever someone types in any input
    
    function updateCalculator() {
        
        // Get values from inputs (convert to numbers, default to 0 if empty)
        let basicPay = parseFloat(basicPayInput.value) || 0;
        let allowances = parseFloat(allowancesInput.value) || 0;
        let statutory = parseFloat(statutoryInput.value) || 0;
        
        // Make sure no negative values
        if (basicPay < 0) basicPay = 0;
        if (allowances < 0) allowances = 0;
        if (statutory < 0) statutory = 0;
        
        // Calculate Gross Pay (Basic Pay + Allowances)
        let grossPay = basicPay + allowances;
        
        // Calculate Statutory Contributions
        let napsa = grossPay * NAPSA_RATE;
        let nhima = grossPay * NHIMA_RATE;
        let totalContributions = napsa + nhima;
        
        // Calculate PAYE Tax
        let taxResult = calculatePAYEWithBands(grossPay);
        let payeTax = taxResult.tax;
        
        // Calculate Totals
        let totalTaxDeductions = payeTax; // PAYE is the tax deduction
        let totalDeductions = totalContributions + totalTaxDeductions + statutory;
        let netSalary = grossPay - totalDeductions;
        
        // Make sure net salary isn't negative
        if (netSalary < 0) netSalary = 0;
        
    
        
        // Main results
        grossPaySpan.textContent = formatMoney(grossPay);
        napsaSpan.textContent = formatMoney(napsa);
        nhimaSpan.textContent = formatMoney(nhima);
        totalContributionsSpan.textContent = formatMoney(totalContributions);
        totalTaxSpan.textContent = formatMoney(totalTaxDeductions);
        totalDeductionsSpan.textContent = formatMoney(totalDeductions);
        netSalarySpan.textContent = formatMoney(netSalary);
        
        
        chargeable1.textContent = taxResult.bandIncomes[0].toFixed(2);
        taxDue1.textContent = taxResult.bandTaxes[0].toFixed(2);
        
        chargeable2.textContent = taxResult.bandIncomes[1].toFixed(2);
        taxDue2.textContent = taxResult.bandTaxes[1].toFixed(2);
        
        chargeable3.textContent = taxResult.bandIncomes[2].toFixed(2);
        taxDue3.textContent = taxResult.bandTaxes[2].toFixed(2);
        
        chargeable4.textContent = taxResult.bandIncomes[3].toFixed(2);
        taxDue4.textContent = taxResult.bandTaxes[3].toFixed(2);
        
        
        console.log('Calculator updated - Gross Pay: K' + grossPay);
    }
    
    
    window.resetCalculator = function() {
        
        basicPayInput.value = '0';
        allowancesInput.value = '0';
        statutoryInput.value = '0';
        
        
        updateCalculator();
        
        console.log('Calculator reset');
    };
    
    // =========================================
    // ADD EVENT LISTENERS
    // This makes the calculator update when you type
    // =========================================
    
    // Update when typing in Basic Pay
    basicPayInput.addEventListener('input', updateCalculator);
    
    // Update when typing in Allowances
    allowancesInput.addEventListener('input', updateCalculator);
    
    // Update when typing in Statutory Contribution
    statutoryInput.addEventListener('input', updateCalculator);
    
    // Also update when pressing Enter
    basicPayInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') updateCalculator();
    });
    
    allowancesInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') updateCalculator();
    });
    
    statutoryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') updateCalculator();
    });
    
    // =========================================
    // INITIAL CALCULATION
    // Run once when page loads to show default values
    // =========================================
    updateCalculator();
    
    // Show message that calculator is ready
    console.log('✅ PAYE Calculator is ready! All fields update automatically.');
});