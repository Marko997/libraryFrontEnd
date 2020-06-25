import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave, faImages } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, {ApiResponse, apiFile} from '../../api/api';
import RoledMainManu from '../RoledMainMenu/RoledMainManu';
import BookType from '../../types/BookType';
import ApiBookDto from '../../dtos/ApiBookDto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';
import AuthorType from '../../types/AuthorType';
import ApiAuthorDto from '../../dtos/ApiAuthorDto';

interface LibrarianDashboardBookState{
    isLibrarianLoggedIn: boolean;
    books: BookType[];
    categories: CategoryType[];
    authors: AuthorType[];
    status:string[];

    addModal:{
      visible: boolean;
      title: string;
      categoryId: number;
      excerpt: string;
      description: string;
      isbn: string;
      status: string;
      author:{
        authorId: number;
        forename: string;
        surename: string;
      };


      message:string
    };
    editModal:{
      
      visible: boolean;
      bookId: number;
      title: string;
      categoryId: number;
      excerpt: string;
      description: string;
      isbn: string;
      status: string;
      author:{
        authorId: number;
        forename: string;
        surename: string;
      };
      message:string
    };
}


class LibrarianDashboardBook extends React.Component {
  state: LibrarianDashboardBookState;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
        isLibrarianLoggedIn: true,
        books: [],
        categories:[],
        authors:[],
        status:[
            "rented",
            "lost",
            "destroyed",
            "avaiable",
            "not-avaiable",
            "reserved",],

