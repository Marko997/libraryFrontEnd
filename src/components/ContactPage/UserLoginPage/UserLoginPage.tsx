import React from 'react';
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api, {ApiResponse,saveToken,saveRefreshToken} from '../../../api/api'
import { Redirect } from 'react-router-dom';


interface UserLoginPageState {
    username: string;
    password: string;
    errorMessage: string;
    isLogedIn: boolean;
}

export default class UserLoginPage extends React.Component{

    state: UserLoginPageState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isLogedIn: false,
        }
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>){
        const newState = Object.assign(this.state, {
            [ event.target.id ]: event.target.value
        })

        this.setState(newState);
    }

    private setErrorMessage(message: string){
        const newState = Object.assign(this.state, {
            errorMessage: message,
        });
        this.setState(newState);

    }

    private setLogginState(isLogedIn: boolean){
        const newState = Object.assign(this.state, {
            isLogedIn: isLogedIn,
        });
        this.setState(newState);
    }

    private doLogin(){
        api('auth/student/login','post',{
            username: this.state.username,
            password: this.state.password,
        }
        ).then((res: ApiResponse) => {
            if(res.status ==='error'){
                console.log(res.data);
                return;
            }
            if(res.status ==='ok'){
                if(res.data.statusCode !== undefined){
                    let message = '';
                    switch(res.data.statusCode){
                        case -3001: message = 'Unknown username!';break;
                        case -3002: message = 'Bad password!';break;
                    }
                    this.setErrorMessage(message);
                    return;
                }
                saveToken(res.data.token);
                saveRefreshToken(res.data.saveRefreshTOken);

                this.setLogginState(true);
            }
        });
    }

    render(){

        if(this.state.isLogedIn===true){
            return(
                <Redirect to="/"/>
            )
        }

        return(
        <Container>
            <Col md={ { span:6, offset: 3 } }>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={ faSignInAlt }/> User Login 
                        </Card.Title>
                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="username">Username</Form.Label>
                                    <Form.Control type="username" id="username" value = {this.state.username} onChange={ event => this.formInputChanged(event as any) }/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password</Form.Label>
                                    <Form.Control type="password" id="password" value={this.state.password} onChange={ event => this.formInputChanged(event as any) }/>
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary"
                                            onClick={ () => this.doLogin() }>
                                        Log in</Button>
                                </Form.Group>
                            </Form>
                            <Alert variant="danger"
                                    className={ this.state.errorMessage ? '': 'd-none'}>
                                { this.state.errorMessage }
                            </Alert>
                    </Card.Body>
                </Card>
            </Col>
        </Container>
        );
    }
}