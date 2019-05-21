const amqp = require('amqp');
var connection = amqp.createConnection( {
 host: '127.0.0.1'
, port: 5672
, login: 'test'
, password: '123'
, vhost: '/test'
});
connection.on('error', function(err) { 
    console.log('Connection error', err); 
})



connection.on('ready', function () {
  
	var exchange = connection.exchange('exchange_name2', {type: 'direct',autoDelete:false});
    connection.queue("queue_name",{autoDelete:false}, function(queue){
    queue.bind('exchange_name2','queue_name', function() {
		exchange.publish('queue_name', 'this is message is testing ......');
		exchange.publish('queue_name', 'this is message is testing2222 ......');
		 
	 setTimeout(function() {
     console.log("Single queue bind callback succeeded");
	 //exchange.destroy();
     //queue.destroy();
	 connection.end();
     connection.destroy();
     }, 5000)
		 
  })
    queue.subscribe(function (message) {
      console.log('At 2:'+ message.data);
    })
	queue.subscribe(function (message) {
      console.log('At 1:'+ message.data);
    })
  })

  connection.queue('q2',{autoDelete:false},function(q){
   q.bind('exchange_name2','q2',function(){
   	exchange.publish('q2','is form q2')
   })
   q.subscribe(function(msg){
   	console.log("q2: "+msg.data)
   })
  })
  
   
})