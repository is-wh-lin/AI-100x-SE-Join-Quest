import { Board } from './Board';
import { Piece, PieceType, PlayerColor, Position } from './Piece';

export class ChessService {
  private board: Board;
  private winner: PlayerColor | null = null;

  constructor(board: Board) {
    this.board = board;
  }

  public isMoveLegal(from: Position, to: Position): boolean {
    const piece = this.board.getPiece(from.row, from.col);

    if (!piece) {
      return false; // No piece at the starting position
    }

    let legal = false;

    // First, check piece-specific move legality on the current board state
    if (piece.type === PieceType.General) {
      legal = this.isGeneralMoveLegal(piece, from, to);
    } else if (piece.type === PieceType.Guard) {
      legal = this.isGuardMoveLegal(piece, from, to);
    } else if (piece.type === PieceType.Rook) {
      legal = this.isRookMoveLegal(piece, from, to);
    } else if (piece.type === PieceType.Horse) {
      legal = this.isHorseMoveLegal(piece, from, to);
    } else if (piece.type === PieceType.Cannon) {
      legal = this.isCannonMoveLegal(piece, from, to);
    } else if (piece.type === PieceType.Elephant) {
      legal = this.isElephantMoveLegal(piece, from, to);
    } else if (piece.type === PieceType.Soldier) {
      legal = this.isSoldierMoveLegal(piece, from, to);
    }

    // If the move is legal by piece-specific rules, then check for general facing rule
    if (legal) {
      // Create a temporary board to simulate the move for the general facing rule check
      const tempBoard = new Board();
      // Copy all pieces from the current board to the temporary board
      for (let r = 1; r <= 10; r++) {
        for (let c = 1; c <= 9; c++) {
          const p = this.board.getPiece(r, c);
          if (p) {
            tempBoard.addPiece(new Piece(p.type, p.color, { ...p.position }));
          }
        }
      }

      // Simulate the move on the temporary board
      tempBoard.removePiece(from.row, from.col);
      tempBoard.addPiece(new Piece(piece.type, piece.color, to));

      const redGeneral = this.findGeneralOnBoard(PlayerColor.Red, tempBoard);
      const blackGeneral = this.findGeneralOnBoard(
        PlayerColor.Black,
        tempBoard,
      );

      if (
        redGeneral &&
        blackGeneral &&
        redGeneral.position.col === blackGeneral.position.col
      ) {
        const minRow = Math.min(
          redGeneral.position.row,
          blackGeneral.position.row,
        );
        const maxRow = Math.max(
          redGeneral.position.row,
          blackGeneral.position.row,
        );

        let obstacleFound = false;
        for (let r = minRow + 1; r < maxRow; r++) {
          if (tempBoard.getPiece(r, redGeneral.position.col)) {
            obstacleFound = true;
            break;
          }
        }
        if (!obstacleFound) {
          // If no piece was found in between, the move is illegal
          legal = false;
        }
      }
    }

    return legal;
  }

  public checkGameEndConditions(
    movingPiece: Piece,
    capturedPiece: Piece | undefined,
  ): void {
    if (
      capturedPiece &&
      capturedPiece.type === PieceType.General &&
      capturedPiece.color !== movingPiece.color
    ) {
      this.winner = movingPiece.color; // Opponent's General captured
    }
  }

  public getWinner(): PlayerColor | null {
    return this.winner;
  }

  private isGeneralMoveLegal(
    general: Piece,
    from: Position,
    to: Position,
  ): boolean {
    // General can only move one step horizontally or vertically
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    if (
      !((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))
    ) {
      return false;
    }

    // General must stay within the palace
    // Red General palace: rows 1-3, cols 4-6
    // Black General palace: rows 8-10, cols 4-6
    if (general.color === PlayerColor.Red) {
      if (!(to.row >= 1 && to.row <= 3 && to.col >= 4 && to.col <= 6)) {
        return false;
      }
    } else if (general.color === PlayerColor.Black) {
      if (!(to.row >= 8 && to.row <= 10 && to.col >= 4 && to.col <= 6)) {
        return false;
      }
    }

    return true;
  }

  private isGuardMoveLegal(
    guard: Piece,
    from: Position,
    to: Position,
  ): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // Guard can only move one step diagonally
    if (!(rowDiff === 1 && colDiff === 1)) {
      return false;
    }

    // Guard must stay within the palace
    // Red Guard palace: rows 1-3, cols 4-6
    // Black Guard palace: rows 8-10, cols 4-6
    if (guard.color === PlayerColor.Red) {
      if (!(to.row >= 1 && to.row <= 3 && to.col >= 4 && to.col <= 6)) {
        return false;
      }
    } else if (guard.color === PlayerColor.Black) {
      if (!(to.row >= 8 && to.row <= 10 && to.col >= 4 && to.col <= 6)) {
        return false;
      }
    }

