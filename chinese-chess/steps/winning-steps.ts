import { When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Piece, PieceType, PlayerColor, Position } from '../src/Piece';

When(
  /^Red moves the Rook from \((\d+), (\d+)\) to \((\d+), (\d+)\)$/,
  function (fromRow: string, fromCol: string, toRow: string, toCol: string) {
    const from: Position = { row: parseInt(fromRow), col: parseInt(fromCol) };
    const to: Position = { row: parseInt(toRow), col: parseInt(toCol) };

    // Store the piece at the 'from' position before the move
    const pieceToMove = this.board.getPiece(from.row, from.col);
    // Store the piece at the 'to' position before the move (for capture check)
    const capturedPiece = this.board.getPiece(to.row, to.col);

    this.moveResult = this.chessService.isMoveLegal(from, to);

    if (this.moveResult) {
      // If the move is legal, update the board state in the ChessService's board instance
      if (pieceToMove) {
        this.board.removePiece(from.row, from.col);
        if (capturedPiece) {
          this.board.removePiece(to.row, to.col);
        }
        this.board.addPiece(new Piece(pieceToMove.type, pieceToMove.color, to));
      }
      this.chessService.checkGameEndConditions(pieceToMove, capturedPiece);
    }
  },
);

Then('Red wins immediately', function () {
  assert.strictEqual(
    this.chessService.getWinner(),
    PlayerColor.Red,
    'Expected Red to win, but no winner was declared.',
  );
});

Then('the game is not over just from that capture', function () {
  assert.strictEqual(
    this.chessService.getWinner(),
    null,
    'Expected game to continue, but a winner was declared.',
  );
});
