(function() {
  const app = document.getElementById("app");
  const christmasTree = document.createElement("div");
  const board = document.createElement("div");
  const scoreBoard = document.createElement("div");
  const scoreSpan = document.createElement("span");
  const timerBoard = document.createElement("div");
  const timerSpan = document.createElement("span");
  const mobileControls = document.createElement("div");
  const buttonUp = document.createElement("button");
  const buttonDown = document.createElement("button");
  const present = "🦃";
  const interval = 10;
  const appPaddingVertical = 100;
  // using keyCode instead of key, as in other languages symbol might differ
  const upKeyCodes = [87, 38, "up"]; // w & arrow up
  const downKeyCodes = [83, 40, "down"]; // s & arrow down
  let controlsInterval = -1;
  let gameInterval = -1;
  let score = 0;
  let speed = 1000;
  let allPresents = [];
  let loopTime = 0;
  let time = 30;

  christmasTree.className = "Christmas-tree";
  christmasTree.textContent = "🧑";

  board.className = "Board";

  scoreBoard.className = "Score";
  scoreBoard.textContent = "Score: ";
  scoreBoard.appendChild(scoreSpan);
  scoreSpan.textContent = score;

  mobileControls.className = "Mobile-controls";
  buttonUp.type = "button";
  buttonDown.type = "button";
  buttonUp.className = "Mobile-controls--button";
  buttonDown.className = "Mobile-controls--button";
  buttonUp.textContent = "⬆️";
  buttonDown.textContent = "⬇️";

  mobileControls.appendChild(buttonUp);
  mobileControls.appendChild(buttonDown);

  timerBoard.className = "Timer";
  timerBoard.textContent = "Time Left: ";
  timerBoard.appendChild(timerSpan);
  timerSpan.textContent = time;

  board.appendChild(scoreBoard);
  board.appendChild(timerBoard);
  app.appendChild(board);
  app.appendChild(christmasTree);
  app.appendChild(mobileControls);
  app.style.padding = `${appPaddingVertical}px 0`;

  buttonUp.addEventListener("click", () => {});
  buttonDown.addEventListener("click", () => {});

  const checkCollision = currentPresent => {
    const horizontalCollision =
      currentPresent.offsetLeft <
        christmasTree.offsetLeft + christmasTree.offsetWidth &&
      currentPresent.offsetLeft + currentPresent.offsetWidth >
        christmasTree.offsetLeft;

    const verticalCollision =
      currentPresent.offsetTop <
        christmasTree.offsetTop + christmasTree.offsetHeight &&
      currentPresent.offsetHeight + currentPresent.offsetTop >
        christmasTree.offsetTop;

    return horizontalCollision && verticalCollision;
  };

  const move = direction => {
    const currentPosition = christmasTree.offsetTop;
    let newPosition = currentPosition;
    if (direction === "up") {
      newPosition = newPosition - 1.7;
    }
    if (direction === "down") {
      newPosition = newPosition + 1.7;
    }

    christmasTree.style.top = `${newPosition}px`;
  };

  const handleControls = ({ keyCode }) => {
    let direction = null;
    direction = upKeyCodes.includes(keyCode) ? "up" : direction;
    direction = downKeyCodes.includes(keyCode) ? "down" : direction;
    if (direction && controlsInterval === -1) {
      controlsInterval = setInterval(() => move(direction), 5);
    }
  };

  const clearControls = () => {
    clearInterval(controlsInterval);
    controlsInterval = -1;
  };

  const render = () => {
    allPresents.forEach(currentPresent => {
      if (checkCollision(currentPresent)) {
        currentPresent.remove();
        score++;
        time++;
      }

      if (currentPresent.offsetLeft === 0) {
        currentPresent.remove();
      }
    });

    scoreSpan.textContent = score;
    timerSpan.textContent = time;
  };

  const randomPosition = () => {
    const { floor, random } = Math;
    const screenHeight = app.offsetHeight - 2 * appPaddingVertical;
    const topOffset = floor(random() * screenHeight) + appPaddingVertical;

    return topOffset;
  };

  const finishGame = () => {
    const overlay = document.createElement("div");
    const restartButton = document.createElement("button");
    const finalScore = document.createElement("p");
    const message = document.createElement("p");

    overlay.className = "Finish Overlay__column";
    overlay.appendChild(finalScore);
    overlay.appendChild(message);
    overlay.appendChild(restartButton);

    restartButton.type = "button";
    restartButton.textContent = "Restart";

    message.className = "Message";
    finalScore.textContent = `Your score: ${score}`;
    message.textContent =
      "You are amazing! Happy holidays! Keep on rocking next year!";

    app.appendChild(overlay);

    restartButton.addEventListener("click", () => document.location.reload());

    clearInterval(gameInterval);
    clearInterval(controlsInterval);
  };

  const startGame = () => {
    gameInterval = setInterval(() => {
      loopTime += interval;
      if (score > 10 && score < 20){
        speed = 900
      }else if(score > 20 && score < 30){
        speed = 800
      }else if(score > 30 && score < 40){
        speed = 700
      }else if(score > 40 && score < 50){
        speed = 600
      }else if(score > 50 && score < 60){
        speed = 500
      }else if(score > 60 && score < 70){
        speed = 400
      }
      if (loopTime % speed === 0) {
        console.log(speed)
        const newPresent = document.createElement("div");
        const topOffset = randomPosition();

        newPresent.className = "Present";
        newPresent.textContent = present;
        newPresent.style.top = `${topOffset}px`;

        app.appendChild(newPresent);
        allPresents = [...allPresents, newPresent];

        if (time > 0) {
          time -= 1;
        } else {
          finishGame();
        }
      }

      render();
    }, interval);
  };

  const renderStart = () => {
    const overlay = document.createElement("div");
    const startButton = document.createElement("button");

    overlay.className = "Overlay";
    overlay.appendChild(startButton);

    startButton.type = "button";
    startButton.textContent = "Start";

    app.appendChild(overlay);

    startButton.addEventListener("click", () => {
      overlay.remove();
      startGame();
    });
  };

  buttonUp.addEventListener("mousedown", () =>
    handleControls({ keyCode: "up" })
  );
  buttonDown.addEventListener("mousedown", () =>
    handleControls({ keyCode: "down" })
  );

  buttonUp.addEventListener("mouseup", clearControls);
  buttonDown.addEventListener("mouseup", clearControls);
  buttonUp.addEventListener("mouseleave", clearControls);
  buttonDown.addEventListener("mouseleave", clearControls);

  render();
  window.addEventListener("load", renderStart);
  document.addEventListener("keydown", handleControls);
  document.addEventListener("keyup", clearControls);
})();
