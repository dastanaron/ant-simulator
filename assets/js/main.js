document.addEventListener("DOMContentLoaded", start);

class StackFSM {
    constructor() {
        this.stack = [];
    }

    popState() {
        return this.stack.pop();
    }

    pushState(state) {
        if (this.getCurrentState() !== state) {
            this.stack.push(state);
        }
    }

    getCurrentState() {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }

    count() {
        return this.stack.length;
    }
}

class Simulator {
    constructor(antElement, leafElement, antHillElement, workArea) {
        this.brain = new StackFSM();
        this.ant = antElement;
        this.leaf = leafElement;
        this.antHill = antHillElement;
        this.workArea = workArea;
        this.brain.pushState('goToLeaf');
        this.mouseDistanceXFromAnt = 1000;
        this.mouseDistanceYFromAnt = 1000;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    run() {
        this.workArea.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            this.mouseDistanceXFromAnt = Math.abs(parseInt(this.ant.style.left) - this.mouseX);
            this.mouseDistanceYFromAnt = Math.abs(parseInt(this.ant.style.top) - this.mouseY);
        });
        setInterval(() => {
            const currentStateFunction = this.brain.getCurrentState();
            document.querySelector('.state').textContent = currentStateFunction;
            document.querySelector('.count-stack').textContent = this.brain.count();
            if (currentStateFunction != null) {
                this[currentStateFunction]();
            }
        }, 5);
    }

    goToLeaf() {
        const leftCoords = approximationNumber(parseInt(this.ant.style.left), parseInt(this.leaf.style.left));
        const topCoords  = approximationNumber(parseInt(this.ant.style.top), parseInt(this.leaf.style.top));
        this.ant.style.left =  leftCoords + 'px';
        this.ant.style.top =  topCoords + 'px';

        if (this.mouseDistanceXFromAnt < 20 || this.mouseDistanceYFromAnt < 20) {
            this.brain.pushState('goAway');
        }

        if (leftCoords === parseInt(this.leaf.style.left) && topCoords === parseInt(this.leaf.style.top)) {
            this.brain.popState();
            this.brain.pushState('goToHome');
        }
    }

    goToHome() {
        const leftCoords = approximationNumber(parseInt(this.ant.style.left), parseInt(this.antHill.style.left));
        const topCoords  = approximationNumber(parseInt(this.ant.style.top), parseInt(this.antHill.style.top));
        this.ant.style.left = leftCoords + 'px';
        this.ant.style.top = topCoords + 'px';
        this.leaf.style.left = leftCoords + 'px';
        this.leaf.style.top = topCoords + 'px'

        if (this.mouseDistanceXFromAnt < 20 || this.mouseDistanceYFromAnt < 20) {
            this.brain.pushState('goAway');
        }

        if (leftCoords === parseInt(this.antHill.style.left) && topCoords === parseInt(this.antHill.style.top)) {
            this.brain.popState();
            moveElementToPosition(this.leaf, randomPosition(this.workArea.clientWidth, this.workArea.clientHeight));
            this.brain.pushState('goToLeaf');
        }
    }

    goAway() {
        if (Math.abs(parseInt(this.ant.style.left) - this.mouseX) >= 100 && Math.abs(parseInt(this.ant.style.top) - this.mouseY) >= 100) {
            this.brain.popState();
            this.brain.pushState('goToLeaf');
        }

        const leftCoords = distancingNumber(parseInt(this.ant.style.left), parseInt(this.mouseX));
        const topCoords  = distancingNumber(parseInt(this.ant.style.top), parseInt(this.mouseY));

        this.ant.style.left = leftCoords + 'px';
        this.ant.style.top = topCoords + 'px';
    }
}

function start() {
    const workArea = document.querySelector('.workArea');

    const ant = document.querySelector('svg#ant');
    moveElementToPosition(ant, randomPosition(workArea.clientWidth, workArea.clientHeight));

    const leaf = document.querySelector('svg#leaf');
    moveElementToPosition(leaf, randomPosition(workArea.clientWidth, workArea.clientHeight));

    const anthill = document.querySelector('svg#anthill');
    moveElementToPosition(anthill, randomPosition(workArea.clientWidth, workArea.clientHeight));

    const simulator = new Simulator(ant, leaf, anthill, workArea);

    simulator.run();
}


function moveElementToPosition(element, position) {
    element.style.left = position[0] + 'px';
    element.style.top = position[1] + 'px';
}

function randomPosition(maxLeft, maxTop) {
    let left = Math.round(0 - 0.5 + Math.random() * (maxLeft - 0 + 1));
    let top  = Math.round(0 - 0.5 + Math.random() * (maxTop - 0 + 1));

    if (left > maxLeft - 100) {
        left = left -100;
    }

    if (top > maxTop - 100) {
        top = top - 100;
    }

    return [left, top];
}

function approximationNumber(a, b) {
    let resultNumber = a;
    if(resultNumber < b) {
        resultNumber++;
        return resultNumber;
    } else if(resultNumber === b) {
        return resultNumber;
    } else {
        resultNumber--;
        return resultNumber;
    }
}

function distancingNumber(a, b) {
    let resultNumber = a;
    if(resultNumber < b) {
        resultNumber--;
        return resultNumber;
    } else if(resultNumber === b) {
        return resultNumber;
    } else {
        resultNumber++;
        return resultNumber;
    }
}
