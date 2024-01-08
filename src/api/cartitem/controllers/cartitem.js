const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cartitem.cartitem', ({ strapi }) => ({
    // Method 1: Creating an entirely custom action

    async create(ctx) {
        try {
            console.log("server mein ghus gya");
            console.log('Received request:', ctx.request.body);
            const { subtoken, prodid, quant } = ctx.request.body;
            console.log('yeh')
            console.log('prodid:', prodid);
            console.log('quant:', quant);
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

            // Create a new authuser entry with the subtoken
            else {

                const newAuthUser = await strapi.entityService.create('api::authuser.authuser', {
                    data: {
                        subtoken: subtoken,
                        // Other fields in the authuser collection
                    }
                });
                authUserId = newAuthUser.id;
            }



            console.log('authUserId:', authUserId);
            // Add your logic to create a new cart item in the database
            console.log('Before creating new cart item');


            // const existingProduct = await strapi.entityService.findMany('api::cartitem.cartitem', {
            //     fields: ['id', 'prodid', 'quant'],
            //     filters: { prodid: prodid },
            // });

            const existingProduct = await strapi.entityService.findOne('api::authuser.authuser', authUserId, {
                populate: {
                    cartitems: {
                        fields: ['prodid', 'quant'], // Specify the fields you want to retrieve from cartitems
                        filters: { prodid: prodid }, // Add any filters if needed
                        sort: 'createdAt:asc', // Sort the results based on createdAt in ascending order
                    },
                },
            }
            );
            console.log('prodddd', prodid);
            console.log('existingproduct', existingProduct);

            let oldCartItem;

            if (existingProduct && existingProduct.cartitems && existingProduct.cartitems.length > 0) {

                oldCartItem = existingProduct.cartitems;



                console.log('Using existing Product ID:', oldCartItem);

                const oldCartItemId = oldCartItem[0].id;

               console.log('Using existing Product ID:', oldCartItemId);



               if(quant===0){
                const del = await strapi.entityService.delete('api::cartitem.cartitem', oldCartItemId);
                ctx.send(del);

               }

               else{

                   // Calculate the new quantity by adding the existing quantity and the new quantity
                   const newQuantValue = oldCartItem[0].quant + quant;
    
                   const newQuant = await strapi.entityService.update('api::cartitem.cartitem', oldCartItemId, {
                       data: {
                           quant: newQuantValue,
                       },
                   });
    
                   ctx.send(newQuant);
               }

            }
            else {
                console.log('chala ki nhi');
                const newCartItem = await strapi.entityService.create('api::cartitem.cartitem', {

                    data: {
                        prodid: prodid,
                        quant: quant,
                        authuser: authUserId, // Reference to the authuser entry ID

                    }
                });
                console.log('After creating new cart item');
                console.log('New Cart Item:', newCartItem);

                ctx.send(newCartItem);
            }

        } catch (error) {
            console.error('Error adding to cart server:', error);

            if (error.data && error.data.errors) {
                // Handle validation errors
                ctx.status = 400; // Bad Request
                ctx.send({ error: 'Validation error', details: error.data.errors });
            } else {
                // Handle other errors
                ctx.status = 500; // Internal Server Error
                ctx.send({ error: 'Error adding to cart server' });
            }
        }
    },


    

}));
