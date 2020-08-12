document.addEventListener("DOMContentLoaded", start);

function start() {
    const workArea = document.querySelector('.workArea');

    const ant = document.querySelector('svg#ant');
    moveElementToPosition(ant, randomPosition(workArea.clientWidth, workArea.clientHeight));

    const leaf = document.querySelector('svg#leaf');
    moveElementToPosition(leaf, randomPosition(workArea.clientWidth, workArea.clientHeight));

    const anthill = document.querySelector('svg#anthill');
    moveElementToPosition(anthill, randomPosition(workArea.clientWidth, workArea.clientHeight));

    goToLeaf(ant, leaf, anthill);
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

function goToLeaf(ant, leaf, anthill) {
    computeMovingVector(ant, leaf, (posLeft, posTop) => {
        ant.style.left = posLeft + 'px';
        ant.style.top = posTop + 'px';
    },(stateLeft, stateTop) => {
        if (stateLeft === 0 && stateTop === 0) {
            goToAntHill(ant, leaf, anthill)
        }
    }, 2);
}

function goToAntHill(ant, leaf, antHill) {
    computeMovingVector(ant, antHill,(posLeft, posTop) => {
        ant.style.left  = posLeft + 'px';
        ant.style.top   = posTop + 'px';
        leaf.style.left = posLeft + 'px';
        leaf.style.top  = posTop + 'px';
    },(stateLeft, stateTop) => {
        if (stateLeft === 0 && stateTop === 0) {
            const workArea = document.querySelector('.workArea');
            moveElementToPosition(leaf, randomPosition(workArea.clientWidth, workArea.clientHeight));
            goToLeaf(ant, leaf, antHill);
        }
    }, 5);
}

function computeMovingVector(element1, element2, callback, stateCallback, speed= 50) {
    const activeState = [1, 1];
    const coords = [0, 0];
    approximationNumber(parseInt(element1.style.left), parseInt(element2.style.left), (result) => {
        coords[0] = result;
        callback(...coords);
    }, speed).then(res => {
        activeState[0] = res;
        stateCallback(...activeState);
    });

    approximationNumber(parseInt(element1.style.top), parseInt(element2.style.top), (result) => {
        coords[1] = result;
        callback(...coords);
    }, speed).then(res => {
        activeState[1] = res;
        stateCallback(...activeState);
    });
}


function approximationNumber(a, b, callback, speed = 50) {
    return new Promise((resolve, reject ) => {
        let resultNumber = a;
        let interval = setInterval(() => {
            if(resultNumber < b) {
                resultNumber++;
                callback(resultNumber);
            } else if(resultNumber === b) {
                clearInterval(interval);
                resolve(0);
            } else {
                resultNumber--;
                callback(resultNumber);
            }
        }, speed);
    });
}
