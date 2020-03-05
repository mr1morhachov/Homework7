/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API')
var Pizza_list;

//-----------------------------ORDER (js)-----------------------------------
var correctname = false;
var correctnumber = false;
var correctaddress = false;
var bool = false;
var root;
var markerMe;
var latlng;
var latlng2;
var map;

function initMap(){
      // Map options
    latlng = new google.maps.LatLng(50.464379,30.519131);
      var option = {
        center:	latlng,
        zoom:	11
      }
      // New map
      map = new google.maps.Map(document.getElementById('map'), option);
    
    var marker = new google.maps.Marker({
        position: latlng,
        map:map,
        icon:	"assets/images/map-icon.png"
      });
    
    markerMe = new google.maps.Marker({
        position: latlng,
        map:map,
        icon:	"assets/images/map-icon.png"
      });
    
    google.maps.event.addListener(map,	'click',function(me){
        root = false;
    var coordinates	=	me.latLng;
        /**
    //coordinates	- такий самий об’єкт як створений new google.maps.LatLng(...)
            markerMe.setMap(null);
    markerMe = new google.maps.Marker({
position: coordinates,
//map	- це змінна карти створена за допомогою new	
map:	map,
icon:	"assets/images/home-icon.png"
});
*/
        
       
        geocodeLatLng(coordinates,	function(err,	adress){
            if(!err)	{
                //Дізналися адресу
                console.log(adress);
                $(".addressorder").focusin();
                $(".addressorder").val(adress);
                $(".addressorder").focusout();
            }	else	{
                console.log("Немає адреси")
            }
        });
    });
    
    
homeb = true;
}

function	geocodeLatLng(latlng,	 callback){
        //Модуль за роботу з адресою
        var geocoder	=	new	google.maps.Geocoder();
        geocoder.geocode({'location':	latlng},	function(results,	status)	{
            if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
                var adress =	results[1].formatted_address;
                callback(null,	adress);
            }	else	{
                callback(new	Error("Can't	find	adress"));
            }
        });
    }

function geocodeAddress(address, callback) {
    new google.maps.Geocoder().geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0])
            callback(null, results[0].geometry.location);
        else
            callback(new Error("Can not find address"));
    });
}

function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
    var directionService =	new	google.maps.DirectionsService();
   // if(root)
     //   var directionDisplay = null;
    //var directionsDisplay = new google.maps.DirectionsRenderer();
    //if(root)
        
    //directionsDisplay.setMap(null);
    //directionsDisplay.setMap(map);
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    },	function(response,	status)	{
        if	(	status	==	google.maps.DirectionsStatus.OK )	{
            var leg	=	response.routes[	0	].legs[	0	];
          //  if(root)
          //      directionsDisplay.setDirections(null);
          //   root = true;
          //  directionsDisplay.setDirections(response);
            callback(null,	{
                duration:	leg.duration
            });
        }	else	{
            callback(new	Error("Can'	not	find	direction"));
        }
    });
}
/**
function	geocodeAddresss(address,	 callback)	{
            var geocoder	=	new	google.maps.Geocoder();
            geocoder.geocode({'address':	address},	function(results,	status)	{
                if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
                    var coordinates	=	results[0].geometry.location;
                     markerMe.setMap(null);
    markerMe = new google.maps.Marker({
position: coordinates,
//map	- це змінна карти створена за допомогою new	
map:	map,
icon:	"assets/images/home-icon.png"
});
                    callback(null,	coordinates);
                }	else	{
                    callback(new	Error("Can	not	find	the	adress"));
                }
            });
        }
        */

