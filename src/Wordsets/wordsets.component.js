import * as React from "react";

class WordsetsComponent extends React.Component {
    constructor(props) {
        super(props);

        fetch('http://localhost:5000/data/languages?payload=' + localStorage.getItem('authToken'));
    }

    render() {
        return (
            <div>Wordsets works</div>
                )
    }
}

export default WordsetsComponent;
