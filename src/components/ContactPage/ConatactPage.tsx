import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RoledMainManu from '../RoledMainMenu/RoledMainManu';

export default class ContactPage extends React.Component{
    render(){
        return(
        <Container>
            <RoledMainManu role="student"/>
            <Card>
                <Card.Body>
                    <Card.Title>
                    <FontAwesomeIcon icon={ faPhone }/> Contact details
                    </Card.Title>
                    <Card.Text>
                        Contact details will come soon...
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
        );
    }
}