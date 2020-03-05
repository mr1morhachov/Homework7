/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var js2 = require('./PizzaMenu');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart-list");
var $cartup = $("#cart");

function addToCart(pizza, size) {
    
    var enable = false;
    //Додавання однієї піци в кошик покупок
    for(var i = 0; i < Cart.length; i++) {
        if(Cart[i].pizza.id == pizza.id && Cart[i].size == size) {
            ++Cart[i].quantity;
            enable = true;
            break;
        }
    }
    //Приклад реалізації, можна робити будь-яким іншим способом
    if(!enable) {
    Cart.push({
        pizza: pizza,
        size: size,
        quantity: 1
    });
    }
    var order = $cartup.find(".orange-icon").text();
    var price = $cartup.find(".text-price2").text();
    order = parseInt(order)+1;
    
    
    if(size == "small_size")
        price = parseInt(price) + parseInt(pizza.small_size.price);
    else
        price = parseInt(price) + parseInt(pizza.big_size.price);
    
    $(".orange-icon").text(order);
    $cartup.find(".text-price2").text(price);
    
                $("#button-buy").css("opacity",	"1");
                $("#button-buy").css("pointer-events", "all");
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    var pizza_name = cart_item.pizza;
    var pizza_size = cart_item.size;
    var newCart = [];
    for(var i = 0, j = 0; j< Cart.length; i++, j++) {
        if((Cart[j].pizza != pizza_name) || (Cart[j].size != pizza_size)) {
            newCart[i] = Cart[j];
        }
        else
            --i;
    }
    Cart = newCart;
    //Після видалення оновити відображення
    updateCart();
}
    
    function removeAllCart() {
    //Видалити все з кошика
    var newCart = [];
    Cart = newCart;
    //Після видалення оновити відображення
    updateCart();
}
    
    
    function localstorage() {
        
        //set
        var JSONCart = JSON.stringify(Cart);
        var JSONNumber = $(".cash_main").text();
        var JSONCash = $(".text-price2").text();
        localStorage.setItem("Cart",JSONCart);
        localStorage.setItem("Amount",JSONNumber);
        localStorage.setItem("Cash",JSONCash);
    }

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    

      //get
    var saved_orders =	JSON.parse(localStorage.getItem("Cart"));
        if(saved_orders)	{
            Cart = saved_orders;
            $(".orange-icon").text(localStorage.getItem("Amount"));
            $(".text-price2").text(localStorage.getItem("Cash"));
        }
    else {
        $(".orange-icon").text(0);
        $(".text-price2").text(0);
    }
    
    updateCart();
 if(Cart.length == 0) {
                $("#button-buy").css("opacity",	"0.4");
                $("#button-buy").css("pointer-events", "none");
        }
    else {
        $("#button-buy").css("opacity",	"1");
                $("#button-buy").css("pointer-events", "all");
    }
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}
    

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    localstorage();
    showAllPizzasInCart();
    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        
        
        
        var $node = $(html_code);

        $node.find(".button-plus").click(function(){
            //Збільшуємо кількість замовлених піц
            var order = $cartup.find(".orange-icon").text();
            var price = $cartup.find(".text-price2").text();
            var pizza_price = $node.find(".cash").text();
            cart_item.quantity += 1;
            order = parseInt(order)+1;
            price = parseInt(price) + parseInt(pizza_price);
            $(".orange-icon").text(order);
            $cartup.find(".text-price2").text(price);
                $("#button-buy").css("opacity",	"1");
                $("#button-buy").css("pointer-events", "all");
        
            //Оновлюємо відображення
            updateCart();
        });
        
        $node.find(".button-minus").click(function(){
            //Зменшуємо кількість замовлених піц
            var order = $cartup.find(".orange-icon").text();
            var price = $cartup.find(".text-price2").text();
            var pizza_price = $node.find(".cash").text();
            if(cart_item.quantity !== 1) 
               cart_item.quantity -= 1;      
            else
            removeFromCart(cart_item);
            order = parseInt(order)-1;
            price = parseInt(price) - parseInt(pizza_price);
            $(".orange-icon").text(order);
            $cartup.find(".text-price2").text(price);
            if(Cart.length == 0) {
                $("#button-buy").css("opacity",	"0.4");
                $("#button-buy").css("pointer-events", "none");
                 $(".next").css("opacity",	"0.4");
                $(".next").css("pointer-events", "none");
        }
            //Оновлюємо відображення
            updateCart();
        });
        
        $node.find(".button-cancel").click(function(){
            //Видаляємо піци цього виду
            var order = $cartup.find(".orange-icon").text();
            var price = $cartup.find(".text-price2").text();
            var pizza_price = $node.find(".cash").text();
            removeFromCart(cart_item);
            order = parseInt(order)-cart_item.quantity;
            price = parseInt(price) - parseInt(pizza_price) * cart_item.quantity;
            $(".orange-icon").text(order);
            $cartup.find(".text-price2").text(price);
            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }
    
    
    //Онволення всих піц
    function showAllPizzasInCart() {
        $cartup.find("#button-white").click(function kill(){
            //Видаляємо всі піци
            $(".orange-icon").text(0);
            $cartup.find(".text-price2").text(0);
            removeAllCart();
            if(Cart.length == 0) {
                $("#button-buy").css("opacity",	"0.4");
                $("#button-buy").css("pointer-events", "none");
                $(".next").css("opacity",	"0.4");
                $(".next").css("pointer-events", "none");
        }
            //Оновлюємо відображення
            updateCart();
        });
        
        $cartup.find(".buyb").click(function(){
            
            if(window.location.pathname != "/order.html") {
                window.location.href = "order.html";
            }
            else {
                window.location.href = "index.html";
            }
        });
    }

    Cart.forEach(showOnePizzaInCart);
    
}
exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;