import React from 'react';
import { Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { ApiConfig } from '../config/api.config';
import { Link } from 'react-router-dom';
import BookType from '../types/BookType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ReservationType from '../types/ReservationType';
import api, { ApiResponse } from '../api/api';
import ApiReservationDto from '../dtos/ApiReservationDto';

interface SingleBookPreviewProperties{
    book: BookType,
}
interface SingleBookPreviewState{
    isLibrarianLoggedIn: boolean;
    reservations: ReservationType[];

    addModal:{
      visible: boolean;
      studentId: string;
      book: string;
      status:string;
      message:string
    };

}



export default class SingleBookPreview  extends React.Component<SingleBookPreviewProperties>{
      state: SingleBookPreviewState;
    
      constructor(props: Readonly<SingleBookPreviewProperties>){
        super(props);
    
        this.state = {
            isLibrarianLoggedIn: true,
            reservations: [],
    
            addModal:{
              visible: false,
              studentId: '',
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
      private setAddModalNumbeFieldState(fieldName: string, newValue:string){
        this.setState(Object.assign(this.state,Object.assign(this.state.addModal,{
          [fieldName]:newValue,
        })));
      }
      
    
      componentDidMount(){
        this.getReservations();
      }
    
    
    
      private getReservations(){
          
        api('/api/reservation/','get',{},'student')
        .then((res: ApiResponse) => {
            if(res.status==="error" || res.status ==="login"){
              this.setLogginState(false);
              return;
            }
    
            this.putReservationsInState(res.data);
    
        });
      }
      private putReservationsInState(data: ApiReservationDto[]) {
        const reservations: ReservationType[] = data.map(reservation => {
                return {
                  reservationId: reservation.reservationId,
                  studentId: reservation.studentId,
                  book: reservation.book,
                  status: reservation.status,
                  reservedAt:reservation.reservedAt
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
        return(
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Header>
                        <img alt={this.props.book.title}
                            src={ ApiConfig.PHOTO_PATH+'small/'+ this.props.book.imageUrl}
                            className="w-100"/>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as ="p">
                            <strong>{this.props.book.title}</strong>
                        </Card.Title>
                        <Card.Text>
                            { this.props.book.excerpt }
                        </Card.Text>

                        <Link to={ `/book/${this.props.book.bookId}`}
                            className="btn btn-primary btn-block btn-sm">
                                 Open book page
                        </Link>
                        <Button variant="primary" className="btn-block" 
                            onClick={()=> this.showAddModal()}>
                              <FontAwesomeIcon icon={faPlus}/> Reserve
                            </Button>
                    </Card.Body>
                </Card>
                <Modal size="lg" centered show={this.state.addModal.visible} onHide={()=> this.setAddModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add new reservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="studentId">Student</Form.Label>
                      <Form.Control id="studentId" type="text" value={this.state.addModal.studentId}
                      onChange={(e)=>this.setAddModalStringFieldState('studentId',e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="book">Book</Form.Label>
                      <Form.Control id="book" type="text" value={this.state.addModal.book}
                      onChange={(e)=>this.setAddModalStringFieldState('book',e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="status">Status</Form.Label>
                      <Form.Control id="status" type="text" value={this.state.addModal.status}
                      onChange={(e)=>this.setAddModalStringFieldState('status',e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={()=> this.doAddReservation()}>
                      <FontAwesomeIcon icon={ faPlus }/> Add new reservation
                      </Button>
                    </Form.Group>
                    {this.state.addModal.message ?(
                      <Alert variant="danger" value={this.state.addModal.message}></Alert>
                    ):''}
                </Modal.Body>
            </Modal>

            
            </Col>
        );
    }
    private showAddModal(){
        this.setAddModalStringFieldState('studentId', '' );
        this.setAddModalStringFieldState('book', '');
        this.setAddModalStringFieldState('status','');
        this.setAddModalVisibleState(true);
        
      }
    
      private doAddReservation(){
        api('/api/reservation/','post',{
            studentId:this.state.addModal.studentId,
            book: this.state.addModal.book,
            status: this.state.addModal.status
        },'librarian')
        .then((res: ApiResponse) => {
          if(res.status ==="login"){
            this.setLogginState(false);
            return;
          }
          if(res.status ==="error"){
            this.setAddModalStringFieldState('message',JSON.stringify(res.data));
            return;
          }
    
    
          this.setAddModalVisibleState(false);
          this.getReservations();
    
        });
      }
    
      
      
}