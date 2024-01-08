
module.exports = {

    routes: [
      {
        method: 'POST',
        path: '/orders/pre',
        handler: 'order.create',
  
      },

      {
        method: 'POST',
        path: '/orders/update',
        handler: 'order.update',
  
      },

      {
        method: 'POST',
        path: '/orders/payment',
        handler: 'order.payment',
  
      },

      {
        method: 'POST',
        path: '/orders/checkStatus/:txnid',
        handler: 'order.checkStatus',
  
      },
      
    ]
  }
  
  
  