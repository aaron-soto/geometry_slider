class Piece {
	constructor(x, y, width, color) {
		this.position = {
			x: x,
			y: y,
		};
		this.initialPosition = {
			x: x,
			y: y,
		};
		this.width = width;
		this.isDragging = false;
		this.color = color;
		this.isTouchingBottom;
		this.isTouchingSide = false;

		this.squares = [];

		for (let i = 0; i < this.width; i++) {
			this.squares.push(
				new Square(
					this.initialPosition.x + i * cellSize,
					this.initialPosition.y,
					this.color,
					i
				)
			);
		}

		console.log('shape:', this.squares);
	}

	leftSide() {
		if (this.isDragging) {
			return this.position.x;
		} else {
			return this.initialPosition.x;
		}
	}
	rightSide() {
		if (this.isDragging) {
			return this.position.x + this.width * cellSize;
		} else {
			return this.initialPosition.x + this.width * cellSize;
		}
	}
	topSide() {
		if (this.isDragging) {
			return this.position.y;
		} else {
			return this.initialPosition.y;
		}
	}
	bottomSide() {
		if (this.isDragging) {
			return this.position.y + cellSize;
		} else {
			return this.initialPosition.y + cellSize;
		}
	}

	draw() {
		// Draw each individual square in shape
		for (let width = 0; width < this.width; width++) {
			this.squares.forEach((square) => {
				square.draw(this.initialPosition, this.position, this.isDragging);
			});
		}

		// Draw Initial Shadow
		// c.save();
		// c.globalAlpha = 0.5;
		// if (this.isLoaded)
		// 	for (let width = 0; width < this.width; width++) {
		// 		this.squares.forEach((square) => {
		// 			square.draw();
		// 		});
		// 	}
		// c.restore();

		// Draw tall white box
		if (this.isDragging) {
			c.save();
			c.fillStyle = 'rgba(100, 100, 100, 0.025)';
			c.fillRect(
				Math.round(this.position.x / cellSize) * cellSize,
				0,
				cellSize * this.width,
				canvas.height
			);
			c.restore();
		}
	}

	hitTest() {
		let hit = false;

		// Detect if pieec hits bottom of screen
		if (this.bottomSide() === rows * cellSize) {
			hit = true;
		}

		let piecesDownOne = pieces.filter((p) => p.topSide() === this.bottomSide());

		piecesDownOne.forEach((piece) => {
			if (
				this.leftSide() > piece.leftSide() ||
				this.rightSide() < piece.rightSide()
			) {
				hit = true;
			}
		});

		return hit;
	}

	getClosest() {
		let thisIndex = pieces
			.filter((piece) => piece.position.y === this.position.y)
			.sort((a, b) => a.initialPosition.x - b.initialPosition.x)
			.findIndex((p) => p.initialPosition.x === this.initialPosition.x);

		let piecesInRow = pieces
			.filter((piece) => piece.position.y === this.position.y)
			.sort((a, b) => a.initialPosition.x - b.initialPosition.x);

		if (thisIndex === 0) {
			return [0, piecesInRow[thisIndex + 1].initialPosition.x];
		} else if (thisIndex === piecesInRow.length - 1) {
			return [
				piecesInRow[thisIndex - 1].initialPosition.x +
					piecesInRow[thisIndex - 1].width * cellSize,
			];
		}

		return [
			piecesInRow[thisIndex - 1].initialPosition.x +
				piecesInRow[thisIndex - 1].width * cellSize,
			piecesInRow[thisIndex + 1].initialPosition.x,
		];
	}

	update() {
		if (mouse.isDragging && this.isDragging) {
			let xTemp = mouse.position.x - clickOffset.x;

			if (xTemp < 0) {
				this.position.x = 0;
			} else if (xTemp + this.width * cellSize > canvas.width) {
				this.position.x = canvas.width - this.width * cellSize;
			} else {
				this.position.x = xTemp;
			}

			let bounds = this.getClosest(this.initialPosition.x);

			if (xTemp < bounds[0]) {
				this.position.x = bounds[0];
				this.isTouchingSide = true;
			} else if (xTemp + this.width * cellSize > bounds[1]) {
				this.position.x = bounds[1] - this.width * cellSize;
				this.isTouchingSide = true;
			} else {
				if (this.isTouchingSide && this.isDragging) {
					this.isTouchingSide = false;
				} else {
					this.position.x = xTemp;
				}
			}
		}
		if (!this.isTouchingBottom) {
			let hit = this.hitTest();

			if (hit) {
				this.isTouchingBottom = true;
			} else {
				this.position.y += 5;
				this.initialPosition.y += 5;
			}
		}
		this.draw();
	}

	isPieceClicked() {
		if (
			mouse.position.x >= this.leftSide() &&
			mouse.position.x <= this.rightSide() &&
			mouse.position.y >= this.topSide() &&
			mouse.position.y <= this.bottomSide()
		) {
			return true;
		} else {
			return false;
		}
	}

	click() {
		mouse.isDragging = true;
		this.isDragging = true;
	}
	unClick() {
		// set initial position to closest cell
		this.initialPosition = {
			x: Math.round(this.position.x / cellSize) * cellSize,
			y: Math.round(this.position.y / cellSize) * cellSize,
		};

		mouse.isDragging = false;
		this.isDragging = false;
	}
}
