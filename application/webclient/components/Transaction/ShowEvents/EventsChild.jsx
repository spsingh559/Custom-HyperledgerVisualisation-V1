import React from 'react';
import EventsChildRow from './EventsChildRow';
export default class EventsChild extends React.Component{

    render(){

        let newData=this.props.eventsData.map((data,i)=>{
            return(
                <EventsChildRow 
                key={i}
                data={data}
                />
            )
        })

        return(
            <div >
           {newData}
           </div>
        )
    }
}