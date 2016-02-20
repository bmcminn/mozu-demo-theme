define([
    'modules/jquery-mozu',
    'modules/backbone-mozu',
    'modules/models-cart'
  ],

  function ($, Backbone, CartModels) {

    // declare a MozuView that can rewrite its contents with a Hypr template
    var SoftCartView = Backbone.MozuView.extend({

      templateName: "modules/soft-cart/soft-cart",

      goToCart: function () {
        window.location = "/cart";
        return false;
      },

      changeQuantity: function (e, amt) {
        var $qtyField = $(e.currentTarget),
          id = $qtyField.data('mz-cart-item'),
          item = this.model.get("items").get(id);
        item.set('quantity', item.get('quantity') + amt);
        return item.saveQuantity();
      },

      increaseQuantity: function (e) {
        return this.changeQuantity(e, 1);
      },

      decreaseQuantity: function (e) {
        return this.changeQuantity(e, -1);
      },

      removeItem: function (e) {
        var $removeButton = $(e.currentTarget),
          id = $removeButton.data('mz-cart-item');
        this.model.removeItem(id);
        return false;
      }
    });

    // accessors for other modules
    var SoftCartInstance = {

      update: function () {
        // populate the cart model asynchronously from the api
        return this.model.apiGet();
      },

      show: function () {

        this.view.$el.addClass('is-active');

        var self = this;
        // dismisser method so that a click away will hide the softcart
        var clickAway = function (e) {
          if (self.view.el !== e.target && !$.contains(self.view.el, e.target)) {
            self.view.$el.removeClass('is-active');
            $(document.body).off('click', clickAway);
          }
        };

        $(document.body).on('click', clickAway);
      },

      highlightItem: function (itemid) {
        this.view.$('.soft-cart-item[data-mz-cart-item="' + itemid + '"]')
          .removeClass('highlight')
          .addClass('highlight');
      }
    };


    $(document).ready(function () {

      // create a blank cart model
      SoftCartInstance.model = new CartModels.Cart();

      // instantiate your view!
      SoftCartInstance.view = new SoftCartView({
        el: $('[data-mz-role="soft-cart"]'),
        model: SoftCartInstance.model
      });

      // bind a method we'll be using for the promise
      SoftCartInstance.show = $.proxy(SoftCartInstance.show, SoftCartInstance);

      // bind cart links to open the softcart instead
      $(document.body).on('click', 'a[href="/cart"]', function (e) {
        e.preventDefault();
        SoftCartInstance.update().then(SoftCartInstance.show);
      });

    });

    // export the singleton
    return SoftCartInstance;

  });
