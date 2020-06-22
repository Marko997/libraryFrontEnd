import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { ApiConfig } from '../config/api.config';
import { Link } from 'react-router-dom';
import BookType from '../types/BookType';

interface SingleBookPreviewProperties{
    book: BookType,
}



export default class SingleBookPreview  extends React.Component<SingleBookPreviewProperties>{

    // constructor(props: Readonly<SingleBookPreviewProperties>){
    //     super(props);
    // }

    render(){
        return(
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Header>
                        <img alt={this.props.book.title}
                            src={ ApiConfig.PHOTO_PATH+'small/'+ this.props.book.imageUrl}
                            className="w-100"/>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as ="p">
                            <strong>{this.props.book.title}</strong>
                        </Card.Title>
                        <Card.Text>
                            { this.props.book.excerpt }
                        </Card.Text>

                        <Link to={ `/book/${this.props.book.bookId}`}
                            className="btn btn-primary btn-block btn-sm">
                                 Open book page
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}