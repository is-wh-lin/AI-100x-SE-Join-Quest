export enum PieceType {
  General = 'General',
  Guard = 'Guard',
  Rook = 'Rook',
  Horse = 'Horse',
  Cannon = 'Cannon',
  Elephant = 'Elephant',
  Soldier = 'Soldier',
}

export enum PlayerColor {
  Red = 'Red',
  Black = 'Black',
}

export interface Position {
  row: number;
  col: number;
}

export class Piece {
  constructor(
    public type: PieceType,
    public color: PlayerColor,
    public position: Position,
  ) {}
}
