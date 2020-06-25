import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RoledMainManu from '../RoledMainMenu/RoledMainManu';
import LoanType from '../../types/LoanType';
import ApiLoanDto from '../../dtos/ApiLoanDto';

interface LibrarianDashboardLoanState{
    isLibrarianLoggedIn: boolean;
    loans: LoanType[];

    addModal:{
      visible: boolean;
      loanId?: number;
      studentId?: number;
      librarianId?: number;
      bookId?: number;
      createdAt?: string;
      expectedToBeReturnedAt?:string;
      status:'pending'|'loaned'|'returned'|'lost';
      returnedAt: string;
      message:string
    };
    editModal:{
      loanId: number;
      visible: boolean;
      studentId?: number;
      librarianId?: number;
      bookId?: number;
      createdAt?: string;
      expectedToBeReturnedAt?:string;
      status:'pending'|'loaned'|'returned'|'lost';
      returnedAt: string;
      message:string
    };
}


class LibrarianDashboardLoan extends React.Component {
  state: LibrarianDashboardLoanState;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
        isLibrarianLoggedIn: true,
        loans: [],

        addModal:{
          visible: false,
          studentId: 0,
          librarianId: 0,
          bookId: 0,
          createdAt: '',
          expectedToBeReturnedAt: '',
          status:'pending',
          returnedAt: '',
          message:'',
        },
        editModal:{
          loanId: 0,
          visible: false,
          studentId: 0,
          librarianId: 0,
          bookId: 0,
          createdAt: '',
          expectedToBeReturnedAt: '',
          status:'pending',
          returnedAt: '',
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
    this.getLoans();
  }



  private getLoans(){
      
    api('/api/loan/','get',{},'librarian')
    .then((res: ApiResponse) => {
        if(res.status==="error" || res.status ==="login"){
          this.setLogginState(false);
          return;
        }

        this.putLoansInState(res.data);

    });
  }
  private putLoansInState(data: ApiLoanDto[]) {
    const loans: LoanType[] = data.map(loan => {
            return {
              loanId: loan.loanId,
              studentId: loan.studentId,
              librarianId: loan.librarianId,
              bookId: loan.bookId,
              createdAt: loan.createdAt,
              expectedToBeReturnedAt: loan.expectedToBeReturnedAt,
              status:loan.status,
              returnedAt: loan.returnedAt,
            };
          });
      
          const newState = Object.assign(this.state,{
            loans: loans,
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
                        <FontAwesomeIcon icon={ faListAlt }/> Loans
                    </Card.Title>
                    <Table hover size="sm" bordered>
                      <thead>
                        <tr>
                          <th colSpan={8}></th>
                          <th className="text-center">
                            <Button variant="primary" size="sm"
                            onClick={()=> this.showAddModal()}>
                              <FontAwesomeIcon icon={faPlus}/> Add
                            </Button>
                          </th>
                        </tr>
                        <tr>
                          <th>ID</th>
                          <th>Student</th>
                          <th>Librarian</th>
                          <th>Book</th>
                          <th>Created At</th>
                          <th>Expected to be returned at</th>
                          <th>Status</th>
                          <th>Returned at</th>
                          <th></th>

                          
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.loans.map(loan=>(
                          <tr>
                            <td className="text-right">{loan.loanId}</td>
                            <td>{loan.studentId}</td>
                            <td>{loan.librarianId}</td>
                            <td>{loan.bookId}</td>
                            <td>{loan.createdAt}</td>
                            <td>{loan.expectedToBeReturnedAt}</td>
                            <td>{loan.status}</td>
                            <td>{loan.returnedAt}</td>
                            <td className="text-center">
                              <Button variant="info" size="sm"
                              onClick={()=> this.showEditModal(loan)}>
                              <FontAwesomeIcon icon={faEdit}/>Edit
                                </Button></td>
                          </tr>
                        ),this)}
                      </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Modal size="lg" centered show={this.state.addModal.visible} onHide={()=> this.setAddModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add new loan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="studentId">Student</Form.Label>
                      <Form.Control id="studentId" type="text" value={this.state.addModal.studentId}
                      onChange={(e)=>this.setAddModalNumbeFieldState('studentId',Number(e.target.value))}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="librarianId">Image URL</Form.Label>
                      <Form.Control id="librarianId" type="url" value={this.state.addModal.librarianId}
                      onChange={(e)=>this.setAddModalNumbeFieldState('librarianId',Number(e.target.value))}/>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={()=> this.doAddLoan()}>
                      <FontAwesomeIcon icon={ faPlus }/> Add new loan
                      </Button>
                    </Form.Group>
                    {this.state.addModal.message ?(
                      <Alert variant="danger" value={this.state.addModal.message}></Alert>
                    ):''}
                </Modal.Body>
            </Modal>

            <Modal size="lg" centered show={this.state.editModal.visible} onHide={()=> this.setEditModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit new loan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="studentId">Student</Form.Label>
                      <Form.Control id="studentId" type="text" value={this.state.editModal.studentId}
                      onChange={(e)=>this.setEditModalNumbeFieldState('name',Number(e.target.value))}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="librarianId">Image URL</Form.Label>
                      <Form.Control id="librarianId" type="url" value={this.state.editModal.librarianId}
                      onChange={(e)=>this.setEditModalNumbeFieldState('librarianId',Number(e.target.value))}/>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={()=> this.doEditLoan()}>
                      <FontAwesomeIcon icon={ faEdit }/> Edit loan
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

  private showAddModal(){
    this.setAddModalNumbeFieldState('studentId', 0);
    this.setAddModalNumbeFieldState('librarianId', 0);
    this.setAddModalStringFieldState('message','');
    this.setAddModalVisibleState(true);
    
  }

  private doAddLoan(){
    api('/api/loan/','post',{
        studentId:this.state.addModal.studentId,
        librarianId: this.state.addModal.librarianId
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
      this.getLoans();

    });
  }

  private showEditModal(loan: LoanType){
    this.setEditModalNumbeFieldState('studentId', Number( loan.studentId));
    this.setEditModalNumbeFieldState('librarianId', Number(loan.librarianId));
    this.setEditModalNumbeFieldState('loanId', Number(loan.loanId));
    this.setEditModalVisibleState(true);
    
  }
private doEditLoan(){
  api('/api/loan/'+this.state.editModal.loanId,'patch',{
    studentId:this.state.editModal.studentId,
    librarianId: this.state.editModal.librarianId
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
    this.getLoans();

  });
}
  
 
}

export default LibrarianDashboardLoan;
