import * as React from "react";
import {Link} from "react-router-dom";

class HeaderComponent extends React.Component {
   render() {
        return (
            <header className="header">
                <nav>
                    <ul>
                        <li>
                            <Link to="/account/dashboard">Статистика</Link>
                        </li>
                        <li>
                            <Link to="/account/wordsets">Набори слів</Link>
                        </li>
                        <li>
                            <Link to="/account/words">Слова</Link>
                        </li>
                    </ul>
                </nav>
            </header>
                )
    }
}

export default HeaderComponent;
