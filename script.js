document.addEventListener('DOMContentLoaded', () => {
    const countersContainer = document.getElementById('counters');
    const addCounterButton = document.getElementById('addCounter');

    const loadCounters = () => {
        const counters = JSON.parse(localStorage.getItem('counters')) || [];
        countersContainer.innerHTML = '';
        counters.forEach((counter, index) => createCounter(counter.name, counter.value, counter.goal, index));
    };

    const saveCounters = () => {
        const counters = [];
        document.querySelectorAll('.counter').forEach(counterElement => {
            counters.push({
                name: counterElement.querySelector('.counter-name').innerText,
                value: parseInt(counterElement.querySelector('.counter-value').innerText),
                goal: parseInt(counterElement.querySelector('.counter-goal').innerText),
            });
        });
        localStorage.setItem('counters', JSON.stringify(counters));
    };

    const updateProgressBar = (counterElement, value, goal) => {
        const percentage = Math.min(100, (value / goal) * 100);
        counterElement.querySelector('.progress-bar').style.width = `${percentage}%`;
        counterElement.querySelector('.progress-bar').innerText = `${Math.round(percentage)}%`;
    };

    const createCounter = (name = 'New Counter', value = 0, goal = 10, index = null) => {
        const counterElement = document.createElement('div');
        counterElement.className = 'counter bg-gray-800 p-6 rounded-lg shadow-md flex flex-col space-y-4';

        counterElement.innerHTML = `
            <div class="flex justify-between items-center">
                <h2 contenteditable="true" class="counter-name text-xl font-semibold flex-grow">${name}</h2>
                <div class="goal-container">
                    <p class="text-sm">Goal:</p>
                    <p contenteditable="true" class="counter-goal">${goal}</p>
                </div>
                <button class="remove bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"></button>
            </div>
            <div class="relative w-full h-4 bg-gray-700 rounded">
                <div class="progress-bar h-full bg-green-500 rounded text-center text-xs text-black font-bold leading-4"></div>
            </div>
            <div class="flex items-center justify-center space-x-4">
                <button class="decrement bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"></button>
                <span class="counter-value text-xl font-bold">${value}</span>
                <button class="increment bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"></button>
            </div>
        `;

        const valueElement = counterElement.querySelector('.counter-value');
        const goalElement = counterElement.querySelector('.counter-goal');

        const updateCounter = () => {
            const value = parseInt(valueElement.innerText);
            const goal = parseInt(goalElement.innerText);
            updateProgressBar(counterElement, value, goal);
            saveCounters();
        };

        counterElement.querySelector('.increment').addEventListener('click', () => {
            valueElement.innerText = parseInt(valueElement.innerText) + 1;
            updateCounter();
        });

        counterElement.querySelector('.decrement').addEventListener('click', () => {
            valueElement.innerText = Math.max(0, parseInt(valueElement.innerText) - 1);
            updateCounter();
        });

        goalElement.addEventListener('input', updateCounter);

        counterElement.querySelector('.remove').addEventListener('click', () => {
            countersContainer.removeChild(counterElement);
            saveCounters();
        });

        countersContainer.appendChild(counterElement);

        updateProgressBar(counterElement, value, goal);

        if (index === null) saveCounters();
    };

    addCounterButton.addEventListener('click', () => createCounter());

    loadCounters();
});
