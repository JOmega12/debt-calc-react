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

      const { currentPayment, minPayment, remDebt, debtInfo} = this.state;
      console.log(remDebt, 'remdebt')
      console.log(currentPayment, 'current payment')

      const currentPay = +this.state.currentPayment;
      console.log(currentPay, 'cp');
      console.log(debtInfo.intPerMonth, 'debt info interest/month');

      //this is subtracting from the interest of the total minimum payment
      const principle = (+currentPay - debtInfo.intPerMonth);
      console.log(+principle, 'principle'); 

      const remainder = (debtInfo.totalDebt - principle).toFixed(2);

      // this.setState({remDebt: +remainder});
      console.log(remainder, 'remainder');

      //it has something to do with comparing the strings of the input.
      //so how do make the string in the state become a number? 

      console.log(debtInfo.intPerMonth,'int per month')
      //this looks like i need to put the total of my loan into a variable state and access it from there
      if (currentPayment >= minPayment) {
         const newItem = {
            currentPayment: +currentPay,
            remDebt: remainder,
            id: Date.now(),
         };
   
         this.setState((state) => ({
            payHistory: [...state.payHistory, newItem],
            currentPayment: 0,
            remDebt: remainder,
            id: '',
         }));
      } else if (currentPayment < minPayment) {
         this.setState({currentPayment: 0});
         alert(`Payment must be greater than or equal to the minimum payment (${minPayment})`);
      } else if (currentPayment > this.state.loan) {
         this.setState({currentPayment: 0});
         alert(`Your payment is over the the loan!`);
      } else if(currentPayment === 0) {
         this.setState({currentPayment: 0});
         alert(`You must pay the minimum payment (${minPayment})`);
      }

      //for te comparisons, covert the variables where the inputs are being held into numbers! 
      //then do a boolean to see if the statements are true. try to put that there and see where it goes
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
                     autoComplete="off"/>
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