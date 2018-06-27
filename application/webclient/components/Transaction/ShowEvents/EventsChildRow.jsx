import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
export default class EventsChildRow extends React.Component{

    render(){

       

        return(
            <Card style={{marginTop:"10px",overflowX:"auto",width:"500px"}}>
            <CardHeader
              title={this.props.data.title}
              subtitle={this.props.data.subTitle + " at : "+ this.props.data.time}
              avatar={this.props.data.avatar}
            />
            <CardText>
              {this.props.data.next}
            </CardText>
          </Card>          
        )
    }
}