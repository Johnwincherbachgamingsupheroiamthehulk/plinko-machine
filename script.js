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
        height: 1200,
        wireframes: false,
        background: "black"
    }
});

engine.world.gravity.y = 0.3

const numRows = 12;   // total number of rows
const xStep = 80;     // horizontal spacing between pegs
const yStep = 70;     // vertical spacing between rows

for (let row = 0; row < numRows; row++) {
    const numPegsInRow = row + 1; // row 0 has 1 peg, row 1 has 2, etc.
    const totalRowWidth = (numPegsInRow - 1) * xStep;
    const offsetX = (1000 - totalRowWidth) / 2; // center the row

    for (let col = 0; col < numPegsInRow; col++) {
        let x = offsetX + col * xStep;

        // optional: stagger every other row slightly
        if (row % 2 === 1) x += xStep * 0.01;

        const y = 150 + row * yStep;

        const peg = Bodies.circle(x, y, 7, {
            isStatic: true,
            render: { fillStyle: "white" }
        });
        World.add(world, peg);
    }
}

// reference your board width
const boardWidth = 1000;
const boardHeight = 1200;

const minX = 450
const maxX = 550
// "Drop Ball" button
const dropBallBtn = document.getElementById("dropballbtn");

dropBallBtn.addEventListener("click", () => {
    let randomX = minX + Math.random() * (maxX - minX)
    const ball = Bodies.circle(randomX, 50, 15, {
        restitution: 0.8,             // bounciness
        render: { fillStyle: "green" } // color
    });

    World.add(world, ball);
});


Engine.run(engine);
Render.run(render);
