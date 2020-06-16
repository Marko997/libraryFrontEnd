import React from "react";
import { Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faListAlt } from "@fortawesome/free-solid-svg-icons";
import CategoryType from "../../types/CategoryType";

interface CategoryPageProperites{
    match: {
        params: {
            id: number;
        }
    }
}

interface CategoryPageState{
    category?: CategoryType;
}

export default class CategoryPage extends React.Component<CategoryPageProperites>{
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperites>){
        super(props);

        this.state = { }; 
    }

    render(){
        return (
            <Container>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt }/> {this.state.category?.name}
                    </Card.Title>
                    <Card.Text>
                        Comming soon...
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
        );
    }

    componentWillMount(){
        this.getCategoryData();
    }

    componentWillReceiveProps(newProperties: CategoryPageProperites){
        if(newProperties.match.params.id === this.props.match.params.id){
            return;
        }
        this.getCategoryData();
    }

    getCategoryData(){
        setTimeout(()=> {
            const data: CategoryType = {
                name: 'Category ' + this.props.match.params.id,
                categoryId: this.props.match.params.id,
                items: []
            };
            this.setState({
                category: data,
            })
        },750);
    }
}