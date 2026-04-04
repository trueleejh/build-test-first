class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const number = this.getAttribute('number');

        function getColor(num) {
            const n = parseInt(num, 10);
            if (n <= 10) return '#f44336'; // Red
            if (n <= 20) return '#ffc107'; // Amber
            if (n <= 30) return '#4caf50'; // Green
            if (n <= 40) return '#2196f3'; // Blue
            return '#673ab7'; // Deep Purple
        }

        const backgroundColor = getColor(number);

        const style = document.createElement('style');
        style.textContent = `
            .lotto-ball {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                color: #FFFFFF;
                background-color: ${backgroundColor};
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                font-weight: bold;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                margin: 0 5px; /* Add some margin */
            }
        `;

        const ball = document.createElement('div');
        ball.classList.add('lotto-ball');
        ball.textContent = number;

        shadow.appendChild(style);
        shadow.appendChild(ball);
    }
}

customElements.define('lotto-ball', LottoBall);

document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while(numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
});
