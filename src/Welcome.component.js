import './Welcome.component.scss';
import * as React from "react";

const welcomes = ["i mirëpritur", "ongietorri", "дабро запрашаем", "dobrodošli", "добре дошли", "benvinguda",
    "Dobrodošli", "Vítejte", "Velkommen", "Welkom", "Tere tulemast", "Tervetuloa", "Bienvenue", "Benvido",
    "herzlich willkommen", "καλως ΗΡΘΑΤΕ", "Üdvözöljük", "velkominn", "fáilte", "benvenuto", "gaidīts", "laukiamas",
    "добредојден", "merħba", "Velkommen", "Witamy", "bem vinda", "Bine ati venit", "добро пожаловать", "Добродошли",
    "vitajte", "dobrodošli", "Bienvenido", "Välkommen", "ласкаво просимо", "croeso", "באַגריסן", "ողջույն", "xoş",
    "স্বাগত", "欢迎", "歡迎", "მისასალმებელი", "સ્વાગત", "स्वागत हे", "Zoo siab txais tos", "ようこそ", "ಸ್ವಾಗತಾರ್ಹ",
    "Қош келдіңіздер", "ស្វាគមន៍", "환영", "ຍິນດີຕ້ອນຮັບ", "സ്വാഗതം", "आपले स्वागत आहे", "тавтай морилно уу", "ကြိုဆို",
    "स्वागत", "පිළිගැනීමේ", "хуш омадед", "வரவேற்பு", "స్వాగత", "ยินดีต้อนรับ", "Hoşgeldiniz", "خوش آمدید", "Xush kelibsiz",
    "Chào mừng", "أهلا بك", "ברוך הבא", "خوش آمدی", "welkom", "olandiridwa", "barka", "welcome", "amohelehile",
    "soo dhaweyn", "karibu", "welcome", "wamukelekile", "welcome", "maligayang pagdating", "SELAMAT DATANG",
    "sambutan", "tonga soa", "selamat datang", "nau mai", "bonvenon", "akeyi", "gratissimum"];

class WelcomeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            coords: welcomes.map(() => this.createCoord()),
            initialCoords: welcomes.map(() => this.createCoord())
        };
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseMove();
    }

    createCoord() {
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        if ((x > 30) && (x < 70) && (y > 30) && (y < 70)) {
            return this.createCoord();
        }

        return {x, y}
    }

    welcomes() {
        return welcomes.map((welcome, index) =>
            <div className="welcome-word" key={index} style={{
                left: this.state.coords[index].x + '%',
                top: this.state.coords[index].y + '%'
            }}>{welcome.toUpperCase()}</div>)
    }

    render() {
        return (
            <div className="welcome-component">
                {this.welcomes()}
            </div>
        )
    }

    onMouseMove() {
        setInterval(() => {
            this.setState((prev) => ({
                coords: prev.coords.map(coord => {
                    const movementX = (.5 - Math.random());
                    const movementY = (.5 - Math.random());

                    return {
                        x: coord.x + movementX,
                        y: coord.y + movementY
                    }
                })
            }));
        }, 100)
    }
}

export default WelcomeComponent;
