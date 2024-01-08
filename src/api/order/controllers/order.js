const { createCoreController } = require('@strapi/strapi').factories;
const crypto = require('crypto');
const axios = require('axios');
// const { salt_key } = require('../../../../config/secret');
const salt_key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
module.exports = createCoreController('api::order.order', ({ strapi }) => ({

  async create(ctx) {
    try {
      console.log("order phla server");
      console.log('Received request:', ctx.request.body);
      const { subtoken, products, amount } = ctx.request.body;
      console.log('yeh')
      console.log('subtoken:', subtoken);
      console.log('products:', products);
      console.log('dekh');

      const existingAuthUser = await strapi.entityService.findMany('api::authuser.authuser', {

        fields: ['subtoken'],
        filters: { subtoken: subtoken },
        // sort: { createdAt: 'DESC' },
        // populate: { category: true },
      });


      console.log("sahi bata de", existingAuthUser);
      let authUserId;

      if (existingAuthUser && existingAuthUser.length > 0 && existingAuthUser[0].id) {
        authUserId = existingAuthUser[0].id;
        console.log('Using existing AuthUser ID:', authUserId);
      }
      console.log("productsjson", products);
      const newOrder = await strapi.entityService.create('api::order.order', {

        data: {
          authuser: authUserId,
          products: products,
          amount: amount, // Reference to the authuser entry ID

        }
      });
      console.log('After creating new phla order item');
      console.log('newOrder:', newOrder);

      ctx.send(newOrder);


    } catch (error) {
      console.error('Error adding to order phla server:', error);

      if (error.data && error.data.errors) {
        // Handle validation errors
        ctx.status = 400; // Bad Request
        ctx.send({ error: 'Validation error', details: error.data.errors });
      } else {
        // Handle other errors
        ctx.status = 500; // Internal Server Error
        ctx.send({ error: 'Error adding to order phla server' });
      }
    }
  },

  async update(ctx) {
    try {
      console.log("order update server");
      console.log('Received request:', ctx.request.body);
      const { authUserId,
        name,
        email,
        phoneNumber,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode } = ctx.request.body;
      console.log('yeh')
      console.log('authUserid:', authUserId);
      console.log('email:', email);
      console.log('dekh');

      const existingOrder = await strapi.entityService.findOne('api::authuser.authuser', authUserId, {
        populate: {
          orders: {
            fields: ['orderid'], // Specify the fields you want to retrieve from cartitems
            // filters: { prodid: prodid }, // Add any filters if needed
            sort: 'createdAt:desc', // Sort the results based on createdAt in ascending order
          },
        },
      }
      );
      // console.log('orderid', orderid);
      console.log('existingOrder', existingOrder);





      const oldOrder = existingOrder.orders;



      console.log('Using existing Product ID:', oldOrder);

      const oldOrderId = oldOrder[0].id;

      console.log('Using existing Product ID:', oldOrderId);




      const updateOrder = await strapi.entityService.update('api::order.order', oldOrderId, {
        data: {
          name: name,
          email: email,
          number: phoneNumber,
          addressline1: addressLine1,
          addressline2: addressLine2,
          city: city,
          state: state,
          pincode: pincode,
        },
      });

      ctx.send(updateOrder);



    } catch (error) {
      console.error('Error adding to order dusra server:', error);

      if (error.data && error.data.errors) {
        // Handle validation errors
        ctx.status = 400; // Bad Request
        ctx.send({ error: 'Validation error', details: error.data.errors });
      } else {
        // Handle other errors
        ctx.status = 500; // Internal Server Error
        ctx.send({ error: 'Error adding to order phla server' });
      }
    }
  },





  async payment(ctx) {
    let checksum;
    try {
      console.log("server paymentwala");
      console.log("aya hua data", ctx.request.body);

      const merchantTransactionId = ctx.request.body.transactionId;

      const data = {
        merchantId: process.env.MID,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: ctx.request.body.MUID,
        name: ctx.request.body.name,
        amount: ctx.request.body.amount * 100,
        redirectUrl: process.env.STRAPI_URL + `/api/orders/checkStatus/${merchantTransactionId}`,
        redirectMode: 'POST',
        mobileNumber: ctx.request.body.number,
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };


      console.log("data", data);
      console.log("namakkk", salt_key);

      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const keyIndex = 1;
      const string = payloadMain + '/pg/v1/pay' + salt_key;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      checksum = sha256 + '###' + keyIndex;
      console.log("hello");
      console.log("payload", payload);
      console.log("payloadMain", payloadMain);
      console.log("salt_key", salt_key);
      console.log("string", string);
      console.log("sha256", sha256);
      console.log("checksum", checksum);



      const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
      // If you are in the PROD environment, update the URL to the PROD endpoint.
      // const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

      const options = {
        method: 'POST',
        url: prod_URL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        },
        data: {
          request: payloadMain
        }
      };
      console.log("options ke baad");

      try {
        const response = await axios.request(options);
        console.log("axios ke andarrr");
        console.log("yah hai data", response.data);
        return ctx.send(response.data.data.instrumentResponse.redirectInfo.url);
      } catch (error) {
        console.error("error ho hho gyaa", error);
        console.error("Error details axios ka:", error.response.data);
        // Handle error response or throw as needed
        ctx.throw(500, 'Internal Server Error order', { success: false, message: error.message });
      }
    } catch (error) {
      console.log("error aaya phlaa");
      ctx.throw(500, 'Internal Server Error order', { success: false, message: error.message });
    }
  },

  async checkStatus(ctx) {
    try {

      console.log("status check hora hai");
      console.log("aya hua stastus", ctx.request.body);
      const merchantTransactionId = ctx.request.body.transactionId;
      const merchantId = ctx.request.body.merchantId;
      console.log("merchantid hai", merchantId);
      console.log("merchantTransactionId hai", merchantTransactionId);

      const keyIndex = 1;
      const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + "###" + keyIndex;

      const options = {
        method: 'GET',
        // url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,

        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': `${merchantId}`
        }
      };

      // CHECK PAYMENT STATUS
      const response = await axios.request(options);

      if (response.data.success === true) {

        

        const url = process.env.LOOPLOVE_URL + `/success`;
        // Use ctx.redirect instead of res.redirect
        ctx.redirect(url);
      } else {
        const url = process.env.LOOPLOVE_URL + `/failure`;
        // Use ctx.redirect instead of res.redirect
        ctx.redirect(url);
      }
    } catch (error) {
      console.error(error);
    }
  },
}));