    return true;
  }

  private isRookMoveLegal(rook: Piece, from: Position, to: Position): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // Rook moves horizontally or vertically
    if (!((rowDiff > 0 && colDiff === 0) || (rowDiff === 0 && colDiff > 0))) {
      return false;
    }

    // Check for obstacles
    if (rowDiff > 0) {
      // Vertical movement
      const start = Math.min(from.row, to.row);
      const end = Math.max(from.row, to.row);
      for (let r = start + 1; r < end; r++) {
        if (this.board.getPiece(r, from.col)) {
          return false; // Obstacle in the way
        }
      }
    } else {
      // Horizontal movement
      const start = Math.min(from.col, to.col);
      const end = Math.max(from.col, to.col);
      for (let c = start + 1; c < end; c++) {
        if (this.board.getPiece(from.row, c)) {
          return false; // Obstacle in the way
        }
      }
    }

    // Check if target position is occupied by own piece
    const targetPiece = this.board.getPiece(to.row, to.col);
    if (targetPiece && targetPiece.color === rook.color) {
      return false; // Cannot capture own piece
    }

    return true;
  }

  private isHorseMoveLegal(
    horse: Piece,
    from: Position,
    to: Position,
  ): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // Horse moves in an L-shape: 2 steps in one direction, 1 step perpendicular
    const isLShape =
      (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    if (!isLShape) {
      return false;
    }

    // Check for leg-block
    let blockRow = from.row;
    let blockCol = from.col;

    if (rowDiff === 2) {
      // Vertical L-shape
      blockRow = from.row + (to.row > from.row ? 1 : -1);
    } else {
      // Horizontal L-shape
      blockCol = from.col + (to.col > from.col ? 1 : -1);
    }

    if (this.board.getPiece(blockRow, blockCol)) {
      return false; // Leg is blocked
    }

    // Check if target position is occupied by own piece
    const targetPiece = this.board.getPiece(to.row, to.col);
    if (targetPiece && targetPiece.color === horse.color) {
      return false; // Cannot capture own piece
    }

    return true;
  }

  private isCannonMoveLegal(
    cannon: Piece,
    from: Position,
    to: Position,
  ): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // Cannon moves horizontally or vertically
    if (!((rowDiff > 0 && colDiff === 0) || (rowDiff === 0 && colDiff > 0))) {
      return false;
    }

    const targetPiece = this.board.getPiece(to.row, to.col);

    let obstacleCount = 0;
    if (rowDiff > 0) {
      // Vertical movement
      const start = Math.min(from.row, to.row);
      const end = Math.max(from.row, to.row);
      for (let r = start + 1; r < end; r++) {
        if (this.board.getPiece(r, from.col)) {
          obstacleCount++;
        }
      }
    } else {
      // Horizontal movement
      const start = Math.min(from.col, to.col);
      const end = Math.max(from.col, to.col);
      for (let c = start + 1; c < end; c++) {
        if (this.board.getPiece(from.row, c)) {
          obstacleCount++;
        }
      }
    }

    if (targetPiece) {
      // Capturing move
      if (obstacleCount === 1) {
        return true; // Valid capture
      } else {
        return false; // Invalid capture (needs exactly one screen)
      }
    } else {
      // Non-capturing move
      if (obstacleCount === 0) {
        return true; // Valid non-capture
      } else {
        return false; // Invalid non-capture (cannot jump over pieces)
      }
    }
  }

  private isElephantMoveLegal(
    elephant: Piece,
    from: Position,
    to: Position,
  ): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    // Elephant moves exactly two steps diagonally
    if (!(rowDiff === 2 && colDiff === 2)) {
      return false;
    }

    // Check for midpoint block
    const midRow = (from.row + to.row) / 2;
    const midCol = (from.col + to.col) / 2;
    if (this.board.getPiece(midRow, midCol)) {
      return false;
    }

    // Elephant cannot cross the river
    // Red Elephant river: rows 1-5
    // Black Elephant river: rows 6-10
    if (elephant.color === PlayerColor.Red) {
      if (to.row > 5) {
        return false;
      }
    } else if (elephant.color === PlayerColor.Black) {
      if (to.row < 6) {
        return false;
      }
    }

    // Check if target position is occupied by own piece
    const targetPiece = this.board.getPiece(to.row, to.col);
    if (targetPiece && targetPiece.color === elephant.color) {
      return false; // Cannot capture own piece
    }

    return true;
  }

  private isSoldierMoveLegal(
    soldier: Piece,
    from: Position,
    to: Position,
  ): boolean {
    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);

    const hasCrossedRiver =
      (soldier.color === PlayerColor.Red && from.row > 5) ||
      (soldier.color === PlayerColor.Black && from.row <= 5);

    if (soldier.color === PlayerColor.Red) {
      // Cannot move backward
      if (rowDiff < 0) return false;

      // Before crossing river, can only move forward one step
      if (!hasCrossedRiver) {
        if (!(rowDiff === 1 && colDiff === 0)) {
          return false;
        }
      } else {
        // After crossing river, can move forward or sideways one step
        if (
          !(
            (rowDiff === 1 && colDiff === 0) ||
            (rowDiff === 0 && colDiff === 1)
          )
        ) {
          return false;
        }
      }
    } else {
      // Black Soldier
      // Cannot move backward
      if (rowDiff > 0) return false;

      // Before crossing river, can only move forward one step
      if (!hasCrossedRiver) {
        if (!(rowDiff === -1 && colDiff === 0)) {
          return false;
        }
      } else {
        // After crossing river, can move forward or sideways one step
        if (
          !(
            (rowDiff === -1 && colDiff === 0) ||
            (rowDiff === 0 && colDiff === 1)
          )
        ) {
          return false;
        }
      }
    }

    // Check if target position is occupied by own piece
    const targetPiece = this.board.getPiece(to.row, to.col);
    if (targetPiece && targetPiece.color === soldier.color) {
      return false; // Cannot capture own piece
    }

    return true;
  }

  private findGeneralOnBoard(
    color: PlayerColor,
    board: Board,
  ): Piece | undefined {
    for (let r = 1; r <= 10; r++) {
      for (let c = 1; c <= 9; c++) {
        const piece = board.getPiece(r, c);
        if (
          piece &&
          piece.type === PieceType.General &&
          piece.color === color
        ) {
          return piece;
        }
      }
    }
    return undefined;
  }
}
