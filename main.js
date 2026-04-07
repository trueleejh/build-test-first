class LottoBall extends HTMLElement {
    static get observedAttributes() {
        return ['number'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    getColor(num) {
        const n = parseInt(num, 10);
        if (n <= 10) return '#f44336'; // Red
        if (n <= 20) return '#ffc107'; // Amber
        if (n <= 30) return '#4caf50'; // Green
        if (n <= 40) return '#2196f3'; // Blue
        return '#673ab7'; // Deep Purple
    }

    render() {
        const number = this.getAttribute('number');
        if (!number) return;

        const backgroundColor = this.getColor(number);
        // Use black text for amber balls for better contrast
        const textColor = (parseInt(number, 10) > 10 && parseInt(number, 10) <= 20) ? '#000000' : '#FFFFFF';

        this.shadowRoot.innerHTML = `
            <style>
                .lotto-ball {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    color: ${textColor};
                    background-color: ${backgroundColor};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    font-weight: bold;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    margin: 0 5px;
                    animation: popIn 0.3s ease-out;
                }
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
            <div class="lotto-ball">${number}</div>
        `;
    }
}

customElements.define('lotto-ball', LottoBall);

// Lotto Generation Logic
document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while(numbers.size < 7) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const numbersArray = Array.from(numbers);
    const bonusNumber = numbersArray.pop(); // Take the last one as bonus
    const sortedNumbers = numbersArray.sort((a, b) => a - b);

    // Render regular numbers
    sortedNumbers.forEach((number, index) => {
        setTimeout(() => {
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', number);
            lottoNumbersContainer.appendChild(lottoBall);
            
            // If it's the last regular number, add the bonus ball after a delay
            if (index === sortedNumbers.length - 1) {
                setTimeout(() => {
                    const separator = document.createElement('span');
                    separator.className = 'bonus-separator';
                    separator.textContent = '+';
                    lottoNumbersContainer.appendChild(separator);

                    const bonusBall = document.createElement('lotto-ball');
                    bonusBall.setAttribute('number', bonusNumber);
                    lottoNumbersContainer.appendChild(bonusBall);
                }, 100);
            }
        }, index * 100);
    });
});

// Theme Switching Logic
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = 'Dark Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = 'Light Mode';
    }
});
