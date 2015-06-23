function Template() {
  var template = [
    { name: "Pentomino",
      c: ["110",
          "011",
          "010"]},
    { name: "Breeder",
      c: ["11101",
          "10000",
          "00011",
          "01101",
          "10101"]},
    { name: "Acorn",
      c: ["0100000",
          "0001000",
          "1100111"]},
    { name: "Glider",
      c: ["111",
          "100",
          "010"]},
    { name: "Lightweight spaceship",
      c: ["01001",
          "10000",
          "10001",
          "11110"]},
    { name: "Middleweight spaceship",
      c: ["000100",
          "010001",
          "100010",
          "100001",
          "111110"]},
    { name: "Heavyweight spaceship",
      c: ["0001100",
          "0100001",
          "1000000",
          "1000001",
          "1111110"]},
    { name: "Pentadecathlon",
      c: ["0010000100",
          "1101111011",
          "0010000100"]},
    { name: "Puffer train",
      c: ["00010",
          "00001",
          "10001",
          "01111",
          "00000",
          "00000",
          "00000",
          "10000",
          "01100",
          "00100",
          "00100",
          "01000",
          "00000",
          "00000",
          "00010",
          "00001",
          "10001",
          "01111"]},
    { name: "Diehard",
      c: ["00000010",
          "11000000",
          "01000111",]},
    { name: "Gosper glider gun",
      c: ["000000000000000000000000100000000000",
          "000000000000000000000010100000000000",
          "000000000000110000001100000000000011",
          "000000000001000100001100000000000011",
          "110000000010000010001100000000000000",
          "110000000010001011000010100000000000",
          "000000000010000010000000100000000000",
          "000000000001000100000000000000000000",
          "000000000000110000000000000000000000"]},
    { name: "X pattern", id: -2},
    { name: "Random pattern", id: -3},
    { name: "Free", id: -1},
  ];

  this.getTemplates = function () {
    return template;
  }
}
