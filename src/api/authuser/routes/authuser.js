
module.exports = {

    routes: [
        
          {
            method: 'POST',
            path: '/authusers/findauthser',
            handler: 'authuser.find',

          },

          {
            "method": "GET",
            "path": "/authusers/findcart/:id",
            "handler": "authuser.authcart"
          }

        //   {
        //     method: 'GET',
        //     path: '/authusers/getauthuser',
        //     handler: 'authuser.get',

        //   },

        //   {
        //     method: 'GET',
        //     path: '/cartitems/:id',
        //     handler: 'cartitem.findOne',

        //   },

        //   {
        //     method: 'DELETE',
        //     path: '/cartitems/:id',
        //     handler: 'cartitem.delete',

        //   },
        //   {
        //     method: 'PUT',
        //     path: '/cartitem/:id',
        //     handler: 'cartitems.update',

        //   },


    ]
}


