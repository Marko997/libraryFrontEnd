import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RoledMainManu from '../RoledMainMenu/RoledMainManu';
import ReservationType from '../../types/ReservationType';
import ApiReservationDto from '../../dtos/ApiReservationDto';

interface LibrarianDashboardReservationState{
    isLibrarianLoggedIn: boolean;
    reservations: ReservationType[];

    addModal:{
      visible: boolean;
      studentId: number;
      book: string;
      status:string;
      message:string
    };
    editModal:{
      reservationId: number;
      visible: boolean;
      studentId: number;
      book: string;
      status:string;
      message:string
    };
}


class LibrarianDashboardReservation extends React.Component {
  state: LibrarianDashboardReservationState;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
        isLibrarianLoggedIn: true,
        reservations: [],

        addModal:{
          visible: false,
          studentId: 0,
          book: '',
          status:'',
          message:'',
        },
        editModal:{
          reservationId: 0,
          visible: false,
          studentId: 0,
          book: '',
          status:'',
          message:'',
        },
        
    }
    

  }

  private setAddModalVisibleState(newState:boolean){
    this.setState(Object.assign(this.state,Object.assign(this.state.addModal,{
      visible:newState,
    })));
  }

  private setAddModalStringFieldState(fieldName: string, newValue:string){
    this.setState(Object.assign(this.state,Object.assign(this.state.addModal,{
      [fieldName]:newValue,
    })));
  }
  private setAddModalNumbeFieldState(fieldName: string, newValue:number){
    this.setState(Object.assign(this.state,Object.assign(this.state.addModal,{
      [fieldName]:newValue,
    })));
  }
  private setEditModalVisibleState(newState:boolean){
    this.setState(Object.assign(this.state,Object.assign(this.state.editModal,{
      visible:newState,
    })));
  }

  private setEditModalStringFieldState(fieldName: string, newValue:string){
    this.setState(Object.assign(this.state,Object.assign(this.state.editModal,{
      [fieldName]:newValue,
    })));
  }
  private setEditModalNumbeFieldState(fieldName: string, newValue:number){
    this.setState(Object.assign(this.state,Object.assign(this.state.editModal,{
      [fieldName]:newValue,
    })));
  }

  componentWillMount(){
    this.getReservations();
  }



  private getReservations(){
      
    api('/api/reservation/','get',{},'librarian'&&'student')
    .then((res: ApiResponse) => {
        // if(res.status==="error" || res.status ==="login"){
        //   this.setLogginState(false);
        //   return;
        // }

        this.putReservationsInState(res.data);

    });
  }
  private putReservationsInState(data?: ApiReservationDto[]) {
    const reservations: ReservationType[] | undefined = data?.map(reservation => {
            return {
              reservationId: reservation.reservationId,
              studentId: reservation.studentId,
              book: reservation.book,
              status:reservation.status,

            };
          });
      
          const newState = Object.assign(this.state,{
            reservations: reservations,
          });
          this.setState(newState);
  }
 
  

 
  private setLogginState(isLibrarianLoggedIn: boolean){
    const newState = Object.assign(this.state, {
        isLibrarianLoggedIn: isLibrarianLoggedIn,
    });
    this.setState(newState);
}

  render(){

    if(this.state.isLibrarianLoggedIn===false){
      return(
          <Redirect to="/librarian/login"/>
      )
    }

    return (
      <Container>
          <RoledMainManu role="librarian"/>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> Reservations
                    </Card.Title>
                    <Table hover size="sm" bordered>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Student</th>
                          <th>Book</th>
                          <th>Status</th>
                          <th></th>

                          
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.reservations?.map(reservation=>(
                          <tr>
                            <td className="text-right">{reservation.reservationId}</td>
                            <td>{reservation.studentId}</td>
                            <td>{reservation.book}</td>
                            <td>{reservation.status}</td>

                            <td className="text-center">
                              <Button variant="info" size="sm"
                              onClick={()=> this.showEditModal(reservation)}>
                              <FontAwesomeIcon icon={faEdit}/>Edit
                                </Button></td>
                          </tr>
                        ),this)}
                      </tbody>
                    </Table>
                </Card.Body>
            </Card>
            

            <Modal size="lg" centered show={this.state.editModal.visible} onHide={()=> this.setEditModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit new reservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="studentId">Student</Form.Label>
                      <Form.Control id="studentId" type="text" value={this.state.editModal.studentId}
                      onChange={(e)=>this.setEditModalNumbeFieldState('name',Number(e.target.value))}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="book">Book</Form.Label>
                      <Form.Control id="book" type="url" value={this.state.editModal.book}
                      onChange={(e)=>this.setEditModalNumbeFieldState('book',Number(e.target.value))}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-status">Status</Form.Label>
                      <Form.Control id="add-status" as="select" value={this.state.addModal.status.toString()}
                      onChange={(e)=>this.setAddModalStringFieldState('status',e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="loaned">Loaned</option>
                      <option value="rejected">Rejected</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={()=> this.doEditReservation()}>
                      <FontAwesomeIcon icon={ faEdit }/> Edit reservation
                      </Button>
                    </Form.Group>
                    {this.state.editModal.message ?(
                      <Alert variant="danger" value={this.state.editModal.message}></Alert>
                    ):''}
                </Modal.Body>
            </Modal>
      </Container>
    );
  }

  

  private showEditModal(reservation: ReservationType){
    this.setEditModalNumbeFieldState('studentId', Number( reservation.studentId));
    this.setEditModalNumbeFieldState('book', Number(reservation.book));
    this.setEditModalNumbeFieldState('status', Number(reservation.status));
    this.setEditModalNumbeFieldState('reservationId', Number(reservation.reservationId));
    this.setEditModalVisibleState(true);
    
  }
private doEditReservation(){
  api('/api/reservation/'+this.state.editModal.reservationId,'patch',{
    studentId:this.state.editModal.studentId,
    book: this.state.editModal.book,
    status: this.state.editModal.status,
  },'librarian')
  .then((res: ApiResponse) => {
    if(res.status ==="login"){
      this.setLogginState(false);
      return;
    }
    if(res.status ==="error"){
      this.setEditModalStringFieldState('message',JSON.stringify(res.data));
      return;
    }


    this.setEditModalVisibleState(false);
    this.getReservations();

  });
}
  
 
}

export default LibrarianDashboardReservation;