        addModal:{
          visible: false,
          title: '',
          categoryId: 1,
          excerpt: '',
          description: '',
          isbn: '',
          status: 'avaiable',
          author:{
          authorId: 1,
          forename: '',
          surename: '',
      },
          message:'',
        },
        editModal:{
          bookId: 0,
          visible: false,
          title: '',
          categoryId: 1,
          excerpt: '',
          description: '',
          isbn: '',
          status: 'avaiable',
          author:{
          authorId: 1,
          forename: '',
          surename: '',
      },
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
      [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
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
      [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
    })));
  }

  componentDidMount(){
    this.getBooks();
    this.getCategories();
    this.getAuthors();
  }

  private getCategories() {
    api('api/category', 'get',{},'librarian')
        .then((res: ApiResponse) => {
          if(res.status==="error" || res.status ==="login"){
            this.setLogginState(false);
            return;
          }
    
          this.putCategoriesInState(res.data);
    
        });
  }

  private putCategoriesInState(data?: ApiCategoryDto[]) {
    const categories: CategoryType[] | undefined = data?.map(category => {
            return {
              categoryId: category.categoryId,
              name: category.name,
              
            };
          });
      
          const newState = Object.assign(this.state,{
            categories: categories,
          });
          this.setState(newState);
  }

  private getAuthors() {
    api('api/author', 'get',{},'librarian')
        .then((res: ApiResponse) => {
          if(res.status==="error" || res.status ==="login"){
            this.setLogginState(false);
            return;
          }
    
          this.putAuthorsInState(res.data);
    
        });
  }

  private putAuthorsInState(data?: ApiAuthorDto[]) {
    const authors: AuthorType[] | undefined = data?.map(author => {
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

  private getBooks(){
      
    api('/api/book/?join=author&join=photos&join=category','get',{},'librarian')
    .then((res: ApiResponse) => {
        if(res.status==="error" || res.status ==="login"){
          this.setLogginState(false);
          return;
        }

        this.putBooksInState(res.data);

    });
  }
  private putBooksInState(data?: ApiBookDto[]) {
    const books: BookType[] | undefined= data?.map(book => {
            return {
                bookId: book.bookId,
                title: book.title,
                excerpt: book.excerpt,
                description: book.description,
                imageUrl: book.photos[0].imagePath,
                isbn: book.isbn,

                status: book.status,
                author: book.author,
                photos: book.photos,
                category: book.category,
                categoryId: book.categoryId,

              
              
            };
          });
      
          const newState = Object.assign(this.state,{
            books: books,
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
                        <FontAwesomeIcon icon={ faListAlt }/> Books
                    </Card.Title>
                    <Table hover size="sm" bordered>
                      <thead>
                        <tr>
                          <th colSpan={7}></th>
                          <th className="text-center">
                            <Button variant="primary" size="sm"
                            onClick={()=> this.showAddModal()}>
                              <FontAwesomeIcon icon={faPlus}/> Add
                            </Button>
                          </th>
                        </tr>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Author forename</th>
                          <th>Author surename</th>
                          <th className="text-right">Isbn</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.books.map(book=>(
                          <tr>
                            <td className="text-right">{book.bookId}</td>
                            <td>{book.title}</td>
                            <td>{book.category?.name}</td>
                            <td>{book.author?.forename}</td>
                            <td>{book.author?.surename}</td>
                            <td className="text-right">{book.isbn}</td>
                            <td>{book.status}</td>
                            <td className="text-center">
                                <Link to={"/librarian/dashboard/photo/"+book.bookId}
                                  className="btn btn-sm btn-info mr-3"
                                >
                                  <FontAwesomeIcon icon = {faImages}/> Photos
                                </Link>
                              <Button variant="info" size="sm"
                              onClick={()=> this.showEditModal(book)}>
                              <FontAwesomeIcon icon={faEdit}/>Edit
                                </Button></td>
                          </tr>
                        ),this)}
                      </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Modal size="lg" centered show={this.state.addModal.visible} 
            onHide={()=> this.setAddModalVisibleState(false)}
            onEntered={ ()=>{if(document.getElementById('add-photo'))
                                {const filePicker:any = document.getElementById('add-photo');
                                filePicker.value='';}}}>
                <Modal.Header closeButton>
                  <Modal.Title>Add new book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="add-title">Title</Form.Label>
                      <Form.Control id="add-title" type="text" value={this.state.addModal.title}
                      onChange={(e)=>this.setAddModalStringFieldState('title',e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-excerpt">Short text</Form.Label>
                      <Form.Control id="add-excerpt" type="text"  value={this.state.addModal.excerpt}
                      onChange={(e)=>this.setAddModalStringFieldState('excerpt',e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-description">Detailed text</Form.Label>
                      <Form.Control id="add-description" type="textarea"  value={this.state.addModal.description}
                      onChange={(e)=>this.setAddModalStringFieldState('description',e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-categortyId">Category</Form.Label>
                      <Form.Control id="add-categortyId" as="select" value={this.state.addModal.categoryId.toString()}
                      onChange={(e)=>this.setAddModalNumbeFieldState('categortyId',e.target.value)}>
                      {this.state.categories.map(category => (
                          <option value={category.categoryId?.toString()}>
                              {category.name}
                          </option>
                      ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-authorId">Author</Form.Label>
                      <Form.Control id="add-authorId" as="select" value={this.state.addModal.author.authorId.toString()}
                      onChange={(e)=>this.setAddModalNumbeFieldState('authorId',e.target.value)}>
                      {this.state.authors.map(author => (
                          <option value={author.authorId?.toString()}>
                              {author.forename} {author.surename}
                          </option>
                      ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-isbn">Isbn</Form.Label>
                      <Form.Control id="add-isbn" type="text"  value={this.state.addModal.isbn}
                      onChange={(e)=>this.setAddModalStringFieldState('isbn',e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-photo">Book photo</Form.Label>
                      <Form.File id="add-photo" />
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={()=> this.doAddBook()}>
                      <FontAwesomeIcon icon={ faPlus }/> Add new book
                      </Button>
                    </Form.Group>
                    {this.state.addModal.message ?(
                      <Alert variant="danger" value={this.state.addModal.message}></Alert>
                    ):''}
                </Modal.Body>
            </Modal>

            <Modal size="lg" centered show={this.state.editModal.visible} onHide={()=> this.setEditModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Group>
                      <Form.Label htmlFor="add-title">Title</Form.Label>
                      <Form.Control id="add-title" type="text" value={this.state.addModal.title}
                      onChange={(e)=>this.setAddModalStringFieldState('name',e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-excerpt">Short text</Form.Label>
                      <Form.Control id="add-excerpt" type="text"  value={this.state.addModal.excerpt}
                      onChange={(e)=>this.setAddModalStringFieldState('excerpt',e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-description">Detailed text</Form.Label>
                      <Form.Control id="add-description" type="textarea"  value={this.state.addModal.description}
                      onChange={(e)=>this.setAddModalStringFieldState('description',e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-categortyId">Category</Form.Label>
                      <Form.Control id="add-categortyId" as="select" value={this.state.addModal.categoryId.toString()}
                      onChange={(e)=>this.setAddModalNumbeFieldState('categortyId',e.target.value)}>
                      {this.state.categories.map(category => (
                          <option value={category.categoryId?.toString()}>
                              {category.name}
                          </option>
                      ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-status">Status</Form.Label>
                      <Form.Control id="add-status" as="select" value={this.state.addModal.status.toString()}
                      onChange={(e)=>this.setAddModalStringFieldState('status',e.target.value)}>
                      <option value="rented">Rented</option>
                      <option value="destroyed">Destroyed</option>
                      <option value="avaiable">Avaiable</option>
                      <option value="not-avaiable">Not avaiable</option>
                      <option value="reserved">Reserved</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="add-isbn">Isbn</Form.Label>
                      <Form.Control id="add-isbn" type="text"  value={this.state.addModal.isbn}
                      onChange={(e)=>this.setAddModalStringFieldState('isbn',e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={()=> this.doEditBook()}>
                      <FontAwesomeIcon icon={ faSave }/> Edit book
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
    this.setAddModalStringFieldState('title', '');
    this.setAddModalStringFieldState('excerpt', '');
    this.setAddModalStringFieldState('description','');
    this.setAddModalStringFieldState('categoryId','0');
    this.setAddModalStringFieldState('authorId','0');
    this.setAddModalStringFieldState('isbn','');


    this.setAddModalVisibleState(true);
    
    
  }

  private doAddBook(){
      const filePicker: any = document.getElementById('add-photo');
    if(filePicker?.files.length ===0){
          this.setAddModalStringFieldState('message','You must select a file to upload!');
          return;
    }

    api('/api/book/','post',{
        title:this.state.addModal.title,
        categoryId: this.state.addModal.categoryId,
        authorId: this.state.addModal.author.authorId,
        excerpt:this.state.addModal.excerpt,
        description: this.state.addModal.description,
        isbn: this.state.addModal.isbn,


    },'librarian')
    .then(async(res: ApiResponse) => {
      if(res.status ==="login"){
        this.setLogginState(false);
        return;
      }
      if(res.status ==="error"){
        this.setAddModalStringFieldState('message',JSON.stringify(res.data));
        return;
      }

     

      const bookId: number = res.data.bookId;
      const file = filePicker.files[0];

      await this.uploadBookPhoto(bookId, file);

      


      this.setAddModalVisibleState(false);
      this.getBooks();

    });
  }

  private async uploadBookPhoto(bookId: number, file:File){
      return await apiFile('/api/book/'+bookId +'/uploadPhoto/','photo',file,'librarian');

  }

  private showEditModal(book: BookType){

    this.setEditModalStringFieldState('message', '');
    this.setEditModalNumbeFieldState('bookId', String(book.bookId));
    this.setEditModalStringFieldState('title', String(book.title));
    this.setEditModalStringFieldState('excerpt', String(book.excerpt));
    this.setEditModalStringFieldState('description',String(book.description));
    this.setEditModalStringFieldState('status',String(book.status));
    this.setEditModalNumbeFieldState('categoryId',String(book.categoryId));
    this.setEditModalStringFieldState('authorId',String(book.author?.authorId));
    this.setEditModalStringFieldState('isbn',String(book.isbn));
    this.setEditModalVisibleState(true);
    
  }
private doEditBook(){
  api('/api/book/'+this.state.editModal.bookId,'patch',{
    title:this.state.editModal.title,
    categoryId: this.state.editModal.categoryId,
    authorId: this.state.editModal.author.authorId,
    excerpt:this.state.editModal.excerpt,
    description: this.state.editModal.description,
    isbn: this.state.editModal.isbn,
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
    this.getBooks();

  });
}
  
 
}

export default LibrarianDashboardBook;
