import React from "react";
import { Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import CategoryType from "../../types/CategoryType";
import BookType from "../../types/BookType";
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";

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
}

export default class CategoryPage extends React.Component<CategoryPageProperites>{
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperites>){
        super(props);

        this.state = {
            isStudentLoggedIn: true,
            message: '',
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

    render(){

        if(this.state.isStudentLoggedIn ===false){
            return(
                <Redirect to="/student/login"/>
            );
        }

        return (
            <Container>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> {this.state.category?.name}
                    </Card.Title>
                    {this.printOptionalMessage()}
                    <Card.Text>
                        Comming soon...
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
        );
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
        api('api/category'+this.props.match.params.id,'get',{})
        .then((res: ApiResponse) =>{
            if(res.status ==="login"){
                this.setLogginState(false);
            }

            if(res.status === 'error'){
                return this.setMessage('Request error please try to refresh page!');
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            };
            this.setCategoryData(categoryData);

        })
    }
}