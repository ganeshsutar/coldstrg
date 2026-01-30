import { forwardRef } from "react";
import type { PaySATTN } from "../../types";
import { formatCurrency, formatMonthYear } from "../../utils";

interface PayslipPreviewProps {
  salary: PaySATTN;
  companyName?: string;
  companyAddress?: string;
}

function numberToWords(num: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  if (num === 0) return "Zero";

  const convertHundreds = (n: number): string => {
    let result = "";
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      result += ones[n] + " ";
    }
    return result;
  };

  const rounded = Math.round(num);
  if (rounded >= 10000000) {
    return `${convertHundreds(Math.floor(rounded / 10000000))}Crore ${numberToWords(rounded % 10000000)}`;
  }
  if (rounded >= 100000) {
    return `${convertHundreds(Math.floor(rounded / 100000))}Lakh ${numberToWords(rounded % 100000)}`;
  }
  if (rounded >= 1000) {
    return `${convertHundreds(Math.floor(rounded / 1000))}Thousand ${numberToWords(rounded % 1000)}`;
  }
  return convertHundreds(rounded).trim();
}

export const PayslipPreview = forwardRef<HTMLDivElement, PayslipPreviewProps>(
  function PayslipPreview(
    { salary, companyName = "Cold Storage Pvt. Ltd.", companyAddress },
    ref
  ) {
    const periodStr = formatMonthYear(salary.year, salary.month);
    const netPayInWords = numberToWords(salary.netSalary) + " Rupees Only";

    return (
      <div ref={ref} className="bg-white p-8 max-w-3xl mx-auto text-black print:p-0">
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-4 mb-4">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          {companyAddress && (
            <p className="text-sm text-gray-600">{companyAddress}</p>
          )}
          <h2 className="text-lg font-semibold mt-2">SALARY SLIP</h2>
          <p className="text-sm">For the month of {periodStr}</p>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p>
              <span className="font-medium">Employee Name:</span>{" "}
              {salary.employeeName}
            </p>
            <p>
              <span className="font-medium">Employee Code:</span>{" "}
              {salary.employeeCode}
            </p>
            <p>
              <span className="font-medium">Designation:</span>{" "}
              {salary.postName || "-"}
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-medium">Working Days:</span>{" "}
              {salary.workingDays}
            </p>
            <p>
              <span className="font-medium">Days Present:</span>{" "}
              {salary.presentDays + salary.halfDays * 0.5}
            </p>
            <p>
              <span className="font-medium">Days Absent:</span>{" "}
              {salary.absentDays}
            </p>
          </div>
        </div>

        {/* Earnings & Deductions Table */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Earnings */}
          <div className="border border-black">
            <div className="bg-gray-200 px-3 py-2 font-semibold border-b border-black">
              EARNINGS
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="px-3 py-1">Basic Salary</td>
                  <td className="px-3 py-1 text-right">
                    {formatCurrency(salary.basicSalary)}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-3 py-1">Allowances</td>
                  <td className="px-3 py-1 text-right">
                    {formatCurrency(salary.totalAllowances)}
                  </td>
                </tr>
                {salary.otAmount > 0 && (
                  <tr className="border-b border-gray-300">
                    <td className="px-3 py-1">Overtime</td>
                    <td className="px-3 py-1 text-right">
                      {formatCurrency(salary.otAmount)}
                    </td>
                  </tr>
                )}
                <tr className="font-semibold bg-gray-100">
                  <td className="px-3 py-2">Gross Salary</td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(salary.grossSalary)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div className="border border-black">
            <div className="bg-gray-200 px-3 py-2 font-semibold border-b border-black">
              DEDUCTIONS
            </div>
            <table className="w-full text-sm">
              <tbody>
                {salary.pfAmount > 0 && (
                  <tr className="border-b border-gray-300">
                    <td className="px-3 py-1">Provident Fund (PF)</td>
                    <td className="px-3 py-1 text-right">
                      {formatCurrency(salary.pfAmount)}
                    </td>
                  </tr>
                )}
                {salary.esiAmount > 0 && (
                  <tr className="border-b border-gray-300">
                    <td className="px-3 py-1">ESI</td>
                    <td className="px-3 py-1 text-right">
                      {formatCurrency(salary.esiAmount)}
                    </td>
                  </tr>
                )}
                {salary.tdsAmount > 0 && (
                  <tr className="border-b border-gray-300">
                    <td className="px-3 py-1">TDS</td>
                    <td className="px-3 py-1 text-right">
                      {formatCurrency(salary.tdsAmount)}
                    </td>
                  </tr>
                )}
                {salary.loanDeduction > 0 && (
                  <tr className="border-b border-gray-300">
                    <td className="px-3 py-1">Loan EMI</td>
                    <td className="px-3 py-1 text-right">
                      {formatCurrency(salary.loanDeduction)}
                    </td>
                  </tr>
                )}
                {salary.totalDeductions > 0 && (
                  <tr className="border-b border-gray-300">
                    <td className="px-3 py-1">Other Deductions</td>
                    <td className="px-3 py-1 text-right">
                      {formatCurrency(salary.totalDeductions)}
                    </td>
                  </tr>
                )}
                <tr className="font-semibold bg-gray-100">
                  <td className="px-3 py-2">Total Deductions</td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(
                      salary.pfAmount +
                        salary.esiAmount +
                        salary.tdsAmount +
                        salary.loanDeduction +
                        salary.totalDeductions
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Pay */}
        <div className="border-2 border-black p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">NET PAY</span>
            <span className="text-2xl font-bold text-green-700">
              {formatCurrency(salary.netSalary)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Amount in words: {netPayInWords}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-sm mt-8">
          <div>
            <p className="font-medium mb-8">Employee Signature</p>
            <div className="border-t border-black w-40 pt-1">
              {salary.employeeName}
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium mb-8">Authorized Signatory</p>
            <div className="border-t border-black w-40 pt-1">
              For {companyName}
            </div>
          </div>
        </div>

        {/* Print Notice */}
        <p className="text-xs text-gray-500 text-center mt-8 print:hidden">
          This is a computer-generated payslip and does not require a signature.
        </p>
      </div>
    );
  }
);
