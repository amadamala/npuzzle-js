var Global = (function($){
    var me = {};

    me.print = function	(str) {
    	if ( typeof str != 'undefined')
    		console.log(str);
    	else 
    		console.log('undefined argument passed');
    };    
    
    me.getHelloWorld = function (){
        return 'Hello World !!';        
    };    
	return me;
})($);
