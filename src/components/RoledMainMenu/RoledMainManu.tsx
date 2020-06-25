import React from 'react';
import { MainMenuItem, MainMenu } from '../MainManu/MainMenu';

interface RoledMainManuProperties{
    role: 'student' | 'librarian' | 'visitor';

}


export default class RoledMainManu extends React.Component<RoledMainManuProperties>{
    render(){
        let items: MainMenuItem[] = [];

        switch(this.props.role){
            case 'visitor'   : items = this.getVisitorMenuItems(); break;
            case 'student'   : items = this.getStudentMenuItems(); break;
            case 'librarian' : items = this.getLibrarianMenuItems(); break;

        }

        return <MainMenu items={ items }/>
    }

    getStudentMenuItems(): MainMenuItem[]{
        return [
            new MainMenuItem("Home","/"),
            new MainMenuItem("Contact","/contact/"),
            new MainMenuItem("Loans","/loan/"),
            new MainMenuItem("Log out", "/student/logout"),
        ];

    }
    getLibrarianMenuItems():MainMenuItem[]{
        return [
            new MainMenuItem("Dashboard","/librarian/dashboard"),
            new MainMenuItem("Log out", "/librarian/logout"),
        ];
    }
    getVisitorMenuItems():MainMenuItem[]{
        return [
            new MainMenuItem("Student log in", "/student/login"),
            new MainMenuItem("Librarian log in", "/librarian/login"),
        ];
    }


}