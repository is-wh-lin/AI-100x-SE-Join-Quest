import { Given, When } from '@cucumber/cucumber';
import { Board } from '../src/Board';
import { ChessService } from '../src/ChessService';
import { Piece, PieceType, PlayerColor } from '../src/Piece';

Given(
  /^the board is empty except for a Red Soldier at \((\d+), (\d+)\)$/,
  function (row: string, col: string) {
    this.board = new Board();
    this.chessService = new ChessService(this.board);
    const soldier = new Piece(PieceType.Soldier, PlayerColor.Red, {
      row: parseInt(row),
      col: parseInt(col),
    });
    this.board.addPiece(soldier);
  },
);

When(
  /^Red moves the Soldier from \((\d+), (\d+)\) to \((\d+), (\d+)\)$/,
  function (fromRow: string, fromCol: string, toRow: string, toCol: string) {
    const from = { row: parseInt(fromRow), col: parseInt(fromCol) };
    const to = { row: parseInt(toRow), col: parseInt(toCol) };
    this.moveResult = this.chessService.isMoveLegal(from, to);
  },
);
