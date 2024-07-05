
const board = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
  ];
  
  const game = document.querySelector(".game");
  
  board.forEach((item, i) => {
    const s = document.createElement("div");
    s.setAttribute("id", i.toString());
    s.className = "square";
    s.innerHTML = item;
    game.appendChild(s);
  });
  
  let whiteTurn = true;
  
  document.addEventListener("DOMContentLoaded", () => {
    const squares = document.querySelectorAll(".square");
  
    squares.forEach((square, i) => {
      const row = Math.floor(i / 8);
      if (row % 2 === 0) {
        square.style.backgroundColor = i % 2 === 0 ? "#729153" : "#e7e7cb";
      } else {
        square.style.backgroundColor = i % 2 === 0 ? "#e7e7cb" : "#729153";
      }
      if (square.innerHTML !== "") {
        square.setAttribute("draggable", "true");
      }
      const piece = square.querySelector(".pieces");
      if (piece) {
        if (i < 16) {
          piece.style.fill = "#fff";
        } else if (i >= 48) {
          piece.style.fill = "#372023";
        }
      }
    });
  
    let start;
    let end;
  
    squares.forEach((square) => {
      square.addEventListener("dragstart", (e) => {
        start = e.target.closest(".square").getAttribute("id");
  
        const piece = square.querySelector(".pieces");
        const isWhitePiece = piece && window.getComputedStyle(piece).getPropertyValue("fill") == "rgb(255, 255, 255)";
  
        if ((whiteTurn && !isWhitePiece) || (!whiteTurn && isWhitePiece)) {
          e.preventDefault();
          return;
        }
  
        console.log(`Dragging piece from square ${start}`);
      });
  
      square.addEventListener("dragover", (e) => {
        e.preventDefault();
        end = e.target.closest(".square").getAttribute("id");
      });
  
      square.addEventListener("drop", (e) => {
        e.preventDefault();
        const startSquare = document.getElementById(start);
        const endSquare = document.getElementById(end);
  
        const startPiece = startSquare.querySelector(".pieces");
        const endPiece = endSquare.querySelector(".pieces");
  
        const s1 = parseInt(startSquare.id, 10);
        const s2 = parseInt(endSquare.id, 10);
        const v1 = startPiece.id;
  
        console.log(s1, "start");
        console.log(s2, "end");
  
        let validMove = false;
  
        switch (v1) {
          case "pawn":
            const startPieceColor = window.getComputedStyle(startPiece).getPropertyValue("fill");
            const endPieceColor = endPiece ? window.getComputedStyle(endPiece).getPropertyValue("fill") : null;
            if (startPieceColor === "rgb(255, 255, 255)") {
              // White pawn movement and capturing
              validMove = (s2 === s1 + 8 && !endPiece) || 
                          (s2 === s1 + 16 && s1 < 16 && !endPiece) || 
                          (endPiece && endPieceColor !== startPieceColor && (s2 === s1 + 7 || s2 === s1 + 9));
            } else {
              // Black pawn movement and capturing
              validMove = (s2 === s1 - 8 && !endPiece) || 
                          (s2 === s1 - 16 && s1 >= 48 && !endPiece) || 
                          (endPiece && endPieceColor !== startPieceColor && (s2 === s1 - 7 || s2 === s1 - 9));
            }
            break;
          case "knight":
            validMove = [s1 + 15, s1 + 10, s1 + 17, s1 + 6, s1 - 15, s1 - 10, s1 - 17, s1 - 6].includes(s2);
            break;
          case "rook":
            validMove = (s2 % 8 === s1 % 8) || (Math.floor(s2 / 8) === Math.floor(s1 / 8));
            break;
          case "king":
            validMove = [s1 + 1, s1 - 1, s1 + 8, s1 - 8, s1 + 9, s1 - 9, s1 + 7, s1 - 7].includes(s2);
            break;
          case "bishop":
            validMove = Math.abs(s2 - s1) % 9 === 0 || Math.abs(s2 - s1) % 7 === 0;
            break;
          case "queen":
            validMove = (s2 % 8 === s1 % 8) || (Math.floor(s2 / 8) === Math.floor(s1 / 8)) || Math.abs(s2 - s1) % 9 === 0 || Math.abs(s2 - s1) % 7 === 0;
            break;
        }
  
        if (!validMove) {
          return;
        }
  
        if (endPiece) {
          const startPieceColor = window.getComputedStyle(startPiece).getPropertyValue("fill");
          const endPieceColor = window.getComputedStyle(endPiece).getPropertyValue("fill");
          if (startPieceColor === endPieceColor) {
            return;
          }
  
          if (endPiece.id === "king") {
            alert(`Game over! ${whiteTurn ? "White" : "Black"} wins!`);
            return;
          }
        }
  
        endSquare.innerHTML = startSquare.innerHTML;
        startSquare.innerHTML = "";
  
        whiteTurn = !whiteTurn;
  
        const turn = document.querySelector(".turn");
        turn.innerHTML = whiteTurn ? "It's white's turn" : "It's black's turn";
  
        squares.forEach((sq) => {
          const piece = sq.querySelector(".pieces");
          if (piece) {
            const isWhitePiece = window.getComputedStyle(piece).getPropertyValue("fill") == "rgb(255, 255, 255)";
            if ((whiteTurn && isWhitePiece) || (!whiteTurn && !isWhitePiece)) {
              sq.setAttribute("draggable", "true");
            } else {
              sq.setAttribute("draggable", "false");
            }
          }
        });
  
        console.log(`Dropped piece on square ${end}`);
        console.log(`Current turn: ${whiteTurn ? "White" : "Black"}`);
      });
    });
  
    const turn = document.querySelector(".turn");
    turn.innerHTML = whiteTurn ? "It's white's turn" : "It's black's turn";
  });