import React from 'react';
import { Container, Card, Row, Col, Button, Form, Nav} from 'react-bootstrap';
import { faImages, faMinus, faPlus, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse, apiFile } from '../../api/api';
import RoledMainManu from '../RoledMainMenu/RoledMainManu';
import PhotoType from '../../types/PhotoType';
import { ApiConfig } from '../../config/api.config';


interface LibrarianDashboardPhotoProperties{
    match:{
        params:{
            bId: number;
        }
    }
}

interface LibrarianDashboardPhotoState {
    isLibrarianLoggedIn: boolean;
    photos: PhotoType[];

}

class LibrarianDashboardPhoto extends React.Component<LibrarianDashboardPhotoProperties> {
    state: LibrarianDashboardPhotoState;

    constructor(props: Readonly<LibrarianDashboardPhotoProperties>) {
        super(props);

        this.state = {
            isLibrarianLoggedIn: true,
            photos: [],

            
        };
    }

   
    componentDidMount() {
        this.getPhotos();
    }

    componentDidUpdate(oldProps: any) {
        if(this.props.match.params.bId === oldProps.match.params.bId){
            return;
        }
        this.getPhotos();
    }

    private getPhotos() {
        api('/api/book/'+this.props.match.params.bId + '/?join=photos', 'get', {}, 'librarian')
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            this.putPhotosInState(res.data.photos)
        });
    }

    private putPhotosInState(data: PhotoType[]){
        this.setState(Object.assign(this.state,{
            photos: data,
        }));
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLibrarianLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }



    render() {
        if (this.state.isLibrarianLoggedIn === false) {
            return (
                <Redirect to="/librarian/login" />
            );
        }

        return (
            <Container>
                <RoledMainManu role="librarian" />

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faImages } /> Photos
                        </Card.Title>
                        <Nav className="mb-3">
                            <Nav.Item>
                                <Link to="/librarian/dashboard/book" className="btn btn-sm btn-info">
                                <FontAwesomeIcon icon={ faBackward } /> Photos
                                </Link>
                            </Nav.Item>
                        </Nav>

                        <Row>
                            {this.state.photos.map(this.showSinglePhoto,this)}
                        </Row>

                        <Form className="mt-5">
                            <p>
                                <strong>Add a new photo to this book</strong>
                            </p>
                            <Form.Group>
                                <Form.Label htmlFor="add-photo">New book photo</Form.Label>
                                <Form.File id="add-photo" />
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary"
                                onClick={()=> this.doUpload()}>
                                    <FontAwesomeIcon icon={faPlus}/> Upload photo
                                </Button>
                            </Form.Group>
                        </Form>
                        
                    </Card.Body>
                </Card>

               
            </Container>
        );
    }

    private async doUpload(){
        const filePicker: any = document.getElementById('add-photo');
            if(filePicker?.files.length ===0){
          
          return;
    }
    const file = filePicker.files[0];
    await this.uploadBookPhoto(this.props.match.params.bId,file);
    filePicker.value='';

    this.getPhotos();
}

    private async uploadBookPhoto(bookId: number, file:File){
        return await apiFile('/api/book/'+bookId +'/uploadPhoto/','photo',file,'librarian');
  
    }

    private showSinglePhoto(photo:PhotoType){
        return (
            <Col xs="12" sm="6" md="4" lg="3">
                <Card>
                    <Card.Body>
                        <img alt={"Photo"+photo.photoId}
                            src={ApiConfig.PHOTO_PATH+'small/'+photo.imagePath }
                            className="w-100"/>
                    </Card.Body>
                    <Card.Footer>
                        {this.state.photos.length>1?(
                            <Button variant="danger" block
                            onClick={()=>this.deletePhoto(photo.photoId)}
                            >
                                <FontAwesomeIcon icon={faMinus}/>Delete photo
                            </Button>
                        ): ''}
                    </Card.Footer>
                </Card>
            </Col>
        );
    }

    private deletePhoto(photoId: number){
        if(!window.confirm('Are you sure?')){
            return;
        }
        api('/api/book/'+this.props.match.params.bId +'/deletePhoto/'+photoId+"/",'delete',{},'librarian')
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            this.getPhotos();
        });
    }

    
}
export default LibrarianDashboardPhoto;
