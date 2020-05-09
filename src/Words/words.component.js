import * as React from "react";

class WordsComponent extends React.Component {
    constructor(props) {
        super(props);

        fetch('http://localhost:5000/data/languages?payload=' + localStorage.getItem('authToken'));
    }

    render() {
        return (
            <div>Words works</div>
                )
    }
}

export default WordsComponent;
