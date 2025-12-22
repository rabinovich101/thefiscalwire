/**
 * Black-Scholes Option Pricing Model
 * Calculates Greeks (Delta, Gamma, Theta, Vega, Rho) and option prices
 */

export interface GreeksResult {
  delta: number;
  gamma: number;
  theta: number;  // Daily theta (annualized / 365)
  vega: number;   // Per 1% volatility change
  rho: number;    // Per 1% interest rate change
}

export interface BlackScholesInputs {
  stockPrice: number;      // S - Current stock price
  strikePrice: number;     // K - Strike price
  timeToExpiry: number;    // T - Time to expiration in years
  riskFreeRate: number;    // r - Risk-free interest rate (decimal, e.g., 0.045 = 4.5%)
  volatility: number;      // sigma - Implied volatility (decimal, e.g., 0.30 = 30%)
  dividendYield?: number;  // q - Dividend yield (decimal, optional, defaults to 0)
}

/**
 * Standard Normal Cumulative Distribution Function (CDF)
 * Uses Abramowitz and Stegun approximation
 */
function normCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Standard Normal Probability Density Function (PDF)
 */
function normPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate d1 and d2 parameters used in Black-Scholes formula
 */
function calculateD1D2(inputs: BlackScholesInputs): { d1: number; d2: number } {
  const { stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividendYield = 0 } = inputs;

  const sqrtT = Math.sqrt(timeToExpiry);

  const d1 = (Math.log(stockPrice / strikePrice) + (riskFreeRate - dividendYield + 0.5 * volatility * volatility) * timeToExpiry) / (volatility * sqrtT);
  const d2 = d1 - volatility * sqrtT;

  return { d1, d2 };
}

/**
 * Calculate Greeks for a CALL option
 */
export function calculateCallGreeks(inputs: BlackScholesInputs): GreeksResult {
  const { stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividendYield = 0 } = inputs;

  // Handle edge cases
  if (timeToExpiry <= 0 || volatility <= 0 || stockPrice <= 0 || strikePrice <= 0) {
    return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
  }

  const { d1, d2 } = calculateD1D2(inputs);
  const sqrtT = Math.sqrt(timeToExpiry);

  const expMinusQT = Math.exp(-dividendYield * timeToExpiry);
  const expMinusRT = Math.exp(-riskFreeRate * timeToExpiry);

  // Delta: e^(-qT) * N(d1)
  const delta = expMinusQT * normCDF(d1);

  // Gamma: e^(-qT) * N'(d1) / (S * sigma * sqrt(T))
  const gamma = expMinusQT * normPDF(d1) / (stockPrice * volatility * sqrtT);

  // Theta (annualized):
  // -[S * sigma * e^(-qT) * N'(d1)] / [2 * sqrt(T)] - r * K * e^(-rT) * N(d2) + q * S * e^(-qT) * N(d1)
  const thetaAnnual =
    -(stockPrice * volatility * expMinusQT * normPDF(d1)) / (2 * sqrtT)
    - riskFreeRate * strikePrice * expMinusRT * normCDF(d2)
    + dividendYield * stockPrice * expMinusQT * normCDF(d1);

  // Convert to daily theta
  const theta = thetaAnnual / 365;

  // Vega: S * e^(-qT) * sqrt(T) * N'(d1) / 100 (per 1% volatility change)
  const vega = stockPrice * expMinusQT * sqrtT * normPDF(d1) / 100;

  // Rho: K * T * e^(-rT) * N(d2) / 100 (per 1% rate change)
  const rho = strikePrice * timeToExpiry * expMinusRT * normCDF(d2) / 100;

  return { delta, gamma, theta, vega, rho };
}

/**
 * Calculate Greeks for a PUT option
 */
export function calculatePutGreeks(inputs: BlackScholesInputs): GreeksResult {
  const { stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividendYield = 0 } = inputs;

  // Handle edge cases
  if (timeToExpiry <= 0 || volatility <= 0 || stockPrice <= 0 || strikePrice <= 0) {
    return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
  }

  const { d1, d2 } = calculateD1D2(inputs);
  const sqrtT = Math.sqrt(timeToExpiry);

  const expMinusQT = Math.exp(-dividendYield * timeToExpiry);
  const expMinusRT = Math.exp(-riskFreeRate * timeToExpiry);

  // Delta: e^(-qT) * (N(d1) - 1) = -e^(-qT) * N(-d1)
  const delta = expMinusQT * (normCDF(d1) - 1);

  // Gamma: Same as call - e^(-qT) * N'(d1) / (S * sigma * sqrt(T))
  const gamma = expMinusQT * normPDF(d1) / (stockPrice * volatility * sqrtT);

  // Theta (annualized):
  // -[S * sigma * e^(-qT) * N'(d1)] / [2 * sqrt(T)] + r * K * e^(-rT) * N(-d2) - q * S * e^(-qT) * N(-d1)
  const thetaAnnual =
    -(stockPrice * volatility * expMinusQT * normPDF(d1)) / (2 * sqrtT)
    + riskFreeRate * strikePrice * expMinusRT * normCDF(-d2)
    - dividendYield * stockPrice * expMinusQT * normCDF(-d1);

  // Convert to daily theta
  const theta = thetaAnnual / 365;

  // Vega: Same as call - S * e^(-qT) * sqrt(T) * N'(d1) / 100
  const vega = stockPrice * expMinusQT * sqrtT * normPDF(d1) / 100;

  // Rho: -K * T * e^(-rT) * N(-d2) / 100 (per 1% rate change)
  const rho = -strikePrice * timeToExpiry * expMinusRT * normCDF(-d2) / 100;

  return { delta, gamma, theta, vega, rho };
}

/**
 * Convert days to expiry to years (fraction)
 */
export function daysToYears(days: number): number {
  return days / 365;
}

/**
 * Calculate days until expiry from expiration date string
 */
export function calculateDaysToExpiry(expiryDateStr: string): number {
  const expiry = new Date(expiryDateStr + "T16:00:00"); // Options expire at 4 PM ET
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Get current risk-free rate (hardcoded, can be enhanced to fetch dynamically)
 * Current ~4.5% based on 10-year Treasury yield
 */
export function getRiskFreeRate(): number {
  return 0.045;
}
