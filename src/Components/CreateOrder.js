import React from 'react'
import StripeCheckout from 'react-stripe-checkout';

function CreateOrder() {

  const onToken = (token) => {
   console.log(token)
  }

  return (
    <div>
      <StripeCheckout
       token = {onToken}
       stripeKey = "pk_test_51MJZ1KSB9uQMp7kpVr3EVPsGdDqnHFRiLsi5dAuNaLqgJSUEFk7RB8sV2zIiZHF3IxmKstQ6IqTNSEBhB7zJBGVf00RdHIGoiv"
      />
         
    </div>
  )
}

export default CreateOrder
