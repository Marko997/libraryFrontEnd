import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RoledMainManu from '../RoledMainMenu/RoledMainManu';
import AuthorType from '../../types/AuthorType';
import ApiAuthorDto from '../../dtos/ApiAuthorDto';

interface LibrarianDashboardAuthorState{
    isLibrarianLoggedIn: boolean;
    authors: AuthorType[];

    addModal:{
      visible: boolean;
      forename: string;
      surename: string;
      message:string
    };
    editModal:{
      authorId: number;
      visible: boolean;
      forename: string;
      surename: string;
      message:string
    };
}


class LibrarianDashboardAuthor extends React.Component {
  state: LibrarianDashboardAuthorState;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
        isLibrarianLoggedIn: true,
        authors: [],

        addModal:{
          visible: false,
          forename: '',
          surename: '',
          message:'',
        },
        editModal:{
          authorId: 0,
          visible: false,
          forename: '',
          surename: '',
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
  private setEditModalNumbeFieldState(fieldName: string, newValue:string){
    this.setState(Object.assign(this.state,Object.assign(this.state.editModal,{
      [fieldName]:newValue,
    })));
  }

  componentWillMount(){
    this.getAuthors();
  }



  private getAuthors(){
      
    api('/api/author/','get',{},'librarian')
    .then((res: ApiResponse) => {
        if(res.status==="error" || res.status ==="login"){
          this.setLogginState(false);
          return;
        }

        this.putAuthorsInState(res.data);

    });
  }
  private putAuthorsInState(data: ApiAuthorDto[]) {
    const authors: AuthorType[] = data.map(author => {
            return {
              authorId: author.authorId,
              forename: author.forename,
              surename: author.surename,
            };
          });
      
          const newState = Object.assign(this.state,{
            authors: authors,
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
                        <FontAwesomeIcon icon={ faListAlt }/> Authors
                    </Card.Title>
                    <Table hover size="sm" bordered>
                      <thead>
                        <tr>
                          <th colSpan={3}></th>
                          <th className="text-center">
                            <Button variant="primary" size="sm"
                            onClick={()=> this.showAddModal()}>
                              <FontAwesomeIcon icon={faPlus}/> Add
                            </Button>
                          </th>
                        </tr>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Surename</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.authors.map(author=>(
                          <tr>
                            <td className="text-right">{author.authorId}</td>
                            <td>{author.forename}</td>
                            <td>{author.surename}</td>
                            <td className="text-center">
                              <Button variant="info" size="sm"
                              onClick={()=> this.showEditModal(author)}>
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
                  <Modal.Title>Add new author</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="forename">Name</Form.Label>
                      <Form.Control id="forename" type="text" value={this.state.addModal.forename}
                      onChange={(e)=>this.setAddModalStringFieldState('forename',e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="surename">Surename</Form.Label>
                      <Form.Control id="surename" type="text" value={this.state.addModal.surename}
                      onChange={(e)=>this.setAddModalStringFieldState('surename',e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={()=> this.doAddAuthor()}>
                      <FontAwesomeIcon icon={ faPlus }/> Add new author
                      </Button>
                    </Form.Group>
                    {this.state.addModal.message ?(
                      <Alert variant="danger" value={this.state.addModal.message}></Alert>
                    ):''}
                </Modal.Body>
            </Modal>

            <Modal size="lg" centered show={this.state.editModal.visible} onHide={()=> this.setEditModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit new author</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="forename">Name</Form.Label>
                      <Form.Control id="forename" type="text" value={this.state.editModal.forename}
                      onChange={(e)=>this.setEditModalStringFieldState('forename',e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="surename">Surename</Form.Label>
                      <Form.Control id="surename" type="url" value={this.state.editModal.surename}
                      onChange={(e)=>this.setEditModalStringFieldState('surename',e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={()=> this.doEditAuthor()}>
                      <FontAwesomeIcon icon={ faEdit }/> Edit new author
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
    this.setAddModalStringFieldState('forename', '');
    this.setAddModalStringFieldState('surename', '');
    this.setAddModalStringFieldState('message','');
    this.setAddModalVisibleState(true);
    
  }

  private doAddAuthor(){
    api('/api/author/','post',{
        forename:this.state.addModal.forename,
        surename: this.state.addModal.surename
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
      this.getAuthors();

    });
  }

  private showEditModal(author: AuthorType){
    this.setEditModalStringFieldState('forename', String( author.forename));
    this.setEditModalStringFieldState('surename', String(author.surename));
    this.setEditModalNumbeFieldState('authorId',  author.authorId ? author.authorId?.toString() : 'null');
    this.setEditModalVisibleState(true);
    
  }
private doEditAuthor(){
  api('/api/author/'+this.state.editModal.authorId,'patch',{
    forename:this.state.editModal.forename,
    surename: this.state.editModal.surename
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
    this.getAuthors();

  });
}
  
 
}

export default LibrarianDashboardAuthor;
