import React from "react";


const PaymentHistory= ({items}) =>  (
         <ul>
            {items.map((item) => (
               <li key={item.id}> Amount Payed: {item.currentPayment}, Remaining Amount: ${item.remDebt}  </li>
            ))}
         </ul>
      )

export default PaymentHistory; 