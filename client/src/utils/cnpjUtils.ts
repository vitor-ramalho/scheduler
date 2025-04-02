export const formatCNPJ = (value: string): string => {
  const digits = value.replace(/\D/g, ""); // Remove non-numeric characters
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18); // Limit to CNPJ length
};

export const validateCNPJ = (value: string): boolean => {
  const digits = value.replace(/\D/g, ""); // Remove non-numeric characters
  if (digits.length !== 14) return false;

  // Basic validation for repeated numbers
  if (/^(\d)\1+$/.test(digits)) return false;

  // Validate CNPJ checksum
  const calcCheckDigit = (base: string, weights: number[]): number => {
    const sum = base
      .split("")
      .reduce((acc, digit, index) => acc + parseInt(digit) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = digits.slice(0, 12);
  const firstCheckDigit = calcCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondCheckDigit = calcCheckDigit(
    base + firstCheckDigit,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return (
    firstCheckDigit === parseInt(digits[12]) &&
    secondCheckDigit === parseInt(digits[13])
  );
};
