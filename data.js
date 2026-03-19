// Game data - 10x10 grid with nodes
// Not all grid positions have nodes

const GRID_SIZE = 10;

const NODES = [
  // Row y = 0
  {id: 0, x: 0, y: 0, shape: 'triangle', zone: 9}, {id: 1, x: 1, y: 0, shape: 'square', zone: 0},
  {id: 2, x: 3, y: 0, shape: 'pentagon', zone: 1}, {id: 3, x: 4, y: 0, shape: 'circle', type: 'tourist-site', zone: 1},
  {id: 4, x: 5, y: 0, shape: 'triangle', zone: 1}, {id: 5, x: 7, y: 0, shape: 'circle', zone: 2},
  {id: 6, x: 9, y: 0, shape: 'square', zone: 10},

  // Row y = 1
  {id: 7, x: 1, y: 1, shape: 'circle', zone: 0}, {id: 8, x: 6, y: 1, shape: 'pentagon', zone: 1},
  {id: 9, x: 8, y: 1, shape: 'triangle', zone: 2},

  // Row y = 2
  {id: 10, x: 0, y: 2, shape: 'circle', zone: 0}, {id: 11, x: 2, y: 2, shape: 'square', zone: 0},
  {id: 12, x: 3, y: 2, shape: 'circle', zone: 1},
  {id: 13, x: 5, y: 2, shape: 'pentagon', type: 'blue-departure-station', zone: 1},
  {id: 14, x: 8, y: 2, shape: 'circle', zone: 2}, {id: 15, x: 9, y: 2, shape: 'pentagon', zone: 2},

  // Row y = 3
  {id: 16, x: 3, y: 3, shape: 'pentagon', zone: 4}, {id: 17, x: 4, y: 3, shape: 'triangle', zone: 4},
  {id: 18, x: 6, y: 3, shape: 'square', zone: 4}, {id: 19, x: 7, y: 3, shape: 'triangle', zone: 5},
  {id: 20, x: 9, y: 3, shape: 'triangle', type: 'tourist-site', zone: 5},

  // Row y = 4
  {id: 21, x: 0, y: 4, shape: 'pentagon', zone: 3},
  {id: 22, x: 2, y: 4, shape: 'square', type: 'purple-departure-station', zone: 3},
  {id: 23, x: 4, y: 4, shape: 'circle', zone: 4}, {id: 24, x: 7, y: 4, shape: 'circle', zone: 5},

  // Row y = 5
  {id: 25, x: 1, y: 5, shape: 'triangle', zone: 3}, {id: 26, x: 2, y: 5, shape: 'square', zone: 3},
  {id: 27, x: 4, y: 5, shape: 'pentagon', zone: 4}, {id: 28, x: 5, y: 5, shape: 'square', zone: 4},
  {id: 29, x: 8, y: 5, shape: 'pentagon', zone: 5},

  // Row y = 6
  {id: 30, x: 0, y: 6, shape: 'square', type: 'tourist-site', zone: 3},
  {id: 31, x: 2, y: 6, shape: 'pentagon', zone: 3}, {id: 32, x: 4, y: 6, shape: 'triangle', zone: 4},
  {id: 33, x: 5, y: 6, shape: 'wild', zone: 4, type: 'tourist-site'}, {id: 34, x: 6, y: 6, shape: 'circle', zone: 4},
  {id: 35, x: 7, y: 6, shape: 'circle', type: 'pink-departure-station', zone: 5},
  {id: 36, x: 9, y: 6, shape: 'square', zone: 5},

  // Row y = 7
  {id: 37, x: 0, y: 7, shape: 'circle', zone: 6},
  {id: 38, x: 3, y: 7, shape: 'triangle', type: 'green-departure-station', zone: 7},
  {id: 39, x: 6, y: 7, shape: 'square', zone: 7}, {id: 40, x: 9, y: 7, shape: 'triangle', zone: 8},

  // Row y = 8
  {id: 41, x: 1, y: 8, shape: 'pentagon', zone: 6}, {id: 42, x: 3, y: 8, shape: 'square', zone: 7},
  {id: 43, x: 6, y: 8, shape: 'pentagon', type: 'tourist-site', zone: 7},
  {id: 44, x: 8, y: 8, shape: 'square', zone: 8}, {id: 45, x: 9, y: 8, shape: 'pentagon', zone: 8},

  // Row y = 9
  {id: 46, x: 0, y: 9, shape: 'pentagon', zone: 11}, {id: 47, x: 1, y: 9, shape: 'triangle', zone: 6},
  {id: 48, x: 2, y: 9, shape: 'square', zone: 6}, {id: 49, x: 4, y: 9, shape: 'triangle', zone: 7},
  {id: 50, x: 5, y: 9, shape: 'circle', zone: 7}, {id: 51, x: 7, y: 9, shape: 'triangle', zone: 8},
  {id: 52, x: 9, y: 9, shape: 'circle', zone: 12}
];

