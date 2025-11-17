const clicksound = new Audio("sounds/mixkit-modern-click-box-check-1120.wav");

// create matter engine, render, world, bodies for physics engine
const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
    element: document.getElementById("plinko-area"),
    engine: engine,
    options: {
        width: 1000,
        height: 1100,
        wireframes: false,
        background: "#112233ff",
    }
});

Render.run(render);

let playerMoney = 1; // set player money 

const boardWidth = 1000;
const boardHeight = 1200;

const container = document.getElementById("plinko-area");
const canvas = container.querySelector("canvas");
const scaleX = canvas.clientWidth / boardWidth;
const scaleY = canvas.clientHeight / boardHeight;



// set up multipliers for payouts :money:
const multipliers = [0, 0.25, 0.5, 0.7, 0.8, 1, 1.2, 1.5, 1.6, 100, 1.6, 1.5, 1.2, 1, 0.8, 0.7, 0.5, 0.25, 0];
const numofmultipliers = multipliers.length;
const multiplierwidth = boardWidth / numofmultipliers;
const multiplierheight = 60;

// creating zones 


for (let index = 0; index < numofmultipliers; index++) {
    const x = multiplierwidth / 2 + multiplierwidth * index;
    const y = boardHeight - multiplierheight * 4;
    const y2 = boardHeight - multiplierheight * 4 + 100;
    const zone = Bodies.rectangle(
        x,
        y,
        multiplierwidth,
        multiplierheight,
        {
            isStatic: true,
            label: "zone",
            multiplier: multipliers[index],
            render: { fillStyle: "#ffffff00" },
            multiplierIndex: index
        }
    );
    World.add(world, zone);

    const xLabel = x * scaleX - (multiplierwidth * scaleX) / 2;
    const yLabel = y2 * scaleY - (multiplierheight * scaleY) /2 ;
    const labelWidth = multiplierwidth * scaleX;
    const labelHeight = multiplierheight * scaleY;

    const label = document.createElement("div");
    label.innerText = `${multipliers[index]}x`;
    label.dataset.index = index;
    label.classList.add("bounceanim");
    label.style.fontFamily = "Brush Script MT, cursive";
    label.style.position = "absolute";
    label.style.left = `${xLabel}px`;
    label.style.top = `${yLabel}px`;
    label.style.width = `${labelWidth}px`;
    label.style.height = `${labelHeight}px`;
    label.style.color = "black";
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.justifyContent = "center";
    label.style.fontWeight = "bold";
    label.style.backgroundColor = "red";
    label.style.borderRadius = "10px";
    label.style.border = "2px solid black";
    container.appendChild(label);




    /* coloring depending on multiplier */
    if (multipliers[index] == 100) {
        label.style.backgroundColor = "#ffef5eff";
    } else if (multipliers[index] == 1.6) {
        label.style.backgroundColor = "#ffc830ff";
    } else if (multipliers[index] == 1.5) {
        label.style.backgroundColor = "#ffa724ff";
    } else if (multipliers[index] <= 1.2 && multipliers[index] >= 1) {
        label.style.backgroundColor = "#fc8414ff";
    } else if (multipliers[index] <= 0.8 && multipliers[index] >= 0.7) {
        label.style.backgroundColor = "#ff5e00ff";
    } else if (multipliers[index] <= 0.25 && multipliers[index] >= 0) {
        label.style.backgroundColor = "#ff0000ff";
    } else {
        label.style.backgroundColor = "#ff3c00ff";
    }

}

engine.world.gravity.y = 0.2; // higher = stronger, lower = very spacey and cool

const numRows = 16; 
const xStep = 55;  
const yStep = 50;    

for (let row = 1; row < numRows; row++) {
    const numPegsInRow = row + 2;
    const totalRowWidth = (numPegsInRow - 1) * xStep;
    const offsetX = (1000 - totalRowWidth) / 2; 

    for (let col = 0; col < numPegsInRow; col++) {
        let x = offsetX + col * xStep;



        const y = 150 + row * yStep;

        const peg = Bodies.circle(x, y, 6, {
            isStatic: true,
            render: { fillStyle: "white" }
        });
        World.add(world, peg);
    }
}


