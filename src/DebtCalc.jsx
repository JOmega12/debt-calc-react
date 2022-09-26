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
         pay: false
      }
   }

   handleChange = ({target: {value, name}}) =>{
      this.setState({[name]: value});
      // this.currentPayment();
      // this.handlePayment();
   };
   
   currentPayment = (e) => {
      e.preventDefault();

      const initialPay = this.state.loan * .01;
      const actualInterestMonth= this.state.interest / 100;
      const interestPercentage = (this.state.interest / 100) / 12;
      const interestReverse = (this.state.loan* actualInterestMonth) / 12;
      const secondPay = this.state.loan * interestPercentage;

//this handles the edge case if the user has <$100 in loan left
      if (this.state.loan > 100) {
         const totalPay = (+initialPay + +secondPay).toFixed(0);
         const monthlyPay = (+this.state.loan / totalPay).toFixed(2);
/*          const updatedInfo = {
            intPerMonth: interestReverse,
            totalDebt: this.state.loan
         }; */
         // console.log(updatedInfo.intPerMonth, 'intPerMonth');

         this.setState({minPayment: totalPay, monthlyPayment: monthlyPay})
      }  
      else if (this.state.loan <= 100) {
         const totalPay = +initialPay + +secondPay;
         const monthlyPay = +this.state.loan / totalPay;

/*          const updatedInfo = {
            intPerMonth: interestReverse,
            totalDebt: this.state.loan
         } */

         this.setState({minPayment: totalPay, monthlyPayment: monthlyPay})
      }
      const updatedInfo = {
         intPerMonth: interestReverse,
         totalDebt: this.state.loan
      }
      this.setState({debtInfo: updatedInfo})
      // this.setState({minPayment: totalPay, monthlyPayment: monthlyPay, debtInfo: updatedInfo})

   }

   handleSubmit = (e) => {
      e.preventDefault();

      const { currentPayment, minPayment, debtInfo} = this.state;
      const currentPay = +this.state.currentPayment;
      const principle = (+currentPay - +debtInfo.intPerMonth);
      const remainder = +(debtInfo.totalDebt - principle).toFixed(2);
      if (+currentPayment >= +minPayment) {
         const newItem = {
            currentPayment: +currentPay,
            remDebt: remainder,
            id: Date.now(),
         };
   
         this.setState((state) => ({
            payHistory: [...state.payHistory, newItem],
            currentPayment: 0,
            remDebt: +remainder,
            id: '',
            pay: true,
         }));

      } else if (+currentPayment < +minPayment) {
         this.setState({currentPayment: +currentPay});
         alert(`Payment must be greater than or equal to the minimum payment (${minPayment})`);
      } else if (+currentPayment > +this.state.loan) {
         this.setState = {
            loan: 0,
            interest: 0,
            payHistory: [],
            minPayment: 0,
            monthlyPayment: 0,
            currentPayment: 0,
            debtInfo: [],
            remDebt: 0,
            pay: false
         }
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
            <form onSubmit= {this.handleSubmit}>
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
                     <button class="make-payment">Make Payment</button>
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