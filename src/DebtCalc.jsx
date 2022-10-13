import React from "react";
import PaymentHistory from "./PaymentHistory";

class DebtCalc extends React.Component {

   constructor() {
      super();
      this.state = {
         loan: 0,
         interest: 0,
         payHistory: [],
         minPayment: 0,
         monthlyPayment: 0,
         currentPayment: 0,
         debtInfo: [],
         remDebt: 0,
         pay: false,
      }
   }


   //this creates a value for the number in the HTML
   handleChange = ({target: {value, name}}) =>{
      this.setState({[name]: value});
   };
   
   //this function handles the updated states constantly for
   //minimumPayment, MonthlyPayments, Total Loan Left
   handleState = (min, mon = 0, info) => {
      this.setState({minPayment:min, monthlyPayment:mon, debtInfo: info})
   }

   //this handles the calculation separate from the other two buttons- calculate and submit payment
   handleCalculations = (loan, interest) => {
      //this sets up the initial state
      const initialPay = loan * .01;

      //converting to interest 
      const actualInterestMonth= interest / 100;

      //how much interest per month for 12 months
      const interestPercentage = (interest / 100) / 12;

      //this is how much interest is paid per month
      const interestReverse = (loan* actualInterestMonth) / 12;

      //how much is the interest to add on top of the initial principle
      const secondPay = loan * interestPercentage;

      //this handles the edge case if the user has <$100 in loan left for calculations
      if (loan > 100) {
         const totalPay = (+initialPay + +secondPay).toFixed(0);
         const monthlyPay = (+loan / totalPay).toFixed(2);


         const updatedInfo = {
            intPerMonth: interestReverse,
            totalDebt: loan
         }

         return this.handleState(totalPay, monthlyPay, updatedInfo)
      }  
      else if (loan <= 100) {
         const totalPay = +initialPay + +secondPay;
         const monthlyPay = +loan / totalPay;

         const updatedInfo = {
            intPerMonth: interestReverse,
            totalDebt: loan
         }

         return this.handleState(totalPay, monthlyPay, updatedInfo)

      }
   }


   //this does the initial calculation
   currentPayment = (e) => {
      e.preventDefault();

      const {loan, interest} = this.state;

      this.handleCalculations(loan, interest);
   }


   //this handles the submit payment function along with automatically updating 
   //the variables from the initial function calculation
   handleSubmit = (e) => {
      e.preventDefault();

      const { currentPayment, minPayment, debtInfo, interest} = this.state;

      const currentPay = +this.state.currentPayment;
      const principle = (+currentPay - +debtInfo.intPerMonth);
      const remainder = +(debtInfo.totalDebt - principle).toFixed(2);

      if (+currentPayment >= +minPayment && +currentPayment <= +debtInfo.totalDebt) {
         const newItem = {
            currentPayment: +currentPay,
            remDebt: remainder,
            id: Date.now(),
         };

         this.setState((state) => ({
            payHistory: [...state.payHistory, newItem],
            currentPayment: 0,
            remDebt: +remainder,
            loan: remainder,
            id: '',
            pay: true,
         }), this.handleCalculations(remainder, interest));
         
      } else if (+currentPayment < +minPayment) {
         this.setState({currentPayment: +currentPay});
         alert(`Payment must be greater than or equal to the minimum payment (${minPayment})`);
      } else if (+currentPayment >= +debtInfo.totalDebt) {
         
         const newItem = {
            currentPayment: +currentPay,
            remDebt: remainder,
            id: Date.now(),
         };

         this.setState((state) => ({
            payHistory: [...state.payHistory, newItem],
            currentPayment: 0,
            remDebt: 0,
            loan: 0,
            monthlyPayment: 0,
            minPayment: 0,
            id: '',
            pay: true,
            debtInfo: [],
         }), this.currentPayment());
         alert(`You are now debt free!`);
      } else if(+currentPayment === 0) {
         this.setState({currentPayment: +currentPay});
         alert(`You must pay the minimum payment (${minPayment})`);
      }  
   }

   render() {
      const inputs = [
         {label: 'Loan Amount', name: 'loan'},
         {label: 'Interest Rate', name: 'interest',},
      ]
      return (
         <div>
            <h2 class="debt-calc-h2">Debt Calculator</h2>
            {/* <form onSubmit= {this.handleSubmit}> */}
            <form>
               <div class="calculate-form">
                  <div className="first-column">
                  {inputs.map(item => {
                     const {label, name} = item;
                     return(
                       <>
                        <label htmlFor="">{label}</label><br />
                        <input 
                        name={name}
                        type="number"
                        onChange={this.handleChange}
                        autoComplete ="off"
                        value={this.state[name]}
                        /><br />
                       </> 
                     )
                  })}
                  <button class="calculate" onClick={(e) => this.currentPayment(e)}>Calculate</button>
                  <br /><br />
                  <div> Current Loan: {this.state.loan}</div>
                  <div>Estimate Number of Payments: {this.state.monthlyPayment} </div>
                  <br />
                  <div>Minimum Payment: {this.state.minPayment}</div>
                  <br />
                  </div>
                  <div class="pay-here">
                     <div>Pay here:</div>
                     <input name="currentPayment"
                     type="number"
                     onChange={this.handleChange} 
                     value={this.state.currentPayment} 
                     autoComplete="off"              
                     />
                     <br />
                     <button class="make-payment" onClick={(e)=> this.handleSubmit(e)}>Make Payment</button>
                  </div>
               </div>

            </form>
            <div class="history-payments">
               <h4>History Payments</h4>
               <PaymentHistory items={this.state.payHistory}/>
            </div>
         </div>
      )
   }
}

export default DebtCalc;