const ALLOWED_PATHS = [
  // 0
  {
    id: "0-1",
    start: 0,
    end: 1,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "0-7",
    start: 0,
    end: 7,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "0-10",
    start: 0,
    end: 10,
    crossesRiver: false,
    blocks: [],
  },
  // 1
  {
    id: "1-0",
    start: 1,
    end: 0,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "1-2",
    start: 1,
    end: 2,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "1-7",
    start: 1,
    end: 7,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "1-12",
    start: 1,
    end: 12,
    crossesRiver: false,
    blocks: ["7-8", "8-7", "11-3", "3-11"],
  },
  // 2
  {
    id: "2-1",
    start: 2,
    end: 1,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "2-3",
    start: 2,
    end: 3,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "2-12",
    start: 2,
    end: 12,
    crossesRiver: false,
    blocks: ["7-8", "11-3", "3-11", "8-7"],
  },
  {
    id: "2-13",
    start: 2,
    end: 13,
    crossesRiver: false,
    blocks: [
        "3-11",
        "11-3",
        "4-12",
        "12-4",
        "7-8",
        "8-7",
        "3-17",
        "17-3"
    ],
  },
  // 3
  {
    id: "3-2",
    start: 3,
    end: 2,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "3-4",
    start: 3,
    end: 4,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "3-11",
    start: 3,
    end: 11,
    crossesRiver: false,
    blocks: ["7-8", "8-7", "1-12", "12-1", "2-12", "12-2", "2-13", "13-2"],
  },
  {
    id: "3-19",
    start: 3,
    end: 19,
    crossesRiver: false,
    blocks: [
      "4-12",
      "12-4",
      "7-8",
      "8-7",
      "13-8",
      "8-13",
      "13-14",
      "14-13",
      "18-8",
      "8-18",
      "18-9",
      "9-18",
      "4-13",
      "13-4"
    ],
  },
  {
    id: "3-17",
    start: 3,
    end: 17,
    crossesRiver: false,
    blocks: ["2-13", "13-2", "7-8", "8-7", "12-4", "4-12", "12-13", "13-12"],
  },
  // 4
  {
    id: "4-3",
    start: 4,
    end: 3,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "4-12",
    start: 4,
    end: 12,
    crossesRiver: false,
    blocks: [
      "3-19",
      "19-3",
      "7-8",
      "8-7",
      "2-13",
      "13-2"
    ],
  },
  {
    id: "4-13",
    start: 4,
    end: 13,
    crossesRiver: false,
    blocks: [
      "7-8",
      "8-7",
      "3-19",
      "19-3"
    ],
  },
  {
    id: "4-8",
    start: 4,
    end: 8,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "4-5",
    start: 4,
    end: 5,
    crossesRiver: false,
    blocks: [],
  },
  // 5
  {
    id: "5-4",
    start: 5,
    end: 4,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "5-8",
    start: 5,
    end: 8,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "5-9",
    start: 5,
    end: 9,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "5-19",
    start: 5,
    end: 19,
    crossesRiver: false,
    blocks: [
      "8-9",
      "9-8",
      "13-14",
      "14-13",
      "9-18",
      "18-9"
    ],
  },
  {
    id: "5-6",
    start: 5,
    end: 6,
    crossesRiver: false,
    blocks: [],
  },
  // 6
  {
    id: "6-5",
    start: 6,
    end: 5,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "6-9",
    start: 6,
    end: 9,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "6-15",
    start: 6,
    end: 15,
    crossesRiver: false,
    blocks: [],
  },
  // 7
  {
    id: "7-0",
    start: 7,
    end: 0,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "7-10",
    start: 7,
    end: 10,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "7-11",
    start: 7,
    end: 11,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "7-8",
    start: 7,
    end: 8,
    crossesRiver: false,
    blocks: [
        "1-12",
        "12-1",
        "11-3",
        "3-11",
        "12-2",
        "2-12",
        "2-13",
        "13-2",
        "3-17",
        "17-3",
        "12-4",
        "4-12",
        "4-13",
        "13-4",
        "3-19",
        "19-3"
    ],
  },
  {
    id: "7-1",
    start: 7,
    end: 1,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "7-25",
    start: 7,
    end: 25,
    crossesRiver: false,
    blocks: [
        "10-11",
        "11-10",
        "11-21",
        "21-11",
        "10-22",
        "22-10",
        "21-22",
        "22-21"
    ],
  },
  // 8
  {
    id: "8-7",
    start: 8,
    end: 7,
    crossesRiver: false,
    blocks: [
      "1-12",
      "12-1",
      "11-3",
      "3-11",
      "12-2",
      "2-12",
      "2-13",
      "13-2",
      "3-17",
      "17-3",
      "12-4",
      "4-12",
      "4-13",
      "13-4",
      "3-19",
      "19-3"
    ],
  },
  {
    id: "8-13",
    start: 8,
    end: 13,
    crossesRiver: false,
    blocks: [
        "3-19",
        "19-3"
    ],
  },
  {
    id: "8-18",
    start: 8,
    end: 18,
    crossesRiver: false,
    blocks: [
        "3-19",
        "19-3",
        "13-14",
        "14-13"
    ],
  },
  {
    id: "8-9",
    start: 8,
    end: 9,
    crossesRiver: false,
    blocks: [
        "5-19",
        "19-5"
    ],
  },
  {
    id: "8-5",
    start: 8,
    end: 5,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "8-4",
    start: 8,
    end: 4,
    crossesRiver: false,
    blocks: [],
  },
  // 9
  {
    id: "9-6",
    start: 9,
    end: 6,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "9-5",
    start: 9,
    end: 5,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "9-8",
    start: 9,
    end: 8,
    crossesRiver: false,
    blocks: [
      "5-19",
      "19-5"
    ],
  },
  {
    id: "9-18",
    start: 9,
    end: 18,
    crossesRiver: false,
    blocks: [
        "13-14",
        "14-13",
        "5-9",
        "9-5",
        "3-19",
        "19-3"
    ],
  },
  {
    id: "9-14",
    start: 9,
    end: 14,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "9-15",
    start: 9,
    end: 15,
    crossesRiver: false,
    blocks: [],
  },

  // 10
  {
    id: "10-0",
    start: 10,
    end: 0,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "10-7",
    start: 10,
    end: 7,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "10-11",
    start: 10,
    end: 11,
    crossesRiver: false,
    blocks: [
        "7-25",
        "25-7"
    ],
  },
  {
    id: "10-21",
    start: 10,
    end: 21,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "10-22",
    start: 10,
    end: 22,
    crossesRiver: false,
    blocks: [
        "7-25",
        "25-7",
        "11-21",
        "21-11"
    ],
  },
  // 11
  {
    id: "11-7",
    start: 11,
    end: 7,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "11-10",
    start: 11,
    end: 10,
    crossesRiver: false,
    blocks: [
      "7-25",
      "25-7"
    ],
  },
  {
    id: "11-21",
    start: 11,
    end: 21,
    crossesRiver: false,
    blocks: [
        "10-22",
        "22-10",
        "7-25",
        "25-7"
    ],
  },
  {
    id: "11-22",
    start: 11,
    end: 22,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "11-16",
    start: 11,
    end: 16,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "11-12",
    start: 11,
    end: 12,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "11-3",
    start: 11,
    end: 3,
    crossesRiver: false,
    blocks: ["7-8", "8-7", "1-12", "12-1", "2-12", "12-2", "2-13", "13-2"],
  },
  // 12
  {
    id: "12-11",
    start: 12,
    end: 11,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "12-16",
    start: 12,
    end: 16,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "12-17",
    start: 12,
    end: 17,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "12-13",
    start: 12,
    end: 13,
    crossesRiver: false,
    blocks: [
        "3-17",
        "17-3"
    ],
  },
  {
    id: "12-4",
    start: 12,
    end: 4,
    crossesRiver: false,
    blocks: [
      "3-19",
      "19-3",
      "7-8",
      "8-7",
      "2-13",
      "13-2"
    ],
  },
  {
    id: "12-2",
    start: 12,
    end: 2,
    crossesRiver: false,
    blocks: ["7-8", "11-3", "3-11", "8-7"],
  },
  {
    id: "12-1",
    start: 12,
    end: 1,
    crossesRiver: false,
    blocks: ["7-8", "8-7", "11-3", "3-11"],
  },
  // 13
  {
    id: "13-12",
    start: 13,
    end: 12,
    crossesRiver: false,
    blocks: [
      "3-17",
      "17-3"
    ],
  },
  {
    id: "13-28",
    start: 13,
    end: 28,
    crossesRiver: true,
    blocks: [
        "17-35",
        "35-17",
        "18-27",
        "27-18",
        "23-24",
        "24-23",
        "17-18",
        "18-17"
    ],
  },
  {
    id: "13-17",
    start: 13,
    end: 17,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "13-18",
    start: 13,
    end: 18,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "13-14",
    start: 13,
    end: 14,
    crossesRiver: false,
    blocks: [
        "3-19",
        "19-3",
        "8-18",
        "18-8",
        "19-5",
        "5-19",
        "18-9",
        "9-18"
    ],
  },
  {
    id: "13-8",
    start: 13,
    end: 8,
    crossesRiver: false,
    blocks: [
      "3-19",
      "19-3"
    ],
  },
  {
    id: "13-4",
    start: 13,
    end: 4,
    crossesRiver: false,
    blocks: [
      "7-8",
      "8-7",
      "3-19",
      "19-3"
    ],
  },
  {
    id: "13-2",
    start: 13,
    end: 2,
    crossesRiver: false,
    blocks: [
      "3-11",
      "11-3",
      "4-12",
      "12-4",
      "7-8",
      "8-7",
      "3-17",
      "17-3"
    ],
  },
  // 14
  {
    id: "14-13",
    start: 14,
    end: 13,
    crossesRiver: false,
    blocks: [
      "3-19",
      "19-3",
      "8-18",
      "18-8",
      "19-5",
      "5-19",
      "18-9",
      "9-18"
    ],
  },
  {
    id: "14-19",
    start: 14,
    end: 19,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "14-29",
    start: 14,
    end: 29,
    crossesRiver: true,
    blocks: [
        "19-20",
        "20-19",
        "24-15",
        "15-24",
        "20-34",
        "34-20"
    ],
  },
  {
    id: "14-20",
    start: 14,
    end: 20,
    crossesRiver: false,
    blocks: [
        "15-24",
        "24-15"
    ],
  },
  {
    id: "14-15",
    start: 14,
    end: 15,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "14-9",
    start: 14,
    end: 9,
    crossesRiver: false,
    blocks: [],
  },
  // 15
  {
    id: "15-6",
    start: 15,
    end: 6,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "15-9",
    start: 15,
    end: 9,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "15-14",
    start: 15,
    end: 14,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "15-24",
    start: 15,
    end: 24,
    crossesRiver: false,
    blocks: [
        "19-20",
        "20-19",
        "14-29",
        "29-14",
        "20-14",
        "14-20"
    ],
  },
  {
    id: "15-20",
    start: 15,
    end: 20,
    crossesRiver: false,
    blocks: [],
  },
  // 16
  {
    id: "16-12",
    start: 16,
    end: 12,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "16-11",
    start: 16,
    end: 11,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "16-22",
    start: 16,
    end: 22,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "16-38",
    start: 16,
    end: 38,
    crossesRiver: true,
    blocks: [
        "17-26",
        "26-17",
        "22-23",
        "23-22",
        "26-27",
        "27-26",
        "31-32",
        "32-31",
        "27-41",
        "41-27",
        "22-32",
        "32-22",
        "31-23",
        "23-31"
    ],
  },
  {
    id: "16-23",
    start: 16,
    end: 23,
    crossesRiver: false,
    blocks: [
        "17-26",
        "26-17"
    ],
  },
  {
    id: "16-17",
    start: 16,
    end: 17,
    crossesRiver: false,
    blocks: [],
  },
  // 17
  {
    id: "17-3",
    start: 17,
    end: 3,
    crossesRiver: false,
    blocks: ["2-13", "13-2", "7-8", "8-7", "12-4", "4-12", "12-13", "13-12"],
  },
  {
    id: "17-12",
    start: 17,
    end: 12,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "17-16",
    start: 17,
    end: 16,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "17-26",
    start: 17,
    end: 26,
    crossesRiver: false,
    blocks: [
        "16-23",
        "23-16",
        "23-22",
        "22-23",
        "22-32",
        "32-22",
        "16-38",
        "38-16"
    ],
  },
  {
    id: "17-23",
    start: 17,
    end: 23,
    crossesRiver: true,
    blocks: [],
  },
  {
    id: "17-35",
    start: 17,
    end: 35,
    crossesRiver: true,
    blocks: [
        "23-24",
        "24-23",
        "13-28",
        "28-13",
        "18-27",
        "27-18",
        "28-19",
        "19-28",
        "28-29",
        "29-28",
        "24-33",
        "33-24",
        "18-34",
        "34-18",
        "20-34",
        "34-20"
    ],
  },
  {
    id: "17-18",
    start: 17,
    end: 18,
    crossesRiver: false,
    blocks: [
        "13-28",
        "28-13"
    ],
  },
  {
    id: "17-13",
    start: 17,
    end: 13,
    crossesRiver: false,
    blocks: [],
  },
  // 18
  {
    id: "18-17",
    start: 18,
    end: 17,
    crossesRiver: false,
    blocks: [
      "13-28",
      "28-13"
    ],
  },
  {
    id: "18-27",
    start: 18,
    end: 27,
    crossesRiver: true,
    blocks: [
        "13-28",
        "28-13",
        "17-35",
        "35-17",
        "23-24",
        "24-23",
        "23-28",
        "28-23"
    ],
  },
  {
    id: "18-34",
    start: 18,
    end: 34,
    crossesRiver: true,
    blocks: [
      "24-33",
      "33-24",
      "23-24",
      "24-23",
      "17-35",
      "35-17",
      "28-29",
      "29-28",
      "19-28",
      "28-19"
    ],
  },
  {
    id: "18-24",
    start: 18,
    end: 24,
    crossesRiver: false,
    blocks: [
        "19-28",
        "28-19"
    ],
  },
  {
    id: "18-19",
    start: 18,
    end: 19,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "18-9",
    start: 18,
    end: 9,
    crossesRiver: false,
    blocks: [
      "13-14",
      "14-13",
      "5-9",
      "9-5",
      "3-19",
      "19-3"
    ],
  },
  {
    id: "18-8",
    start: 18,
    end: 8,
    crossesRiver: false,
    blocks: [
      "3-19",
      "19-3",
      "13-14",
      "14-13"
    ],
  },
  {
    id: "18-13",
    start: 18,
    end: 13,
    crossesRiver: false,
    blocks: [],
  },
  // 19
  {
    id: "19-18",
    start: 19,
    end: 18,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "19-28",
    start: 19,
    end: 28,
    crossesRiver: true,
    blocks: [
        "23-24",
        "24-23",
        "17-35",
        "35-17",
        "18-34",
        "34-18",
        "18-24",
        "24-18"
    ],
  },
  {
    id: "19-24",
    start: 19,
    end: 24,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "19-20",
    start: 19,
    end: 20,
    crossesRiver: false,
    blocks: [
        "15-24",
        "24-15",
        "14-29",
        "29-14"
    ],
  },
  {
    id: "19-14",
    start: 19,
    end: 14,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "19-5",
    start: 19,
    end: 5,
    crossesRiver: false,
    blocks: [
      "8-9",
      "9-8",
      "13-14",
      "14-13",
      "9-18",
      "18-9"
    ],
  },
  {
    id: "19-3",
    start: 19,
    end: 3,
    crossesRiver: false,
    blocks: [
      "4-12",
      "12-4",
      "7-8",
      "8-7",
      "13-8",
      "8-13",
      "13-14",
      "14-13",
      "18-8",
      "8-18",
      "18-9",
      "9-18",
      "4-13",
      "13-4"
    ]
  },
  // 20
  {
    id: "20-15",
    start: 20,
    end: 15,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "20-14",
    start: 20,
    end: 14,
    crossesRiver: false,
    blocks: [
      "15-24",
      "24-15"
    ],
  },
  {
    id: "20-19",
    start: 20,
    end: 19,
    crossesRiver: false,
    blocks: [
      "15-24",
      "24-15",
      "14-29",
      "29-14"
    ],
  },
  {
    id: "20-34",
    start: 20,
    end: 34,
    crossesRiver: true,
    blocks: [
        "14-29",
        "29-14",
        "24-29",
        "29-24",
        "28-29",
        "29-28",
        "17-35",
        "35-17",
        "24-35",
        "35-24"
    ],
  },
  {
    id: "20-36",
    start: 20,
    end: 36,
    crossesRiver: true,
    blocks: [],
  },
  // 21
  {
    id: "21-10",
    start: 21,
    end: 10,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "21-25",
    start: 21,
    end: 25,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "21-22",
    start: 21,
    end: 22,
    crossesRiver: false,
    blocks: [
        "25-7",
        "7-25"
    ],
  },
  {
    id: "21-30",
    start: 21,
    end: 30,
    crossesRiver: true,
    blocks: [],
  },
  {
    id: "21-11",
    start: 21,
    end: 11,
    crossesRiver: false,
    blocks: [
      "10-22",
      "22-10",
      "7-25",
      "25-7"
    ],
  },
  // 22
  {
    id: "22-21",
    start: 22,
    end: 21,
    crossesRiver: false,
    blocks: [
      "25-7",
      "7-25"
    ],
  },
  {
    id: "22-25",
    start: 22,
    end: 25,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "22-26",
    start: 22,
    end: 26,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "22-32",
    start: 22,
    end: 32,
    crossesRiver: true,
    blocks: [
        "17-26",
        "26-17",
        "23-31",
        "31-23",
        "27-41",
        "41-27",
        "16-38",
        "38-16",
        "26-27",
        "27-26"
    ],
  },
  {
    id: "22-23",
    start: 22,
    end: 23,
    crossesRiver: true,
    blocks: [
        "17-26",
        "26-17",
        "16-38",
        "38-16"
    ],
  },
  {
    id: "22-16",
    start: 22,
    end: 16,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "22-11",
    start: 22,
    end: 11,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "22-10",
    start: 22,
    end: 10,
    crossesRiver: false,
    blocks: [
      "7-25",
      "25-7",
      "11-21",
      "21-11"
    ],
  },
  // 23
  {
    id: "23-22",
    start: 23,
    end: 22,
    crossesRiver: true,
    blocks: [
      "17-26",
      "26-17",
      "16-38",
      "38-16"
    ],
  },
  {
    id: "23-27",
    start: 23,
    end: 27,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "23-28",
    start: 23,
    end: 28,
    crossesRiver: false,
    blocks: [
        "18-27",
        "27-18"
    ],
  },
  {
    id: "23-24",
    start: 23,
    end: 24,
    crossesRiver: true,
    blocks: [
        "17-35",
        "35-17",
        "18-27",
        "27-18",
        "13-28",
        "28-13",
        "28-19",
        "19-28",
        "18-34",
        "34-18"
    ],
  },
  {
    id: "23-17",
    start: 23,
    end: 17,
    crossesRiver: true,
    blocks: [],
  },
  {
    id: "23-16",
    start: 23,
    end: 16,
    crossesRiver: false,
    blocks: [
      "17-26",
      "26-17"
    ],
  },
  {
    id: "23-31",
    start: 23,
    end: 31,
    crossesRiver: false,
    blocks: [
        "22-32",
        "32-22",
        "26-27",
        "27-26",
        "16-38",
        "38-16"
    ],
  },
  // 24
  {
    id: "24-23",
    start: 24,
    end: 23,
    crossesRiver: true,
    blocks: [
      "17-35",
      "35-17",
      "18-27",
      "27-18",
      "13-28",
      "28-13",
      "28-19",
      "19-28",
      "18-34",
      "34-18"
    ],
  },
  {
    id: "24-33",
    start: 24,
    end: 33,
    crossesRiver: true,
    blocks: [
        "17-35",
        "35-17",
        "18-34",
        "34-18",
        "28-29",
        "29-28",
        "28-34",
        "34-28"],
  },
  {
    id: "24-35",
    start: 24,
    end: 35,
    crossesRiver: true,
    blocks: [
        "28-29",
        "29-28",
        "20-34",
        "34-20"
    ],
  },
  {
    id: "24-29",
    start: 24,
    end: 29,
    crossesRiver: true,
    blocks: [
        "20-34",
        "34-20"
    ],
  },
  {
    id: "24-15",
    start: 24,
    end: 15,
    crossesRiver: false,
    blocks: [
      "19-20",
      "20-19",
      "14-29",
      "29-14",
      "20-14",
      "14-20"
    ],
  },
  {
    id: "24-19",
    start: 24,
    end: 19,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "24-18",
    start: 24,
    end: 18,
    crossesRiver: false,
    blocks: [
      "19-28",
      "28-19"
    ],
  },
  // 25
  {
    id: "25-21",
    start: 25,
    end: 21,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "25-30",
    start: 25,
    end: 30,
    crossesRiver: true,
    blocks: [],
  },
  {
    id: "25-31",
    start: 25,
    end: 31,
    crossesRiver: true,
    blocks: [
        "26-37",
        "37-26"
    ],
  },
  {
    id: "25-26",
    start: 25,
    end: 26,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "25-22",
    start: 25,
    end: 22,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "25-41",
    start: 25,
    end: 41,
    crossesRiver: true,
    blocks: [
        "30-31",
        "31-30",
        "26-37",
        "37-26",
        "37-38",
        "38-37"
    ],
  },
  {
    id: "25-7",
    start: 25,
    end: 7,
    crossesRiver: false,
    blocks: [
      "10-11",
      "11-10",
      "11-21",
      "21-11",
      "10-22",
      "22-10",
      "21-22",
      "22-21"
    ],
  },
  // 26
  {
    id: "26-25",
    start: 26,
    end: 25,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "26-37",
    start: 26,
    end: 37,
    crossesRiver: true,
    blocks: [
        "25-41",
        "41-25",
        "30-31",
        "31-30",
        "25-31",
        "31-25"
    ],
  },
  {
    id: "26-31",
    start: 26,
    end: 31,
    crossesRiver: true,
    blocks: [],
  },
  {
    id: "26-27",
    start: 26,
    end: 27,
    crossesRiver: true,
    blocks: [
        "22-32",
        "32-22",
        "16-38",
        "38-16",
        "31-23",
        "23-31"
    ],
  },
  {
    id: "26-17",
    start: 26,
    end: 17,
    crossesRiver: false,
    blocks: [
      "16-23",
      "23-16",
      "23-22",
      "22-23",
      "22-32",
      "32-22",
      "16-38",
      "38-16"
    ],
  },
  {
    id: "26-22",
    start: 26,
    end: 22,
    crossesRiver: false,
    blocks: [],
  },
  // 27
  {
    id: "27-26",
    start: 27,
    end: 26,
    crossesRiver: true,
    blocks: [
      "22-32",
      "32-22",
      "16-38",
      "38-16",
      "31-23",
      "23-31"
    ],
  },
  {
    id: "27-41",
    start: 27,
    end: 41,
    crossesRiver: false,
    blocks: [
      "16-38",
      "38-18",
      "22-32",
      "32-22",
      "31-32",
      "32-31",
      "31-38",
      "38-31",
      "37-38",
      "38-37",
      "31-48",
      "48-31"
    ],
  },
  {
    id: "27-32",
    start: 27,
    end: 32,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "27-33",
    start: 27,
    end: 33,
    crossesRiver: false,
    blocks: [
        "28-32",
        "32-28"
    ],
  },
  {
    id: "27-28",
    start: 27,
    end: 28,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "27-18",
    start: 27,
    end: 18,
    crossesRiver: true,
    blocks: [
      "13-28",
      "28-13",
      "17-35",
      "35-17",
      "23-24",
      "24-23",
      "23-28",
      "28-23"
    ],
  },
  {
    id: "27-23",
    start: 27,
    end: 23,
    crossesRiver: false,
    blocks: [],
  },
  // 28
  {
    id: "28-27",
    start: 28,
    end: 27,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "28-32",
    start: 28,
    end: 32,
    crossesRiver: false,
    blocks: [
        "27-33",
        "33-27"
    ],
  },
  {
    id: "28-33",
    start: 28,
    end: 33,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "28-34",
    start: 28,
    end: 34,
    crossesRiver: false,
    blocks: [
        "24-33",
        "33-24"
    ],
  },
  {
    id: "28-29",
    start: 28,
    end: 29,
    crossesRiver: false,
    blocks: [
        "17-35",
        "35-17",
        "18-34",
        "34-18",
        "24-33",
        "33-24",
        "24-35",
        "35-24",
        "20-34",
        "34-20"
    ],
  },
  {
    id: "28-19",
    start: 28,
    end: 19,
    crossesRiver: true,
    blocks: [
      "23-24",
      "24-23",
      "17-35",
      "35-17",
      "18-34",
      "34-18",
      "18-24",
      "24-18"
    ],
  },
  {
    id: "28-13",
    start: 28,
    end: 13,
    crossesRiver: true,
    blocks: [
      "17-35",
      "35-17",
      "18-27",
      "27-18",
      "23-24",
      "24-23",
      "17-18",
      "18-17"
    ],
  },
  {
    id: "28-23",
    start: 28,
    end: 23,
    crossesRiver: false,
    blocks: [
      "18-27",
      "27-18"
    ],
  },
  // 29
  {
    id: "29-28",
    start: 29,
    end: 28,
    crossesRiver: false,
    blocks: [
      "17-35",
      "35-17",
      "18-34",
      "34-18",
      "24-33",
      "33-24",
      "24-35",
      "35-24",
      "20-34",
      "34-20"
    ],
  },
  {
    id: "29-35",
    start: 29,
    end: 35,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "29-44",
    start: 29,
    end: 44,
    crossesRiver: false,
    blocks: [
        "35-36",
        "36-35",
        "39-40",
        "40-39",
        "35-45",
        "45-35"
    ],
  },
  {
    id: "29-36",
    start: 29,
    end: 36,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "29-14",
    start: 29,
    end: 14,
    crossesRiver: true,
    blocks: [
      "19-20",
      "20-19",
      "24-15",
      "15-24",
      "20-34",
      "34-20"
    ],
  },
  {
    id: "29-24",
    start: 29,
    end: 24,
    crossesRiver: true,
    blocks: [
      "20-34",
      "34-20"
    ],
  },
  // 30
  {
    id: "30-21",
    start: 30,
    end: 21,
    crossesRiver: true,
    blocks: [],
  },
  {
    id: "30-37",
    start: 30,
    end: 37,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "30-31",
    start: 30,
    end: 31,
    crossesRiver: false,
    blocks: [
        "25-41",
        "41-25",
        "26-37",
        "37-26"
    ],
  },
  {
    id: "30-25",
    start: 30,
    end: 25,
    crossesRiver: true,
    blocks: [],
  },
  // 31
  {
    id: "31-30",
    start: 31,
    end: 30,
    crossesRiver: false,
    blocks: [
      "25-41",
      "41-25",
      "26-37",
      "37-26"
    ],
  },
  {
    id: "31-48",
    start: 31,
    end: 48,
    crossesRiver: false,
    blocks: [
        "37-38",
        "38-37",
        "27-41",
        "41-27",
        "38-47",
        "47-38",
        "41-42",
        "42-41"
    ],
  },
  {
    id: "31-32",
    start: 31,
    end: 32,
    crossesRiver: false,
    blocks: [
        "16-38",
        "38-16",
        "27-41",
        "41-27"
    ],
  },
  {
    id: "31-23",
    start: 31,
    end: 23,
    crossesRiver: false,
    blocks: [
      "22-32",
      "32-22",
      "26-27",
      "27-26",
      "16-38",
      "38-16"
    ],
  },
  {
    id: "31-26",
    start: 31,
    end: 26,
    crossesRiver: true,
    blocks: [],
  },
  {
    id: "31-25",
    start: 31,
    end: 25,
    crossesRiver: true,
    blocks: [
      "26-37",
      "37-26"
    ],
  },
  {
    id: "31-38",
    start: 31,
    end: 38,
    crossesRiver: false,
    blocks: [
        "27-41",
        "41-27"
    ],
  },
  // 32
  {
    id: "32-31",
    start: 32,
    end: 31,
    crossesRiver: false,
    blocks: [
      "16-38",
      "38-16",
      "27-41",
      "41-27"
    ],
  },
  {
    id: "32-38",
    start: 32,
    end: 38,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "32-43",
    start: 32,
    end: 43,
    crossesRiver: false,
    blocks: [
        "38-39",
        "39-38",
        "33-50",
        "50-33",
        "33-42",
        "42-33",
        "39-49",
        "49-39"
    ],
  },
  {
    id: "32-33",
    start: 32,
    end: 33,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "32-28",
    start: 32,
    end: 28,
    crossesRiver: false,
    blocks: [
      "27-33",
      "33-27"
    ],
  },
  {
    id: "32-27",
    start: 32,
    end: 27,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "32-22",
    start: 32,
    end: 22,
    crossesRiver: true,
    blocks: [
      "17-26",
      "26-17",
      "23-31",
      "31-23",
      "27-41",
      "41-27",
      "16-38",
      "38-16",
      "26-27",
      "27-26"
    ],
  },
  {
    id: "32-49",
    start: 32,
    end: 49,
    crossesRiver: false,
    blocks: [
        "38-39",
        "39-38",
        "33-42",
        "42-33",
        "42-43",
        "43-42"
    ],
  },
  // 33
  {
    id: "33-32",
    start: 33,
    end: 32,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "33-42",
    start: 33,
    end: 42,
    crossesRiver: false,
    blocks: [
        "32-49",
        "49-32",
        "38-39",
        "39-38",
        "32-43",
        "43-32",
        "38-50",
        "50-38"
    ],
  },
  {
    id: "33-50",
    start: 33,
    end: 50,
    crossesRiver: false,
    blocks: [
        "38-39",
        "39-38",
        "42-43",
        "43-42",
        "39-49",
        "49-39",
        "32-43",
        "43-32"
    ],
  },
  {
    id: "33-39",
    start: 33,
    end: 39,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "33-34",
    start: 33,
    end: 34,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "33-24",
    start: 33,
    end: 24,
    crossesRiver: true,
    blocks: [
      "17-35",
      "35-17",
      "18-34",
      "34-18",
      "28-29",
      "29-28",
      "28-34",
      "34-28"],
  },
  {
    id: "33-28",
    start: 33,
    end: 28,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "33-27",
    start: 33,
    end: 27,
    crossesRiver: false,
    blocks: [
      "28-32",
      "32-28"
    ],
  },
  // 34
  {
    id: "34-33",
    start: 34,
    end: 33,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "34-39",
    start: 34,
    end: 39,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "34-44",
    start: 34,
    end: 44,
    crossesRiver: false,
    blocks: [
        "35-39",
        "39-35",
        "39-40",
        "40-39",
        "35-51",
        "51-35"
    ],
  },
  {
    id: "34-35",
    start: 34,
    end: 35,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "34-20",
    start: 34,
    end: 20,
    crossesRiver: true,
    blocks: [
      "14-29",
      "29-14",
      "24-29",
      "29-24",
      "28-29",
      "29-28",
      "17-35",
      "35-17",
      "24-35",
      "35-24"
    ],
  },
  {
    id: "34-18",
    start: 34,
    end: 18,
    crossesRiver: true,
    blocks: [
      "24-33",
      "33-24",
      "23-24",
      "24-23",
      "17-35",
      "35-17",
      "28-29",
      "29-28",
      "19-28",
      "28-19"
    ],
  },
  {
    id: "34-28",
    start: 34,
    end: 28,
    crossesRiver: false,
    blocks: [
      "24-33",
      "33-24"
    ],
  },
  // 35
  {
    id: "35-34",
    start: 35,
    end: 34,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "35-39",
    start: 35,
    end: 39,
    crossesRiver: false,
    blocks: [
        "34-44",
        "44-34"
    ],
  },
  {
    id: "35-51",
    start: 35,
    end: 51,
    crossesRiver: false,
    blocks: [
        "39-40",
        "40-39",
        "34-44",
        "44-34",
        "43-44",
        "44-43"
    ],
  },
  {
    id: "35-45",
    start: 35,
    end: 45,
    crossesRiver: false,
    blocks: [
        "39-40",
        "40-39",
        "29-44",
        "44-29",
        "40-44",
        "44-40"
    ],
  },
  {
    id: "35-36",
    start: 35,
    end: 36,
    crossesRiver: false,
    blocks: [
        "29-44",
        "44-29"
    ],
  },
  {
    id: "35-29",
    start: 35,
    end: 29,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "35-24",
    start: 35,
    end: 24,
    crossesRiver: true,
    blocks: [
      "28-29",
      "29-28",
      "20-34",
      "34-20"
    ],
  },
  {
    id: "35-17",
    start: 35,
    end: 17,
    crossesRiver: true,
    blocks: [
      "23-24",
      "24-23",
      "13-28",
      "28-13",
      "18-27",
      "27-18",
      "28-19",
      "19-28",
      "28-29",
      "29-28",
      "24-33",
      "33-24",
      "18-34",
      "34-18",
      "20-34",
      "34-20"
    ],
  },
  // 36
  {
    id: "36-35",
    start: 36,
    end: 35,
    crossesRiver: false,
    blocks: [
      "29-44",
      "44-29"
    ],
  },
  {
    id: "36-40",
    start: 36,
    end: 40,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "36-20",
    start: 36,
    end: 20,
    crossesRiver: true,
    blocks: [],
  },
  {
    id: "36-29",
    start: 36,
    end: 29,
    crossesRiver: false,
    blocks: [],
  },
  // 37
  {
    id: "37-30",
    start: 37,
    end: 30,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "37-46",
    start: 37,
    end: 46,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "37-41",
    start: 37,
    end: 41,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "37-38",
    start: 37,
    end: 38,
    crossesRiver: false,
    blocks: [
        "25-41",
        "41-25",
        "27-41",
        "41-27",
        "31-48",
        "48-31"
    ],
  },
  {
    id: "37-26",
    start: 37,
    end: 26,
    crossesRiver: true,
    blocks: [
      "25-41",
      "41-25",
      "30-31",
      "31-30",
      "25-31",
      "31-25"
    ],
  },
  // 38
  {
    id: "38-37",
    start: 38,
    end: 37,
    crossesRiver: false,
    blocks: [
      "25-41",
      "41-25",
      "27-41",
      "41-27",
      "31-48",
      "48-31"
    ],
  },
  {
    id: "38-47",
    start: 38,
    end: 47,
    crossesRiver: false,
    blocks: [
        "41-42",
        "42-41",
        "31-48",
        "48-31",
        "41-48",
        "48-41"
    ],
  },
  {
    id: "38-42",
    start: 38,
    end: 42,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "38-50",
    start: 38,
    end: 50,
    crossesRiver: false,
    blocks: [
        "42-43",
        "43-42",
        "33-42",
        "42-33",
        "32-49",
        "49-32",
        "39-49",
        "49-39",
        "33-50",
        "50-33"
    ],
  },
  {
    id: "38-39",
    start: 38,
    end: 39,
    crossesRiver: false,
    blocks: [
        "33-42",
        "42-33",
        "32-43",
        "43-32",
        "32-49",
        "49-32",
        "33-50",
        "50-33"
    ],
  },
  {
    id: "38-32",
    start: 38,
    end: 32,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "38-16",
    start: 38,
    end: 16,
    crossesRiver: true,
    blocks: [
      "17-26",
      "26-17",
      "22-23",
      "23-22",
      "26-27",
      "27-26",
      "31-32",
      "32-31",
      "27-41",
      "41-27",
      "22-32",
      "32-22",
      "31-23",
      "23-31"
    ],
  },
  {
    id: "38-31",
    start: 38,
    end: 31,
    crossesRiver: false,
    blocks: [
      "27-41",
      "41-27"
    ],
  },
  // 39
  {
    id: "39-38",
    start: 39,
    end: 38,
    crossesRiver: false,
    blocks: [
      "33-42",
      "42-33",
      "32-43",
      "43-32",
      "32-49",
      "49-32",
      "33-50",
      "50-33"
    ],
  },
  {
    id: "39-49",
    start: 39,
    end: 49,
    crossesRiver: false,
    blocks: [
        "38-50",
        "50-38",
        "42-43",
        "43-42",
        "33-50",
        "50-33",
        "32-43",
        "43-32"
    ],
  },
  {
    id: "39-43",
    start: 39,
    end: 43,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "39-40",
    start: 39,
    end: 40,
    crossesRiver: false,
    blocks: [
        "34-44",
        "44-34",
        "35-51",
        "51-35",
        "35-45",
        "45-35",
        "29-44",
        "44-29"
    ],
  },
  {
    id: "39-35",
    start: 39,
    end: 35,
    crossesRiver: false,
    blocks: [
      "34-44",
      "44-34"
    ],
  },
  {
    id: "39-34",
    start: 39,
    end: 34,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "39-33",
    start: 39,
    end: 33,
    crossesRiver: false,
    blocks: [],
  },
  // 40
  {
    id: "40-39",
    start: 40,
    end: 39,
    crossesRiver: false,
    blocks: [
      "34-44",
      "44-34",
      "35-51",
      "51-35",
      "35-45",
      "45-35",
      "29-44",
      "44-29"
    ],
  },
  {
    id: "40-44",
    start: 40,
    end: 44,
    crossesRiver: false,
    blocks: [
        "35-45",
        "45-35"
    ],
  },
  {
    id: "40-45",
    start: 40,
    end: 45,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "40-36",
    start: 40,
    end: 36,
    crossesRiver: false,
    blocks: [],
  },
  // 41
  {
    id: "41-37",
    start: 41,
    end: 37,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "41-46",
    start: 41,
    end: 46,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "41-47",
    start: 41,
    end: 47,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "41-48",
    start: 41,
    end: 48,
    crossesRiver: false,
    blocks: [
        "38-47",
        "47-38"
    ],
  },
  {
    id: "41-42",
    start: 41,
    end: 42,
    crossesRiver: false,
    blocks: [
        "31-48",
        "48-31",
        "38-47",
        "47-38"
    ],
  },
  {
    id: "41-27",
    start: 41,
    end: 27,
    crossesRiver: false,
    blocks: [
        "16-38",
        "38-18",
        "22-32",
        "32-22",
        "31-32",
        "32-31",
        "31-38",
        "38-31",
        "37-38",
        "38-37",
        "31-48",
        "48-31"
    ],
  },
  {
    id: "41-25",
    start: 41,
    end: 25,
    crossesRiver: true,
    blocks: [
      "30-31",
      "31-30",
      "26-37",
      "37-26",
      "37-38",
      "38-37"
    ],
  },
  // 42
  {
    id: "42-41",
    start: 42,
    end: 41,
    crossesRiver: false,
    blocks: [
      "31-48",
      "48-31",
      "38-47",
      "47-38"
    ],
  },
  {
    id: "42-48",
    start: 42,
    end: 48,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "42-49",
    start: 42,
    end: 49,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "42-43",
    start: 42,
    end: 43,
    crossesRiver: false,
    blocks: [
        "38-50",
        "50-38",
        "32-49",
        "49-32",
        "33-50",
        "50-33",
        "39-49",
        "49-39"
    ],
  },
  {
    id: "42-33",
    start: 42,
    end: 33,
    crossesRiver: false,
    blocks: [
      "32-49",
      "49-32",
      "38-39",
      "39-38",
      "32-43",
      "43-32",
      "38-50",
      "50-38"
    ],
  },
  {
    id: "42-38",
    start: 42,
    end: 38,
    crossesRiver: false,
    blocks: [],
  },
  // 43
  {
    id: "43-42",
    start: 43,
    end: 42,
    crossesRiver: false,
    blocks: [
      "38-50",
      "50-38",
      "32-49",
      "49-32",
      "33-50",
      "50-33",
      "39-49",
      "49-39"
    ],
  },
  {
    id: "43-50",
    start: 43,
    end: 50,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "43-51",
    start: 43,
    end: 51,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "43-44",
    start: 43,
    end: 44,
    crossesRiver: false,
    blocks: [
        "35-51",
        "51-35"
    ],
  },
  {
    id: "43-39",
    start: 43,
    end: 39,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "43-32",
    start: 43,
    end: 32,
    crossesRiver: false,
    blocks: [
      "38-39",
      "39-38",
      "33-50",
      "50-33",
      "33-42",
      "42-33",
      "39-49",
      "49-39"
    ],
  },
  // 44
  {
    id: "44-34",
    start: 44,
    end: 34,
    crossesRiver: false,
    blocks: [
      "35-39",
      "39-35",
      "39-40",
      "40-39",
      "35-51",
      "51-35"
    ],
  },
  {
    id: "44-43",
    start: 44,
    end: 43,
    crossesRiver: false,
    blocks: [
      "35-51",
      "51-35"
    ],
  },
  {
    id: "44-51",
    start: 44,
    end: 51,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "44-52",
    start: 44,
    end: 52,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "44-45",
    start: 44,
    end: 45,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "44-40",
    start: 44,
    end: 40,
    crossesRiver: false,
    blocks: [
      "35-45",
      "45-35"
    ],
  },
  {
    id: "44-29",
    start: 44,
    end: 29,
    crossesRiver: false,
    blocks: [
      "35-36",
      "36-35",
      "39-40",
      "40-39",
      "35-45",
      "45-35"
    ],
  },
  // 45
  {
    id: "45-44",
    start: 45,
    end: 44,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "45-52",
    start: 45,
    end: 52,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "45-40",
    start: 45,
    end: 40,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "45-35",
    start: 45,
    end: 35,
    crossesRiver: false,
    blocks: [
      "39-40",
      "40-39",
      "29-44",
      "44-29",
      "40-44",
      "44-40"
    ],
  },
  // 46
  {
    id: "46-37",
    start: 46,
    end: 37,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "46-47",
    start: 46,
    end: 47,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "46-41",
    start: 46,
    end: 41,
    crossesRiver: false,
    blocks: [],
  },
  // 47
  {
    id: "47-46",
    start: 47,
    end: 46,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "47-48",
    start: 47,
    end: 48,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "47-41",
    start: 47,
    end: 41,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "47-38",
    start: 47,
    end: 38,
    crossesRiver: false,
    blocks: [
      "41-42",
      "42-41",
      "31-48",
      "48-31",
      "41-48",
      "48-41"
    ],
  },
  // 48
  {
    id: "48-47",
    start: 48,
    end: 47,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "48-49",
    start: 48,
    end: 49,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "48-42",
    start: 48,
    end: 42,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "48-41",
    start: 48,
    end: 41,
    crossesRiver: false,
    blocks: [
      "38-47",
      "47-38"
    ],
  },
  {
    id: "48-31",
    start: 48,
    end: 31,
    crossesRiver: false,
    blocks: [
      "37-38",
      "38-37",
      "27-41",
      "41-27",
      "38-47",
      "47-38",
      "41-42",
      "42-41"
    ],
  },
  // 49
  {
    id: "49-48",
    start: 49,
    end: 48,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "49-50",
    start: 49,
    end: 50,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "49-39",
    start: 49,
    end: 39,
    crossesRiver: false,
    blocks: [
      "38-50",
      "50-38",
      "42-43",
      "43-42",
      "33-50",
      "50-33",
      "32-43",
      "43-32"
    ],
  },
  {
    id: "49-32",
    start: 49,
    end: 32,
    crossesRiver: false,
    blocks: [
      "38-39",
      "39-38",
      "33-42",
      "42-33",
      "42-43",
      "43-42"
    ],
  },
  {
    id: "49-42",
    start: 49,
    end: 42,
    crossesRiver: false,
    blocks: [],
  },
  // 50
  {
    id: "50-49",
    start: 50,
    end: 49,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "50-51",
    start: 50,
    end: 51,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "50-43",
    start: 50,
    end: 43,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "50-33",
    start: 50,
    end: 33,
    crossesRiver: false,
    blocks: [
      "38-39",
      "39-38",
      "42-43",
      "43-42",
      "39-49",
      "49-39",
      "32-43",
      "43-32"
    ],
  },
  {
    id: "50-38",
    start: 50,
    end: 38,
    crossesRiver: false,
    blocks: [
      "42-43",
      "43-42",
      "33-42",
      "42-33",
      "32-49",
      "49-32",
      "39-49",
      "49-39",
      "33-50",
      "50-33"
    ],
  },
  // 51
  {
    id: "51-50",
    start: 51,
    end: 50,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "51-52",
    start: 51,
    end: 52,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "51-43",
    start: 51,
    end: 43,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "51-44",
    start: 51,
    end: 44,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "51-35",
    start: 51,
    end: 35,
    crossesRiver: false,
    blocks: [
      "39-40",
      "40-39",
      "34-44",
      "44-34",
      "43-44",
      "44-43"
    ],
  },
  // 52
  {
    id: "52-51",
    start: 52,
    end: 51,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "52-45",
    start: 52,
    end: 45,
    crossesRiver: false,
    blocks: [],
  },
  {
    id: "52-44",
    start: 52,
    end: 44,
    crossesRiver: false,
    blocks: [],
  },
];
