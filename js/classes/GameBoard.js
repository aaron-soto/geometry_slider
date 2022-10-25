class GameBoard {
	constructor() {
		this.pieces = [];
	}

	draw() {
		c.save();
		c.clearRect(0, 0, canvas.width, canvas.height);

		if (DEBUG) {
			c.fillStyle = 'rgba(81, 81, 81, 1)';
			c.strokeStyle = 'rgba(100, 100, 100, 1)';
		} else {
			c.fillStyle = '#f1f1f1';
			c.strokeStyle = '#f1f1f1';
		}

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				c.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
				c.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
		c.restore();
	}
}
