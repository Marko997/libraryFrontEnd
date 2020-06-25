import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RoledMainManu from '../RoledMainMenu/RoledMainManu';
import LoanType from '../../types/LoanType';
import ApiLoanDto from '../../dtos/ApiLoanDto';

interface LoanPageState{
    isStudentLoggedIn: boolean;
    loans: LoanType[];

    
}

interface LoanProperties{
  match:{
    params:{
      sId: number;
    }
  }
}


class LoanPage extends React.Component<LoanProperties> {
  state: LoanPageState;

  constructor(props: Readonly<LoanProperties>){
    super(props);

    this.state = {
        isStudentLoggedIn: true,
        loans: [],

    }
        
    }
    
  

  

  componentDidMount(){
    this.getLoans();
  }
  componentDidUpdate(oldProps: any){
    if(this.props.match.params.sId === oldProps){
      return;
    }
    this.getLoans();
  }



  private getLoans(){
      
    api('/api/loan/?filter=studentId||$eq||'+this.props.match.params.sId,'get',{},'student')
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
 
  

 
  private setLogginState(isStudentLoggedIn: boolean){
    const newState = Object.assign(this.state, {
        isStudentLoggedIn: isStudentLoggedIn,
    });
    this.setState(newState);
}

  render(){

    if(this.state.isStudentLoggedIn===false){
      return(
          <Redirect to="/student/login"/>
      )
    }

    return (
      <Container>
          <RoledMainManu role="student"/>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> Loans
                    </Card.Title>
                    <Table hover size="sm" bordered>
                      <thead>
                        <tr>
                          <th colSpan={8}></th>
                         
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
                            
                          </tr>
                        ),this)}
                      </tbody>
                    </Table>
                </Card.Body>
            </Card>
            

            
      </Container>
    );
  }

  
  
 
}

export default LoanPage;