function makeOrder() {
    if(correctnumber && correctaddress && correctname) {
           $(".next").css("opacity", "1");
            $(".next").css("pointer-events", "all");
       }
       else {
           $(".next").css("opacity",	"0.4");
            $(".next").css("pointer-events", "none");
       }
}

   $(".nameorder").focusout(function myName() {
       var name = $(".nameorder").val();
       if ((/^[a-zA-Z ]+$/.test(name)) && /\S/.test(name)) {
           correctname = true;
       }
       else
           correctname = false;

       if(correctname) {
           $(".nameorder").css("border", "1px solid green");
           $(".warnname").css("visibility", "hidden");
           $(".textname").css("color", "green");
       }
       else {
           $(".nameorder").css("border", "1px solid red");
           $(".warnname").css("visibility", "visible");
           $(".textname").css("color", "red");
       }
       makeOrder();
        });

 $(".numberorder").focusout(function myNumber() {
       var number = $(".numberorder").val();
       if ((/^[0-9+]+$/.test(number)) && checkNumber(number)) {
           correctnumber = true;
       }
     else correctnumber = false;

       if(correctnumber) {
           $(".numberorder").css("border", "1px solid green");
           $(".warnnumber").css("visibility", "hidden");
           $(".textnumber").css("color", "green");
       }
       else {
           $(".numberorder").css("border", "1px solid red");
           $(".warnnumber").css("visibility", "visible");
           $(".textnumber").css("color", "red");
       }
     makeOrder();
        });

 $(".addressorder").focusout(function myAddress() {
     var address = $(".addressorder").val();
       if (/\S/.test(address)) {
           correctaddress = true;
       }
     else
         correctaddress = false;

       if(correctaddress) {
           $(".addressorder").css("border", "1px solid green");
           $(".warnaddress").css("visibility", "hidden");
           $(".textaddress").css("color", "green");
          geocodeAddress(address,
    function (err, LatLng) {
        if(!err)	{
                //Дізналися коорд
             markerMe.setMap(null);
            markerMe = new google.maps.Marker({
                position: LatLng,
//map	- це змінна карти створена за допомогою new	
                map:	map,
                icon:	"assets/images/home-icon.png"
            });
            calculateRoute(latlng,  LatLng, function (err, duration) {
        if(!err)	{
              $("#chas").text(duration.duration.text);
            }	else	{
                $("#chas").text('невідома');
                console.log("Немає зв'язку");
                
            }
    });
            $("#adresa").text(address);
            }	else	{
                $("#adresa").text("невідома");
                console.log("Немає таких коорд")
            }
    });
           
       }
       else {
           $(".addressorder").css("border", "1px solid red");
           $(".warnaddress").css("visibility", "visible");
           $(".textaddress").css("color", "red");
        }
     makeOrder();
});

$(".show-hide").click(function() {
    $("#map").css("display", "block");
    $(".addressorder").css("pointer-events", "all");
    $(".show-hide").css("pointer-events", "none");
        initMap();
});
 $(".next").click(function send() {
     var order =
         {
             name: $(".nameorder").val(),
             number: $(".numberorder").val(),
             address: $(".addressorder").val(),
             cart: localStorage.getItem("Cart"),
             cash: localStorage.getItem("Cash")
         };
     
            //Оновлюємо відображення
           $("#button-white").click();
           $(".buyb").click();
     
    API.createOrder(order, function (err, data) {
        console.log("Order created");
        console.log(order);
    });
});

function checkNumber(number) {
    if(number.length != 10 && number.length != 13)
        return false;
    if((number.startsWith("0") && number.length == 10) || (number.startsWith("+380")  && number.length == 13 && /^[0-9]+$/.test(number.substring(1, number.length))))
       return true;
    return false;
}
    //--------------------------------------------------------------------------

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");
    var $buttons = $("#menu");
    
    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
        
        
    }
    
    $buttons.find(".all").click(function(){
            initialiseMenu();
            //Оновлюємо відображення
        });
    
    $buttons.find(".meat").click(function(){
            filterPizza('М’ясна піца');
            //Оновлюємо відображення
        });
    
    $buttons.find(".ananas").click(function(){
            filterPizza('pineapple');
            //Оновлюємо відображення
        });
    
    $buttons.find(".tomatoes").click(function(){
            filterPizza('tomato');
            //Оновлюємо відображення
        });
    
    $buttons.find(".seafood").click(function(){
            filterPizza('Морська піца');
            //Оновлюємо відображення
        });
    
    $buttons.find(".vega").click(function(){
            filterPizza('Вега піца');
            //Оновлюємо відображення
        });

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        
        if(pizza.type == filter)
            pizza_shown.push(pizza);
        
        if(pizza.content.tomato && filter == 'tomato')
            pizza_shown.push(pizza);
        
        
        if(pizza.content.pineapple && filter == 'pineapple')
            pizza_shown.push(pizza);
        
        //TODO: зробити фільтри
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}


function initialiseMenu() {
    //Показуємо усі піци
     $(".all").focus();
    API.getPizzaList(function (err, data) {
        Pizza_List = data;
        showPizzaList(Pizza_List);
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;