import { Given, When } from '@cucumber/cucumber';
import { Board } from '../src/Board';
import { ChessService } from '../src/ChessService';
import { Piece, PieceType, PlayerColor } from '../src/Piece';

Given(
  /^the board is empty except for a Red General at \((\d+), (\d+)\)$/,
  function (row: string, col: string) {
    this.board = new Board();
    this.chessService = new ChessService(this.board);
    const general = new Piece(PieceType.General, PlayerColor.Red, {
      row: parseInt(row),
      col: parseInt(col),
    });
    this.board.addPiece(general);
  },
);

When(
  /^Red moves the General from \((\d+), (\d+)\) to \((\d+), (\d+)\)$/,
  function (fromRow: string, fromCol: string, toRow: string, toCol: string) {
    const from = { row: parseInt(fromRow), col: parseInt(fromCol) };
    const to = { row: parseInt(toRow), col: parseInt(toCol) };
    this.moveResult = this.chessService.isMoveLegal(from, to);
  },
);
