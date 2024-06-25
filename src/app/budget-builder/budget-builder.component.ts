import { Component } from '@angular/core';

@Component({
  selector: 'app-budget-builder',
  templateUrl: './budget-builder.component.html',
  styleUrl: './budget-builder.component.scss'
})
export class BudgetBuilderComponent {
  months: string[] = ['January 2024', 'February 2024', 'March 2024', 'April 2024', 'May 2024', 'June 2024'];
  incomeCategories: { name: string, values: number[] }[] = [
    { name: 'Sales', values: [100, 120, 10, 20, 40, 122] },
    { name: 'Commission', values: [200, 400, 500, 550, 250, 222] },
    { name: 'Training', values: [0, 200, 200, 500, 400, 100] },
    { name: 'Consulting', values: [500, 550, 120, 130, 140, 150] }
  ];
  expenseCategories: { name: string, values: number[] }[] = [
    { name: 'Management Fees', values: [100, 200, 200, 500, 400, 100] },
    { name: 'Cloud Hosting', values: [200, 400, 120, 130, 140, 150] }
  ];
  incomeTotals: { [key: string]: number } = {};
  expenseTotals: { [key: string]: number } = {};
  profitLoss: { [key: string]: number } = {};
  closingBalance: { [key: string]: number } = {};

  constructor() {
    this.updateTotals();
  }



  handleNewValueOnAddingMonth(keyName:string,object:any){
    object[keyName] = 0;
  }

  addIncomeCategory() {
    this.incomeCategories.push({ name: '', values: Array(this.months.length).fill(0) });
  }

  addExpenseCategory() {
    this.expenseCategories.push({ name: '', values: Array(this.months.length).fill(0) });
  }

  deleteIncomeCategory(index: number) {
    this.incomeCategories.splice(index, 1);
    this.updateTotals();
  }

  deleteExpenseCategory(index: number) {
    this.expenseCategories.splice(index, 1);
    this.updateTotals();
  }

  updateTotals() {
    this.incomeTotals = this.calculateTotals(this.incomeCategories);
    this.expenseTotals = this.calculateTotals(this.expenseCategories);
    this.calculateProfitLoss();
  }

  calculateTotals(categories: { name: string, values: number[] }[]): { [key: string]: number } {
    const totals: { [key: string]: number } = {};
    this.months.forEach((month, index) => {
      totals[month] = categories.reduce((sum, category) => sum + category.values[index], 0);
    });
    return totals;
  }

  calculateProfitLoss() {
    this.months.forEach(month => {
      this.profitLoss[month] = (this.incomeTotals[month] || 0) - (this.expenseTotals[month] || 0);
    });
    this.calculateClosingBalance();
  }

  calculateClosingBalance() {
    let balance = 0;
    this.months.forEach((month, index) => {
      balance += this.profitLoss[month] || 0;
      this.closingBalance[month] = balance;
    });
  }

  getRowTotal(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0);
  }

  getIncomeTotalSum(): number {
    return this.getRowTotal(Object.values(this.incomeTotals));
  }

  getExpenseTotalSum(): number {
    return this.getRowTotal(Object.values(this.expenseTotals));
  }

  getProfitLossSum(): number {
    return this.getRowTotal(Object.values(this.profitLoss));
  }

  addMonth() {

    const lastIndex = this.months[this.months.length - 1];
    const [monthStr, yearStr] = lastIndex.split(' ');
    const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth();
    let year = parseInt(yearStr);


    let nextMonth = month + 1;
    if (nextMonth > 11) {
      nextMonth = 0;
      year += 1;
    }


    let nextMonthStr = new Date(year, nextMonth).toLocaleString('default', { month: 'long' });
    let newDateStr = `${nextMonthStr} ${year}`;
  
    this.months.push(newDateStr);
    this.incomeCategories.forEach(x => x.values.push(0))
    this.expenseCategories.forEach(x => x.values.push(0))
    this.handleNewValueOnAddingMonth(newDateStr,this.incomeTotals)
    this.handleNewValueOnAddingMonth(newDateStr,this.expenseTotals)
    this.handleNewValueOnAddingMonth(newDateStr,this.profitLoss)
    this.handleNewValueOnAddingMonth(newDateStr,this.closingBalance)
  }
}
