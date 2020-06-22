import React from 'react';
import { Nav, Button, Modal } from 'react-bootstrap';
import ReservationType from '../../types/ReservationType';
import api, { ApiResponse } from '../../api/api';

interface ReservationState{
    visible:boolean;
    // reservation: ReservationType;
}

export default class ReservationPage extends React.Component{

    state:ReservationState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state={
            visible: false,
        }
    }




    private setStateVisible(newState:boolean){
        this.setState(Object.assign(this.state,{visible: newState}));
    }

    private makeReservation(){
        api('/api/reservation/createFull','post',{})
        .then((res:ApiResponse)=>{
            if(res.status === 'error'|| res.status ==='login'){
                return;
            }
        })
    }

   

    render (){
        return(
            <>
                <Nav.Item>
                    <Button variant="primary" onClick={() => this.setStateVisible(true)}>Reserve</Button>
                </Nav.Item>
 
                <Modal size="lg" centered show={this.state.visible} onHide={()=>this.setStateVisible(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Your reservation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Confirm your reservation
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={()=>this.makeReservation()}>
                            Make a reservation
                        </Button>
                    </Modal.Footer>

                    

                </Modal>
            </>
        );
    }

}