class LottoBall extends HTMLElement {
    static get observedAttributes() {
        return ['number', 'type', 'color'];
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

    getLottoColor(num) {
        const n = parseInt(num, 10);
        if (n <= 10) return '#f44336'; // Red
        if (n <= 20) return '#ffc107'; // Amber
        if (n <= 30) return '#4caf50'; // Green
        if (n <= 40) return '#2196f3'; // Blue
        return '#673ab7'; // Deep Purple
    }

    render() {
        const number = this.getAttribute('number');
        const type = this.getAttribute('type') || 'lotto';
        const customColor = this.getAttribute('color');
        
        if (number === null) return;

        let backgroundColor = customColor || (type === 'lotto' ? this.getLottoColor(number) : '#607d8b');
        
        // Adjust text color for visibility
        let textColor = '#FFFFFF';
        if (type === 'lotto') {
            const n = parseInt(number, 10);
            if (n > 10 && n <= 20) textColor = '#000000';
        } else if (customColor === '#ffeb3b') { // Yellow
            textColor = '#000000';
        }

        this.shadowRoot.innerHTML = `
            <style>
                .lotto-ball {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    color: ${textColor};
                    background-color: ${backgroundColor};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
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

// State management
let currentMode = 'lotto'; // 'lotto' or 'pension'

const mainTitle = document.getElementById('main-title');
const lottoModeBtn = document.getElementById('lotto-mode-btn');
const pensionModeBtn = document.getElementById('pension-mode-btn');
const numbersContainer = document.getElementById('numbers-container');
const generateBtn = document.getElementById('generate-btn');

function setMode(mode) {
    currentMode = mode;
    numbersContainer.innerHTML = '';
    
    if (mode === 'lotto') {
        mainTitle.textContent = 'Lotto 6/45 Generator';
        lottoModeBtn.classList.add('active');
        pensionModeBtn.classList.remove('active');
    } else {
        mainTitle.textContent = 'Pension 720+ Generator';
        pensionModeBtn.classList.add('active');
        lottoModeBtn.classList.remove('active');
    }
}

lottoModeBtn.addEventListener('click', () => setMode('lotto'));
pensionModeBtn.addEventListener('click', () => setMode('pension'));

function generateLotto() {
    numbersContainer.innerHTML = '';
    const numbers = new Set();
    while(numbers.size < 7) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const numbersArray = Array.from(numbers);
    const bonusNumber = numbersArray.pop();
    const sortedNumbers = numbersArray.sort((a, b) => a - b);

    sortedNumbers.forEach((number, index) => {
        setTimeout(() => {
            const ball = document.createElement('lotto-ball');
            ball.setAttribute('number', number);
            ball.setAttribute('type', 'lotto');
            numbersContainer.appendChild(ball);
            
            if (index === sortedNumbers.length - 1) {
                setTimeout(() => {
                    const separator = document.createElement('span');
                    separator.className = 'bonus-separator';
                    separator.textContent = '+';
                    numbersContainer.appendChild(separator);

                    const bonusBall = document.createElement('lotto-ball');
                    bonusBall.setAttribute('number', bonusNumber);
                    bonusBall.setAttribute('type', 'lotto');
                    numbersContainer.appendChild(bonusBall);
                }, 100);
            }
        }, index * 100);
    });
}

function generatePension() {
    numbersContainer.innerHTML = '';
    
    // Group: 1-5
    const group = Math.floor(Math.random() * 5) + 1;
    // 6 digits: 0-9
    const digits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
    
    // Pension colors for each digit (official-ish)
    const colors = [
        '#f44336', // Red (1st)
        '#ff9800', // Orange (2nd)
        '#ffeb3b', // Yellow (3rd)
        '#2196f3', // Blue (4th)
        '#9c27b0', // Purple (5th)
        '#9e9e9e'  // Grey (6th)
    ];

    // Render group
    const groupBall = document.createElement('lotto-ball');
    groupBall.setAttribute('number', group);
    groupBall.setAttribute('type', 'pension');
    groupBall.setAttribute('color', '#333333');
    numbersContainer.appendChild(groupBall);

    const groupLabel = document.createElement('span');
    groupLabel.className = 'pension-label';
    groupLabel.textContent = '조';
    numbersContainer.appendChild(groupLabel);

    // Render digits
    digits.forEach((digit, index) => {
        setTimeout(() => {
            const ball = document.createElement('lotto-ball');
            ball.setAttribute('number', digit);
            ball.setAttribute('type', 'pension');
            ball.setAttribute('color', colors[index]);
            numbersContainer.appendChild(ball);
        }, (index + 1) * 100);
    });
}

generateBtn.addEventListener('click', () => {
    if (currentMode === 'lotto') {
        generateLotto();
    } else {
        generatePension();
    }
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

// Initialize
setMode('lotto');
