import { Given } from '@cucumber/cucumber';
import { Board } from '../src/Board';
import { ChessService } from '../src/ChessService';
import { Piece, PieceType, PlayerColor } from '../src/Piece';

Given(
  /^the board is empty except for a Red Rook at \((\d+), (\d+)\)$/,
  function (row: string, col: string) {
    this.board = new Board();
    this.chessService = new ChessService(this.board);
    const rook = new Piece(PieceType.Rook, PlayerColor.Red, {
      row: parseInt(row),
      col: parseInt(col),
    });
    this.board.addPiece(rook);
  },
);
