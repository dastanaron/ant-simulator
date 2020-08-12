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
    goToPosition(ant, leaf, 2, (posLeft, posTop) => {
        if (posLeft === -1 && posTop === -1) {
            goToAntHill(ant, leaf, anthill)
        }
    })
}

function goToAntHill(ant, leaf, antHill) {
    goToPosition(ant, antHill, 10, (posLeft, posTop) => {
        leaf.style.left = posLeft + 'px';
        leaf.style.top = posTop + 'px';
        if (posLeft === -1 && posTop === -1) {
            const workArea = document.querySelector('.workArea');
            moveElementToPosition(leaf, randomPosition(workArea.clientWidth, workArea.clientHeight));
            goToLeaf(ant, leaf, antHill);
        }
    })
}

function goToPosition(element1, element2, speed= 50, callback) {
    const currentPosition1  = [parseInt(element1.style.left), parseInt(element1.style.top)];
    const currentPosition2 = [parseInt(element2.style.left), parseInt(element2.style.top)];

    const differentLeft = currentPosition2[0] - currentPosition1[0];
    const differentTop  = currentPosition2[1] - currentPosition1[1];

    console.log(differentLeft, differentTop);

    let interval = setInterval(() => {
        const state = [1, 1];

        if (currentPosition2[0] + (element2.clientWidth / 2) !== parseInt(element1.style.left)) {
            if (differentLeft < 0) {
                element1.style.left = (parseInt(element1.style.left) - 1) + 'px';
            } else if (differentLeft !== 0) {
                element1.style.left = (parseInt(element1.style.left) + 1) + 'px';
            }
        } else {
            state[0] = 0;
        }

        if (currentPosition2[1] + (element2.clientHeight / 2) !== parseInt(element1.style.top)) {
            if (differentTop < 0) {
                element1.style.top = (parseInt(element1.style.top) - 1) + 'px';
            } else if (differentTop !== 0) {
                element1.style.top = (parseInt(element1.style.top) + 1) + 'px';
            }
        } else {
            state[1] = 0;
        }

        callback(parseInt(element1.style.left), parseInt(element1.style.top))

        if (state[0] === 0 && state[1] === 0) {
            clearInterval(interval);
            callback(-1, -1);
        }

    }, speed);
}
