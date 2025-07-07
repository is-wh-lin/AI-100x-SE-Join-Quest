import { Piece } from './Piece';

export class Board {
  private pieces: Map<string, Piece> = new Map();

  constructor() {
    this.pieces = new Map();
  }

  public addPiece(piece: Piece): void {
    this.pieces.set(
      this.getPositionKey(piece.position.row, piece.position.col),
      piece,
    );
  }

  public getPiece(row: number, col: number): Piece | undefined {
    return this.pieces.get(this.getPositionKey(row, col));
  }

  public removePiece(row: number, col: number): void {
    this.pieces.delete(this.getPositionKey(row, col));
  }

  public clear(): void {
    this.pieces.clear();
  }

  private getPositionKey(row: number, col: number): string {
    return `(${row}, ${col})`;
  }
}
