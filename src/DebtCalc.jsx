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

   /* const {target} = e;
   const {value, name} = target */


//this saves the dry principle and uses the loan, interest and current payment as state
//on the onchange
   handleChange = ({target: {value, name}}) =>{
      this.setState({[name]: value});
      // this.currentPayment();
      // this.handlePayment();
   };
   

   currentPayment = (e) => {
      e.preventDefault();

//this handles the edge case if the user has <$100 in loan left
      if (this.state.loan > 100) {

         const initialPay = this.state.loan * .01;
         const interestPercentage = (this.state.interest / 100) / 12;
         const interestReverse = (this.state.loan/ this.state.interest) / 12;
   
         const secondPay = this.state.loan * interestPercentage;
         const totalPay = (+initialPay + +secondPay).toFixed(0);
         const monthlyPay = (+this.state.loan / totalPay).toFixed(2);

         const updatedInfo = {
            intPerMonth: interestReverse,
            totalDebt: this.state.loan
         }
         console.log(updatedInfo.intPerMonth, 'intPerMonth');

         this.setState({minPayment: totalPay, monthlyPayment: monthlyPay, debtInfo: updatedInfo})
      } 
      
      else if (this.state.loan <= 100) {

         const initialPay = this.state.loan * .01;

         const interestPercentage = (this.state.interest / 100) / 12;
         const interestReverse = (this.state.loan/ this.state.interest) / 12;

         const secondPay = this.state.loan * interestPercentage;
         const totalPay = +initialPay + +secondPay;
         const monthlyPay = +this.state.loan / totalPay;

         const updatedInfo = {
            intPerMonth: interestReverse,
            totalDebt: this.state.loan
         }

         this.setState({minPayment: initialPay, monthlyPayment: monthlyPay, debtInfo: updatedInfo})
      }
   }


   //where would this function go?
   handleStateRemDebt = (currentPay) => {
   
      this.setState({currentPayment: currentPay})

   }

   handleSubmit = (e) => {
      e.preventDefault();

      const { currentPayment, minPayment, remDebt, debtInfo} = this.state;
      console.log(remDebt, 'remdebt')
      console.log(currentPayment, 'current payment')


      //this is subtracting from the interest of the total minimum payment
      const principle = (currentPayment - debtInfo.intPerMonth);
      console.log(principle, 'principle'); 

      const remainder = (debtInfo.totalDebt - principle).toFixed(2);

      this.setState({remDebt: remainder});
      console.log(remainder, 'remainder');

      console.log(debtInfo.intPerMonth,'int per month')
      //this looks like i need to put the total of my loan into a variable state and access it from there
      if (currentPayment >= minPayment) {
         const newItem = {
            currentPayment: currentPayment,
            remDebt: remainder,
            id: Date.now(),
         };
   
         this.setState((state) => ({
            payHistory: [...state.payHistory, newItem],
            currentPayment: 0,
            remDebt: remainder,
            id: '',
         }));
      } 
      
      else if (currentPayment < minPayment) {
         this.setState({currentPayment: 0})
         alert(`Payment must be greater than or equal to the minimum payment (${minPayment})`)
      }

   }


   render() {
      return (
         <div>
            <h2 class="debt-calc-h2">Debt Calculator</h2>

            <form onSubmit= {this.handleSubmit}>

               <div class="calculate-form">

                  <div className="first-column">


                  <label htmlFor="">Loan Amount</label><br />
                  <input 
                  name="loan"
                  type="number" 
                  onChange={this.handleChange}
                  autoComplete ="off"
                  value={this.state.loan}
                  /><br />
                  
                  <label htmlFor="">Interest Rate</label>
                  <br />
                  <input type="number"
                  name="interest"
                  onChange={this.handleChange}
                  autoComplete ="off"
                  value={this.state.interest}
                  /><br />

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