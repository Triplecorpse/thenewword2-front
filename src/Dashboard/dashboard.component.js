import * as React from "react";

class DashboardComponent extends React.Component {
    constructor(props) {
        super(props);

        fetch('http://localhost:5000/data/languages?payload=' + localStorage.getItem('authToken'));
    }
    render() {
        return (
            <div>Dashboard works</div>
                )
    }
}

export default DashboardComponent;
