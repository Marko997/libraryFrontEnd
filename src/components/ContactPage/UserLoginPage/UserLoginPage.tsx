import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class UserLoginPage extends React.Component{
    render(){
        return(
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>
                    <FontAwesomeIcon icon={ faSignInAlt }/> User Login form 
                    </Card.Title>
                    <Card.Text>
                        Comming soon...
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
        );
    }
}