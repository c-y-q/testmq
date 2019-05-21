var amqp = require('amqp')
var connection = amqp.createConnection({
	host:'127.0.0.1',
	post:5672,
	login:'test',
	password: '123',
	vhost: '/test'
})
connection.on('error',function(err){
	console.log('connection err : '+err);
})
var queName = 'test_q3',exname='test_ex';
connection.on('ready',function(){
	var ex = connection.exchange(`${exname}`,{type:'fanout',durable:true,autoDelete:false});
	connection.queue(`${queName}`,{durable:true,autoDelete:false},function(q){
	 
	 q.bind(ex,queName,function(){
	 	ex.publish(queName,'test msg1',{deliveryMode:2})
	 	ex.publish(queName,'test msg2 msg2',{deliveryMode:2})
	 })
	 setTimeout(function() {
        console.log("Single queue bind callback succeeded");
     //exchange.destroy();
     //queue.destroy();node
         connection.end();
         connection.destroy();
         },1000); 
    q.subscribe({ack:true,prefetchCount:1},function(msg){
    	q.shift()
    	console.log('receive msg : '+msg.data);
    })
	})
})