
// Format currency in Indian Rupees (INR)
export const formatPrice = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};

// Format large numbers in Indian format (with lakhs and crores)
export const formatIndianNumber = (num: number): string => {
  if (num >= 10000000) { // 1 crore or more
    return `${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) { // 1 lakh or more
    return `${(num / 100000).toFixed(2)} L`;
  } else {
    return num.toLocaleString('en-IN');
  }
};

// Format time remaining (mm:ss)
export const formatTimeRemaining = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
