import React from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import CategoryType from "../../types/CategoryType";
import BookType from "../../types/BookType";
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import SingleBookPreview from "../SingleBookPreview";
import RoledMainManu from "../RoledMainMenu/RoledMainManu";

interface CategoryPageProperites{
    match: {
        params: {
            id: number;
        }
    }
}

interface CategoryPageState{
    isStudentLoggedIn: boolean;
    category?: CategoryType;
    books?: BookType[];
    message: string;
    filters: {
        keywords: string;
        order: "title asc" | "title desc";
    };
}

interface BookDto{
    bookId: number;
    title: string;
    excerpt?: string;
    description?: string;
    photos?:{
        imagePath: string;
    }[];
    isbn?: string;

}

export default class CategoryPage extends React.Component<CategoryPageProperites>{
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperites>){
        super(props);

        this.state = {
            isStudentLoggedIn: true,
            message: '',
            filters:{
                keywords: '',
                order: "title asc"
            }
         }; 
    }

    private setLogginState(isLoggedIn: boolean){
        const newState = Object.assign(this.state,{
            isStudentLoggedIn: isLoggedIn,
        })
        this.setState(newState);
    }

    private setMessage(message:string){
        const newState = Object.assign(this.state,{
            message:message,
        })
        this.setState(newState);
    }
    private setCategoryData(category:CategoryType){
        const newState = Object.assign(this.state,{
            category:category,
        })
        this.setState(newState);
    }

    private setBooks(books:BookType[]){
        const newState = Object.assign(this.state,{
            books:books,
        })
        this.setState(newState);
    }

    render(){

        if(this.state.isStudentLoggedIn ===false){
            return(
                <Redirect to="/student/login"/>
            );
        }

        return (
            <Container>
                <RoledMainManu role="student"/>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> {this.state.category?.name}
                    </Card.Title>
                    {this.printOptionalMessage()}

                    <Row>
                        <Col xs="12" md="4" lg="3">
                            {this.printFilters()}
                        </Col>
                        <Col xs="12" md="8" lg="9">
                            {this.showBooks()}
                        </Col>
                    </Row>
                   

                </Card.Body>
            </Card>
        </Container>
        );
    }
    private setNewFilter(filter:any){
        this.setState(Object.assign(this.state,{
            filter: filter,
        }));
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>){
        this.setNewFilter(Object.assign(this.state.filters,{
            keywords: event.target.value,
        }));
    }
    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>){
        this.setNewFilter(Object.assign(this.state.filters,{
            order: event.target.value,
        }));
    }
    private applyFilters(){
        this.getCategoryData();
    }

    private printFilters(){
        return(
            <>
                <Form.Group>
                    <Form.Label htmlFor="keywords">Search keywords</Form.Label>
                    <Form.Control type ="text" 
                    id="keywords" 
                    value={this.state.filters.keywords}
                    onChange={(e)=>this.filterKeywordsChanged(e as any)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Control as="select" 
                    id="sortOrder" 
                    value={this.state.filters.order}
                    onChange={(e)=> this.filterOrderChanged(e as any)}>
                        <option value="title asc"> Sort by title - ascending</option>
                        <option value="title desc"> Sort by title - descending</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Button variant="primary" block onClick={ ()=>this.applyFilters()}>
                        <FontAwesomeIcon icon={faSearch}/> Search
                    </Button>
                </Form.Group>
            </>
        )
    }

    private printOptionalMessage(){
        if(this.state.message ===''){
            return;
        }
        return (
            <Card.Text>
                {this.state.message}
            </Card.Text>
        );
    }

    private showBooks(){
        if(this.state.books?.length ===0){
            return(
                <div>There are no book to show!</div>
            );
        }
        return(
            <Row>
                {this.state.books?.map(this.singleBook)}
            </Row>
        );
    }

    private singleBook(book: BookType){
        return(
            <SingleBookPreview book={book}/>)
    }

    componentDidMount(){
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperites){
        if(oldProperties.match.params.id === this.props.match.params.id){
            return;
        }
        this.getCategoryData();
    }

    getCategoryData(){
        api('api/category/'+this.props.match.params.id,'get',{},"librarian"&&"student")
        .then((res: ApiResponse) =>{
            if(res.status ==="login"){
                this.setLogginState(false);
            }

            if(res.status === 'error'){
                return this.setMessage('Request error please try to refresh page!');
            }
            if(res.data.statusCode === 0){
                this.setMessage('');
                this.setBooks([]);
                return; 

            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            };
            this.setCategoryData(categoryData);

        });

        const orderParts = this.state.filters.order.split(' ');
        const orderBy = orderParts[0];
        const orderDirection = orderParts[1].toUpperCase();

        api('api/book/search','post',{
            keywords: this.state.filters?.keywords,
            categoryId: Number(this.props.match.params.id),
            
            orderBy: orderBy,
            orderDirection: orderDirection,

        },"librarian"&&"student")
        .then((res: ApiResponse) =>{
            if(res.status ==='login'){
                this.setLogginState(false);
            }

            if(res.status === 'error'){
                return this.setMessage('Request error please try to refresh page!');
            }
            if (res.data.statusCode === 0) {
                this.setMessage('');
                this.setBooks([]);
                return;
            }

            const books: BookType[]=
            res.data.map((book: BookDto)=>{

                const object: BookType={

                bookId: book.bookId,
                title: book.title,
                excerpt: book.excerpt,
                description: book.description,
                imageUrl: '',
                isbn: book.isbn,                
                };

                if (book.photos !== undefined && book.photos?.length > 0) {
                    object.imageUrl = book.photos[book.photos?.length-1].imagePath;
                }

                return object;
            });

            this.setBooks(books);

        });
    }


}