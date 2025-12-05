"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { useFinance } from "@/context/FinanceContext"; // Import useFinance

const LoanAssessment: React.FC = () => {
  const { userProfile } = useFinance(); // Use useFinance hook to get user profile

  const [gender, setGender] = useState<string>("");
  const [dependents, setDependents] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [yearsOfService, setYearsOfService] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [loanType, setLoanType] = useState<string>("");
  const [totalDisbursedAmount, setTotalDisbursedAmount] = useState<string>("");
  const [netSalary, setNetSalary] = useState<string>("");
  const [takeHome, setTakeHome] = useState<string>("");
  const [totalEmiAmount, setTotalEmiAmount] = useState<string>("");
  const [installmentScore, setInstallmentScore] = useState<string>("");
  const [cibil, setCibil] = useState<string>("");
  const [overduePrincipal, setOverduePrincipal] = useState<string>("");
  const [overdueInterest, setOverdueInterest] = useState<string>("");
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);
  const [fraudDetectionResult, setFraudDetectionResult] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      // Pre-fill age and net salary from user profile if available
      // For age, we'll assume a default or ask the user to input it in profile setup if needed.
      // For now, we'll leave age as a manual input or set a placeholder.
      // For net salary, we'll use the current balance as a proxy for demonstration.
      setNetSalary(userProfile.balance.toString());
      // If you had an 'age' field in userProfile, you could setAge(userProfile.age.toString());
    }
  }, [userProfile]);

  const handleAssessLoan = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate loan assessment logic
    const salary = parseFloat(netSalary);
    const emi = parseFloat(totalEmiAmount);
    const cibilScore = parseFloat(cibil);
    const ageNum = parseFloat(age);

    if (isNaN(salary) || isNaN(emi) || isNaN(cibilScore) || isNaN(ageNum)) {
      showError("Please enter valid numbers for financial fields.");
      setAssessmentResult(null);
      setFraudDetectionResult(null);
      return;
    }

    let result = "Loan Approved!";
    let fraud = "No fraud detected.";

    if (cibilScore < 600) {
      result = "Loan Denied: CIBIL score too low.";
    } else if (emi / salary > 0.4) { // EMI should not exceed 40% of net salary
      result = "Loan Denied: High EMI to salary ratio.";
    } else if (ageNum < 21 || ageNum > 60) {
      result = "Loan Denied: Age out of eligible range.";
    }

    // Simple fraud detection simulation
    if (parseFloat(overduePrincipal) > 0 || parseFloat(overdueInterest) > 0) {
      fraud = "Potential fraud detected: Overdue amounts present.";
    } else if (parseFloat(totalDisbursedAmount) > salary * 10 && loanType === "Personal Loan") {
      fraud = "Potential fraud detected: Disbursed amount seems unusually high compared to salary for a personal loan.";
    }

    setAssessmentResult(result);
    setFraudDetectionResult(fraud);
    showSuccess("Loan assessment complete!");
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Loan Assessment</CardTitle>
          <CardDescription>
            Enter the details to assess loan eligibility and detect potential fraud.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssessLoan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dependents">Dependents</Label>
              <Input
                id="dependents"
                type="number"
                placeholder="0"
                value={dependents}
                onChange={(e) => setDependents(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="yearsOfService">Years of Service</Label>
              <Input
                id="yearsOfService"
                type="number"
                placeholder="3"
                value={yearsOfService}
                onChange={(e) => setYearsOfService(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select value={maritalStatus} onValueChange={setMaritalStatus} required>
                <SelectTrigger id="maritalStatus">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loanType">Loan Type</Label>
              <Select value={loanType} onValueChange={setLoanType} required>
                <SelectTrigger id="loanType">
                  <SelectValue placeholder="Select Loan Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                  <SelectItem value="Home Loan">Home Loan</SelectItem>
                  <SelectItem value="Business Loan">Business Loan</SelectItem>
                  <SelectItem value="Car Loan">Car Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalDisbursedAmount">Total Disbursed Amount (₹)</Label>
              <Input
                id="totalDisbursedAmount"
                type="number"
                placeholder="200000.00"
                value={totalDisbursedAmount}
                onChange={(e) => setTotalDisbursedAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="netSalary">Net Salary (₹)</Label>
              <Input
                id="netSalary"
                type="number"
                placeholder="80000.00"
                value={netSalary}
                onChange={(e) => setNetSalary(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="takeHome">Take-home (₹)</Label>
              <Input
                id="takeHome"
                type="number"
                placeholder="48000.00"
                value={takeHome}
                onChange={(e) => setTakeHome(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalEmiAmount">Total EMI Amount (₹)</Label>
              <Input
                id="totalEmiAmount"
                type="number"
                placeholder="5000.00"
                value={totalEmiAmount}
                onChange={(e) => setTotalEmiAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="installmentScore">Installment Score (0-100)</Label>
              <Input
                id="installmentScore"
                type="number"
                placeholder="70.00"
                value={installmentScore}
                onChange={(e) => setInstallmentScore(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cibil">CIBIL (300-900)</Label>
              <Input
                id="cibil"
                type="number"
                placeholder="650.00"
                value={cibil}
                onChange={(e) => setCibil(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="overduePrincipal">Overdue Principal (₹)</Label>
              <Input
                id="overduePrincipal"
                type="number"
                placeholder="0.00"
                value={overduePrincipal}
                onChange={(e) => setOverduePrincipal(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="overdueInterest">Overdue Interest (₹)</Label>
              <Input
                id="overdueInterest"
                type="number"
                placeholder="0.00"
                value={overdueInterest}
                onChange={(e) => setOverdueInterest(e.target.value)}
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <Button type="submit" className="w-full">
                Assess Loan & Detect Fraud
              </Button>
            </div>
          </form>
          {assessmentResult && (
            <div className="mt-6 p-4 border rounded-md bg-muted">
              <h3 className="font-semibold text-lg mb-2">Assessment Results:</h3>
              <p>{assessmentResult}</p>
              <p className="mt-2">{fraudDetectionResult}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanAssessment;