import React from "react";


class PaymentHistory extends React.Component {

   render() {
      const {items} = this.props;

      return (
         <ul>
            {items.map((item) => (
               <li key={item.id}> Amount Payed: {item.currentPayment}, Remaining Amount: ${item.remDebt}  </li>
            ))}
         </ul>
      )
   }
}



export default PaymentHistory; 