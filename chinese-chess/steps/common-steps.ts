import { Given, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Board } from '../src/Board';
import { ChessService } from '../src/ChessService';
import { Piece, PieceType, PlayerColor, Position } from '../src/Piece';

Given('the board has:', function (dataTable: any) {
  this.board = new Board();
  this.chessService = new ChessService(this.board);
  dataTable.rawTable.slice(1).forEach((row: string[]) => {
    const pieceTypeStr = row[0].split(' ')[1];
    const pieceColorStr = row[0].split(' ')[0];
    const positionMatch = row[1].match(/\((\d+), (\d+)\)/);

    if (positionMatch) {
      const pieceType = PieceType[pieceTypeStr as keyof typeof PieceType];
      const pieceColor = PlayerColor[pieceColorStr as keyof typeof PlayerColor];
      const pos: Position = {
        row: parseInt(positionMatch[1]),
        col: parseInt(positionMatch[2]),
      };
      const piece = new Piece(pieceType, pieceColor, pos);
      this.board.addPiece(piece);
    }
  });
});

Then('the move is legal', function () {
  assert.strictEqual(
    this.moveResult,
    true,
    'Expected move to be legal, but it was illegal.',
  );
});

Then('the move is illegal', function () {
  assert.strictEqual(
    this.moveResult,
    false,
    'Expected move to be illegal, but it was legal.',
  );
});
