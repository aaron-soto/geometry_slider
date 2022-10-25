const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const cellSize = 50;
const rows = 10;
const cols = 8;
let isPieceClicked = false;
let draggedPiece;
let draggedPieceindex;
let clickOffset;
const DEBUG = false;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let mouse = {
	position: {
		x: 0,
		y: 0,
	},
	isDragging: false,
};

class Square {
	constructor(x, y, color, idx) {
		this.initialPosition = {
			x: x,
			y: y,
		};
		this.position = {
			x: x,
			y: y,
		};
		this.color = color;
		this.idx = idx;
		this.image = new Image();
		this.image.src = `images/${color}.png`;
		this.image.onload = () => {
			this.isLoaded = true;
		};
	}

	draw(parentInitialPosition, parentPosition, isParentDragging) {
		// Draw shadow in inital position if piece is dragging
		c.save();
		c.globalAlpha = 0.5;
		if (this.isLoaded)
			c.drawImage(
				this.image,
				(isParentDragging ? parentPosition.x : parentInitialPosition.x) +
					this.idx * cellSize,
				isParentDragging ? parentPosition.y : parentInitialPosition.y,
				cellSize,
				cellSize
			);
		c.restore();

		// Draw shape in updated position
		c.save();
		if (this.isLoaded)
			c.drawImage(
				this.image,
				(isParentDragging ? parentPosition.x : parentInitialPosition.x) +
					this.idx * cellSize,
				isParentDragging ? parentPosition.y : parentInitialPosition.y,
				cellSize,
				cellSize
			);
		c.restore();
	}
}

const gameBoard = new GameBoard();

let pieces = [];

const piece1 = new Piece(0, 300, 2, 'blue');
const piece2 = new Piece(150, 300, 3, 'green');
// const piece3 = new Piece(480, 640, 2, 'red');

pieces.push(piece1, piece2);

function animate() {
	requestAnimationFrame(animate);

	gameBoard.draw();

	pieces.forEach((piece) => {
		piece.update();
		piece.draw();
	});
}

animate();
