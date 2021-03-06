import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RoledMainManu from '../RoledMainMenu/RoledMainManu';

interface LibrarianDashboardState{
    isLibrarianLoggedIn: boolean;
}


class LibrarianDashboard extends React.Component {
  state: LibrarianDashboardState;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
        isLibrarianLoggedIn: true,
    }
    

  }

  componentDidMount(){
    this.getMyData();
  }

  componentDidUpdate(){
    this.getMyData();
  }

  private getMyData(){
      
    api('/api/librarian/','get',{},'librarian')
    .then((res: ApiResponse) => {
        if(res.status==="error" || res.status ==="login"){
          this.setLogginState(false);
          return;
        }
    });
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
                        <FontAwesomeIcon icon={ faHome }/> Librarian Dashboard
                    </Card.Title>
                    <ul>
                        <li><Link to="/librarian/dashboard/category">Categories</Link></li>
                        <li><Link to="/librarian/dashboard/author">Author</Link></li>
                        <li><Link to="/librarian/dashboard/book">Book</Link></li>
                        <li><Link to="/librarian/dashboard/loan">Loan</Link></li>
                        <li><Link to="/librarian/dashboard/reservation">Reservations</Link></li>

                    </ul>
                </Card.Body>
            </Card>
      </Container>
    );
  }

 
}

export default LibrarianDashboard;
