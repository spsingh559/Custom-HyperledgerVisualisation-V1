import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {Grid,Row,Col} from 'react-bootstrap';

import {
    Step,
    Stepper,
    StepLabel,
  } from 'material-ui/Stepper';


//   Components
import ShowEvents from './ShowEvents/ShowEvents';
import Log from './Log/Log';

const style={
    styleDiv:{
        width: "250px",
        height: "70px",
        borderRadius: "6px",
        border: "solid 1px #d5d5d5",
        marginTop:"10px"
    },
    styleDiv1:{
        width: "250px",
        height: "70px",
        borderRadius: "6px",
        marginLeft:"20px",
        border: "solid 1px #d5d5d5",
        marginTop:"10px"
    },
    row2Col1:{
        height: "auto",
        marginTop:"20px"
    },
    row2Col2:{
        height: "auto",
        marginTop:"20px"
    }
}

export default class Transaction extends React.Component{
    state={
        txView:false,
        basicData:[]
    }

    static get contextTypes() {
        return {
          router: React.PropTypes.object.isRequired,
          socket: React.PropTypes.object.isRequired
        }
      }
 
      
    componentDidMount=()=>{
        console.log('component');
        this.context.socket.on('txInit',(msg)=>{
            // alert('tx init');

           this.setState({txView:true});
          });

          this.context.socket.on('basicInfo',(msg)=>{
              console.log(msg);
           this.setState({basicData:JSON.parse(msg)});
          });


        



    }

    
    render(){
if(this.state.txView==false){
    return(
        <div  style ={{marginTop:"90px"}}>
            <center>
                <h1> Wait ! </h1><br />
                <h2>
                    We are detecting any transaction initiated by Client 
                    </h2>
                    <br />
                    <CircularProgress />
                    </center>
            </div>
    )
}else{
    // console.log(this.state.basicData);
let arr=[];
   

    return(
        <div className="txbackground">
            <center>
                <h2> Transaction flow of Org1 </h2>
                </center>
                <Grid>
        
                    <Row>
                        <Col xs={3} style={style.styleDiv}>
                        <b>
                        Channel Name <br /><br />
                        {this.state.basicData.channelName}
                        </b>
                        </Col>
                        <Col xs={3} style={style.styleDiv1}>
                        <b>
                            Peer Name <br /> <br />
                            {this.state.basicData.peerNames}
                            </b>
                        </Col>
                        <Col xs={3} style={style.styleDiv1}>
                        <b>
                        Chain code Name <br /> <br />
                        {this.state.basicData.chaincodeName}
                        </b>
                        </Col>
                        <Col xs={3} style={style.styleDiv1}>
                        <b>
                        Organisation Name <br /> <br />
                        {this.state.basicData.org}
                        </b>
                        </Col>
                        </Row>
                        <Row>
                            <Col xs={6} style={style.row2Col1}>
                            <ShowEvents />
                            </Col>
                            <Col xs={6} style={style.row2Col2}>
                            <Log />
                            </Col>
                            </Row>
                    </Grid>
            </div>
    )

}
        
    }
}