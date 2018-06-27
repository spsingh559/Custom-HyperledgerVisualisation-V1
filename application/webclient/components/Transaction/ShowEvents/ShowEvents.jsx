import React from 'react';
import Paper from 'material-ui/Paper';
import EventsChild from './EventsChild';

const images={
    client:'../../images/c.png',
    peer:'../../images/p.jpg',
    orderer:'../../images/o.jpg',
    endorser:'../../images/E.png'
}

var timeDiff;
var timeDiff1;
export default class ShowEvents extends React.Component{

    state={
        eventsData:[]
    }

    static get contextTypes() {
        return {
          router: React.PropTypes.object.isRequired,
          socket: React.PropTypes.object.isRequired
        }
      }

    
 
      componentDidMount=()=>{

        this.context.socket.on('txInits',(msg)=>{
            // alert('tx init');
            console.log('tx init');
            timeDiff=Date.now();
            console.log(timeDiff);
            console.log(Date.now());
            var d = new Date();
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            var mili=d.getMilliseconds();


            var obj={
                title:"Transaction Initiated",
                subTitle:"Transaction has been initiated by Client",
                next:"transaction proposal is constructed. An application leveraging a supported SDK (Node, Java, Python) utilizes one of the available API’s which generates a transaction proposal. The proposal is a request to invoke a chaincode function so that data can be read and/or written to the ledger",
                time:hour+':'+min+':'+sec+':'+mili,
                avatar:images.client
            }
            let newData=[obj].concat(this.state.eventsData); 

           this.setState({eventsData:newData});
          });

          this.context.socket.on('sendTxProposal',(msg)=>{
           
            // alert('tx init');
            var msg =JSON.parse(msg)
            console.log(msg);
            var d = new Date();
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            var mili=d.getMilliseconds();

            var obj={
                title:"Transaction Proposal",
                subTitle:"client has proposed transaction to Endorsing Peer",
                next:"Transaction Proposal Format\n"+ "chaincodeId : "+msg.chaincodeId+"\n"+
                "Function: "+msg.fcn +"\n"+
                "Channel Name: "+msg.chainId+"\n"+
                 "Transaction Id: "+ msg.txId._transaction_id+"\n" +
                  "Endorsing Peer : "+ msg.targets[0]._options["grpc.ssl_target_name_override"]+"\n"+ "Endorsing Peer Url: "+msg.targets[0]._url,
                time:hour+':'+min+':'+sec+':'+mili,
                avatar:images.client
            }
            let newData=[obj].concat(this.state.eventsData); 

           this.setState({eventsData:newData});
          });

          this.context.socket.on('proposalResponse',(msg)=>{
              
            // alert('tx init');
            // var msg =JSON.parse(msg)
            console.log(msg);
            var d = new Date();
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            var mili=d.getMilliseconds();

            var obj={
                title:"Proposal Response",
                subTitle:"Endorsing Peer has returned the propose response",
                next:"The application “broadcasts” the transaction proposal and response within a “transaction message” to the Ordering Service",
                time:hour+':'+min+':'+sec+':'+mili,
                avatar:images.endorser
            }
            let newData=[obj].concat(this.state.eventsData);

           this.setState({eventsData:newData});
          });

          this.context.socket.on('proposalGood',(msg)=>{
              
            // alert('tx init');
            // var msg =JSON.parse(msg)
            console.log(msg);
            var d = new Date();
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            var mili=d.getMilliseconds();

            var obj={
                title:"Proposal Status",
                subTitle:"Client Varifying the Proposal Status",
                next:msg,
                time:hour+':'+min+':'+sec+':'+mili,
                avatar:images.client
            }
            let newData=[obj].concat(this.state.eventsData);

           this.setState({eventsData:newData});
          });
        //   proposalGood
        
        //   proposalResponse
        
        this.context.socket.on('preparingRequestToOrderer',(msg)=>{
              
            // alert('tx init');
            // var msg =JSON.parse(msg)
            console.log(msg);
            var d = new Date();
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            var mili=d.getMilliseconds();

            var obj={
                title:"Broadcasting Transaction",
                subTitle:"Sending Endorsed transaction to Orderer",
                next:msg,
                time:hour+':'+min+':'+sec+':'+mili,
                avatar:images.client
            }
            let newData=[obj].concat(this.state.eventsData);

           this.setState({eventsData:newData});
          });

          this.context.socket.on('ordererStatus',(msg)=>{
              
            // alert('tx init');
            // var msg =JSON.parse(msg)
            console.log(msg);
            var d = new Date();
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            var mili=d.getMilliseconds();

            var obj={
                title:"Orderer Received Transaction",
                subTitle:"Ordere Successfully Received Endorsed Transaction",
                next:msg,
                time:hour+':'+min+':'+sec+':'+mili,
                avatar:images.orderer
            }
            let newData=[obj].concat(this.state.eventsData);

           this.setState({eventsData:newData});
          });

          this.context.socket.on('ordererCommited',(msg)=>{
              
            // alert('tx init');
            // var msg =JSON.parse(msg)
            console.log(msg);
            var d = new Date();
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            var mili=d.getMilliseconds();

            var obj={
                title:"Block Creation",
                subTitle:"Ordere Successfully created Block",
                next:msg,
                time:hour+':'+min+':'+sec+':'+mili,
                avatar:images.orderer
            }
            let newData=[obj].concat(this.state.eventsData);

           this.setState({eventsData:newData});
          });

          this.context.socket.on('peerCommited',(msg)=>{
              
            // alert('tx init');
            // var msg =JSON.parse(msg)
            console.log(msg);
            var d = new Date();
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            var mili=d.getMilliseconds();

            var obj={
                title:"Anchor Peer Commited Block",
                subTitle:"All Peers updated the Ledger",
                next:msg,
                time:hour+':'+min+':'+sec+':'+mili,
                avatar:images.peer
            }
            let newData=[obj].concat(this.state.eventsData);

           this.setState({eventsData:newData});
          });
          this.context.socket.on('txid',(msg)=>{
              timeDiff1=Date.now();
              console.log(timeDiff1);
            // alert('tx init');
            var msg =JSON.parse(msg)
            console.log(msg);
            var d = new Date();
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            var mili=d.getMilliseconds();

            var obj={
                title:"Transaction Hash",
                subTitle:"Transaction Hash sent to Client",
                next:msg,
                time:hour+':'+min+':'+sec+':'+mili,
                avatar:images.peer
            }
            let newData=[obj].concat(this.state.eventsData);

           this.setState({eventsData:newData});
          });


          

      }

    render(){

        return(
            <div>
                
                <Paper  zDepth={2} style={{width:"500px"}}>
                  <h2> Transaction Flow Detail </h2>
                 
                  < br />
                  Total Time : {parseInt(timeDiff1)-parseInt(timeDiff)} ms
                  </Paper>
                  < br />
                
                <EventsChild  eventsData ={this.state.eventsData}/>
                </div>
        )
    }
} 