document.onmousemove = (e) => {
	var rect = canvas.getBoundingClientRect();

	mouse.position = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top,
	};
};

document.addEventListener('mousedown', (e) => {
	pieces.forEach((piece, index) => {
		if (piece.isPieceClicked()) {
			draggedPieceindex = index;
			draggedPiece = pieces[draggedPieceindex];

			piece.click();

			clickOffset = {
				x: mouse.position.x - draggedPiece.initialPosition.x,
				y: mouse.position.y - draggedPiece.initialPosition.y,
			};
		}
	});
});

document.addEventListener('mouseup', (e) => {
	pieces.forEach((piece, index) => {
		draggedPieceindex = null;
		piece.unClick();
	});
});
