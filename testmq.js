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
});
connection.on('ready', function () {
  // Options
// - type 'fanout', 'direct', or 'topic' (default)
// - passive (boolean)
// - durable (boolean)
// - autoDelete (boolean, default true)
  var  exchange = connection.exchange('exchange_name', {type: 'fanout',autoDelete:false});
// - passive (boolean)
// - durable (boolean)持久化
// - exclusive (boolean)
// - autoDelete (boolean, default true)
//'arguments': {'x-expires': 3600000}
  connection.queue("queue_name8",{autoDelete:false,durable:true}, function(queue){
queue.bind('exchange_name','queue_name8', function() {
        // the third argument can specify additional options
// - mandatory (boolean, default false)
// - immediate (boolean, default false)
// - contentType (default 'application/octet-stream')
// - contentEncoding
// - headers
// - deliveryMode
// - priority (0-9)
// - correlationId
// - replyTo
// - expiration
// - messageId
// - timestamp
// - userId
// - appId
// - clusterId
//
    exchange.publish('queue_name8', 'this is message is testing ......',{deliveryMode:2});
    exchange.publish('queue_name8', 'this is message is testing3 ......',{deliveryMode:2})

     setTimeout(function() {
        console.log("Single queue bind callback succeeded");
     //exchange.destroy();
     //queue.destroy();node
         connection.end();
         connection.destroy();
         }, 5000); 
         
    })
    //同一个消息多次订阅同一个队列，只会收到一次消息
    /*
     ack:true,确认收到一条消息后，后续对列中的消息接收不到，如果需要下条消息,调用q.shift()
     prefetchCount:每个消费者接收的消息平均，
    */
    // queue.subscribe({ack:true,prefetchCount:1},function (message) {
    //   console.log('2At 5 second recieved message is:'+ message.data);
    // });
    // queue.subscribe({ack:true,prefetchCount:1},function (message) {
    //   console.log('At 5 second recieved message is:'+ message.data);
    // });

    queue.subscribe(function (message) {
      console.log('2At 5 second recieved message is:'+ message.data);
    });
    //  queue.subscribe(function (message) {
    //   console.log('1 5 second recieved message is:'+ message.data);
    // });
  })
  connection.queue("queue_name9",{autoDelete:false,durable:true}, function(queue){
   queue.bind('exchange_name','queue_name9', function() {
      exchange.publish('queue_name9', 'this is queue_name1 is testing4 ......',{deliveryMode:2})
    })
    queue.subscribe(function (message) {
      console.log('queue_name1 7 second recieved message is:'+ message.data);
    });
  })
})
