


const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::authuser.authuser', ({ strapi }) => ({
    // Method 1: Creating an entirely custom action

    async find(ctx) {
        try {
            console.log("server mein ghus gya cart wale");
            const { subtoken } = ctx.request.body;
            console.log('Received request:', ctx.request.body);
            console.log('yeh')
            console.log('subtoken:', subtoken);
            console.log('dekh');
            const existingAuthUser = await strapi.entityService.findMany('api::authuser.authuser', {

                fields: ['subtoken'],
                filters: { subtoken: subtoken },
                // sort: { createdAt: 'DESC' },
                // populate: { category: true },
            });
            console.log(existingAuthUser);

            console.log("sahi bata de", existingAuthUser);
            let authUserId;

            if (existingAuthUser && existingAuthUser.length > 0 && existingAuthUser[0].id) {
                console.log(existingAuthUser[0]);
                authUserId = existingAuthUser[0].id;
                console.log('Using existing AuthUser ID:', authUserId);
            }




            console.log('authUserId:', authUserId);
            ctx.send({ authUserId });


        } catch (error) {
            console.error('Error auth ke server:', error);

            if (error.data && error.data.errors) {
                // Handle validation errors
                ctx.status = 400; // Bad Request
                ctx.send({ error: 'Validation error', details: error.data.errors });
            } else {
                // Handle other errors
                ctx.status = 500; // Internal Server Error
                ctx.send({ error: 'Error auth ke server:' });
            }
        }
    },

    async authcart(ctx) {
        try {
            console.log('ghusssssss');
          const { id } = ctx.params;
                console.log('ghusssssss');
          // Fetch AuthUser details based on authUserId
          const cartDetails = await strapi.entityService.findOne('api::authuser.authuser', id,{
           
            populate: ['cartitems'], // Adjust relation names based on your setup
          });
          console.log('crattt', cartDetails);
    
          ctx.send({ cartDetails });
        } catch (error) {
          ctx.send({ error: 'Error fetching AuthUser details' }, 500);
        }
      },

    // async get(ctx) {
    //             try {




    //             } catch (error) {
    //                 ctx.send({ error: 'Error fetching cart items' }, 500);
    //             }
    //         },


    // async exampleAction(ctx) {
    //     try {
    //         console.log('try mein hu');
    //         ctx.body = 'ok';
    //     } catch (err) {
    //         console.log('error mein hu');
    //         ctx.body = err;
    //     }
    // },


}));
