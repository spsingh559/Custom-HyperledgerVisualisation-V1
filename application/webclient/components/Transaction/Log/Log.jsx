import React from 'react';
import Flowchart from 'react-simple-flowchart';
import Paper from 'material-ui/Paper';
export default class Log extends React.Component{

    static get contextTypes() {
        return {
          router: React.PropTypes.object.isRequired,
          socket: React.PropTypes.object.isRequired
        }
      }
    
     constructor(props) {
        super(props);
        
    
        const code =
        `st=>start: Transaction Initiated
    e=>end: End
    st(bottom)->e
   `;
        const opt = {
          x: 0,
          y: 0,
          'line-width': 3,
          'line-length': 50,
          'text-margin': 10,
          'font-size': 14,
          'font-color': 'black',
          'line-color': 'black',
          'element-color': 'black',
          fill: 'white',
          'yes-text': 'yes',
          'no-text': 'no',
          'arrow-end': 'block',
          scale: 1,
          symbols: {
            start: {
              'font-color': 'red',
              'element-color': 'green',
              'font-weight': 'bold',
            },
            end: {
              'font-color': 'red',
              'element-color': 'green',
              'font-weight': 'bold',
            },
          },
          flowstate: {
            department1: { fill: 'pink' },
            department2: { fill: 'yellow' },
            external: { fill: 'green' },
          },
        };
    
        this.state = {
          code,
          opt,
          elementText: 'none',
        }
      }
    
    //   handleCodeChange(e) {
    //     this.setState({
    //       code: e.target.value,
    //     });
    
    //   }
    
    //   handleOptChange(e) {
    //     this.setState({
    //       opt: JSON.parse(e.target.value),
    //     });
    
    //   }

      componentDidMount=()=>{
        this.context.socket.on('txInits',(msg)=>{
            // setTimeout(()=>{
                this.setState({code:`st=>start: Start
                e=>end: End
                st(bottom)->e
                `}) 
              // },2000)
  

          });

          this.context.socket.on('sendTxProposal',(msg)=>{
            // setTimeout(()=>{
                this.setState({code:`st=>start: Transaction Initiated
                e=>end: End
            op1=>operation: Transaction Proposal|department1
           
            st(bottom)->op1(bottom)->e`})
              // },5000)
          
          });

          this.context.socket.on('proposalResponse',(msg)=>{
            // setTimeout(()=>{
                this.setState({code:`st=>start: Transaction Initiated
                e=>end: End
            op1=>operation: Transaction Proposal|department1
            op2=>operation: Proposal Response Received|department2
            st(bottom)->op1(bottom)->op2(bottom)->e`});
              // },8000)
           
          });

          this.context.socket.on('proposalGood',(msg)=>{
            // setTimeout(()=>{
                this.setState({code:`st=>start: Transaction Initiated
                op1=>operation: Transaction Proposal|department1
                op2=>operation: Proposal Response Received|department2
                cond=>condition: ProposalGood?
                st(bottom)->op1(bottom)->op2(bottom)->cond(yes)`});
              // },11000)
           
           
        });
        // //   proposalGood
        
        // //   proposalResponse
        
        this.context.socket.on('preparingRequestToOrderer',(msg)=>{
            // setTimeout(()=>{
                this.setState({code:`st=>start: Transaction Initiated
                e=>end: End
                op1=>operation: Transaction Proposal|department1
                op2=>operation: Proposal Response Received|department2
                sub=>subroutine: Preparing Request To Orderer
                cond=>condition: ProposalGood?
                op7=>operation: Tx Declined |department2
                st(bottom)->op1(bottom)->op2(bottom)->cond(yes)->sub(bottom)
                cond(no)->op7(right)->e`});
              });
              // },14000)
          

          this.context.socket.on('ordererStatus',(msg)=>{
              
            // setTimeout(()=>{
                this.setState({code:`st=>start: Transaction Initiated
                e=>end: End
                op1=>operation: Transaction Proposal|department1
                op2=>operation: Proposal Response Received|department2
                sub=>subroutine: Preparing Request To Orderer
                cond=>condition: ProposalGood?
                 op4=>operation: Sent Request to Order Succesfully|department1
                 op7=>operation: Tx Declined |department2
                st(bottom)->op1(bottom)->op2(bottom)->cond(yes)->sub(bottom)->op4(bottom)
                cond(no)->op7(right)->e`});
              // },17000)
           
          
          });

          this.context.socket.on('ordererCommited',(msg)=>{
              
            // setTimeout(()=>{
                this.setState({code:`st=>start: Transaction Initiated
                e=>end: End
                op1=>operation: Transaction Proposal|department1
                op2=>operation: Proposal Response Received|department2
                sub=>subroutine: Preparing Request To Orderer
                cond=>condition: ProposalGood?
                 op4=>operation: Sent Request to Order Succesfully|department1
                 op5=>operation: Block Created |department2
                 op7=>operation: Tx Declined |department2
                st(bottom)->op1(bottom)->op2(bottom)->cond(yes)->sub(bottom)->op4(bottom)->op5(bottom)
                cond(no)->op7(right)->e`});
              // },20000)

           
          });

          this.context.socket.on('peerCommited',(msg)=>{
            // setTimeout(()=>{
                this.setState({
                    code:`st=>start: Transaction Initiated
                    e=>end: End
                    op1=>operation: Transaction Proposal|department1
                    op2=>operation: Proposal Response Received|department2
                    sub=>subroutine: Preparing Request To Orderer
                    cond=>condition: ProposalGood?
                    op4=>operation: Sent Request to Order Succesfully|department1
                        op5=>operation: Block Created |department2
                        op6=>operation: Ledger Updated by peer |department2
                        op7=>operation: Tx Declined |department2
                    st(bottom)->op1(bottom)->op2(bottom)->cond(yes)->sub(bottom)->op4(bottom)->op5(bottom)->op6(bottom)->e
                    cond(no)->op7(right)->e`
            }); 
              // },23000)
           
          

          });
        


          

      }
    
      render() {
        const { code, opt, elementText } = this.state;
        return (
          <div>
              
              <center>
              <Paper  zDepth={2} >
                  <h2> Transaction Flow Chart </h2>
                 
                  < br />
                  </Paper>
                  < br />
                  <Paper  zDepth={2} >
            <Flowchart
              chartCode={code}
              options={opt}
              onClick={elementText => this.setState({elementText})}
            />
            </Paper>
             </center>
          </div>
        );
      }
}