// range of where the balls drop on x axis
const minX = 400
const maxX = 600


const dropBallBtn = document.getElementById("dropballbtn");


// drop the ball & creating the ball

dropBallBtn.addEventListener("click", () => {
    clicksound.currentTime = 0;
    clicksound.play();

    // uhh checking stuff so it dont break
    let betAmount = parseFloat(document.getElementById("moneyinpt").value);
    if (isNaN(betAmount) || betAmount <= 0) {
        return;
    }

    if (betAmount > playerMoney) {
        return;
    }


    playerMoney -= betAmount;
    document.getElementById("money").innerText = `$${playerMoney.toFixed(2)}`;
    let randomX = minX + Math.random() * (maxX - minX)
    const ball = Bodies.circle(randomX, 140, 12, {
        friction: 0,
        frictionAir: 0.01,
        restitution: 1,             // bounciness
        density: 0.005,
        render: { fillStyle: "red" }, 
        label: "ball",
        bet: betAmount
    });

    World.add(world, ball);
});


Matter.Events.on(engine, 'collisionStart', function(event) {
    event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        let ball = bodyA.label === "ball" ? bodyA : bodyB.label === "ball" ? bodyB : null;
        let zone = bodyA.label === "zone" ? bodyA : bodyB.label === "zone" ? bodyB : null;

        if (ball && zone) {

            // very LONG line of playing notes depending on what multiplier you hit

            if (zone.multiplier == 10) {
                const sound = new Audio("sounds/soft-kalimba-one-note_C_F_minor__bpm_104 (1).mp3");
                sound.play();
            } else if (zone.multiplier == 5) {
                const sound = new Audio("sounds/soft-kalimba-one-note_C_E♭_minor__bpm_104 (1).mp3");
                sound.play();
            } else if (zone.multiplier == 2) {
                const sound = new Audio("sounds/soft-kalimba-one-note_C_D_minor__bpm_104.mp3");
                sound.play();
            } else if (zone.multiplier == 1.5) {
                const sound = new Audio("sounds/soft-kalimba-one-note_C_C_minor__bpm_104.mp3");
                sound.play();
            } else if (zone.multiplier == 1.2) {
                const sound = new Audio("sounds/soft-kalimba-one-note_C_B_minor__bpm_104.mp3");
                sound.play();
            } else if (zone.multiplier == 1) {
                const sound = new Audio("sounds/soft-kalimba-one-note_C_B♭_minor__bpm_104.mp3");
                sound.play();
            } else {
                const sound = new Audio("sounds/soft-kalimba-one-note_C_G_minor__bpm_104.mp3");
                sound.play();
            }

            let profitorlose = ball.bet * zone.multiplier;
            playerMoney += profitorlose;


            document.getElementById("money").innerText = `$${playerMoney.toFixed(2)}`;

            World.remove(world, ball);
            

            // "bounce" animation when ball touches a zone

            const label = document.querySelector(`#plinko-area div[data-index='${zone.multiplierIndex}']`);
            if (label) {
                label.style.transform = "translateY(20px)"; // how much pixels it goes down

                setTimeout(() => {
                    label.style.transform = "translateY(0)";
                }, 100);
            }
        }
    })
})



// run the engine so it displays the game
Engine.run(engine);


/* BORDERS TO PREVENT BALLS FROM ESCAPING!!!
*/
const borderleft = Bodies.rectangle(10 / 2, 1200 / 2,  10, 1200, {
    isStatic:  true,
    render: {visible : false}
});
World.add(world, borderleft);

const borderright = Bodies.rectangle(1000 - 10/2, 1200 / 2,  10, 1200, {
    isStatic:  true,
    render: {visible : false}
});
World.add(world, borderright);
