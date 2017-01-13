var gameOfLife = {

    width: 12,
    height: 12, // width and height dimensions of the board
    stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

    utils: {

        getCellCoordinates: function (cell) {
            return cell.id.split('-').map(function (s) {
                return parseInt(s, 10);
            });
        },

        setCellStatus: function (cell, desiredStatus) {
            cell.className = desiredStatus;
            cell.setAttribute('data-status', desiredStatus);
        },

        getCellStatus: function (cell) {
            return cell.getAttribute('data-status');
        },

        toggleCellStatus: function (cell) {
            if (this.getCellStatus(cell) === 'alive') {
                this.setCellStatus(cell, 'dead');
            } else {
                this.setCellStatus(cell, 'alive');
            }
        },

        selectCell: function (x, y) {
            return document.getElementById(x + '-' + y);
        },

        getCellNeighbors: function (cell) {

            var coords = this.getCellCoordinates(cell); // [x, y]
            var neighbors = [];

            // Row above
            neighbors.push(this.selectCell(coords[0] - 1, coords[1] - 1));
            neighbors.push(this.selectCell(coords[0], coords[1] - 1));
            neighbors.push(this.selectCell(coords[0] + 1, coords[1] - 1));

            // Row below
            neighbors.push(this.selectCell(coords[0] - 1, coords[1] + 1));
            neighbors.push(this.selectCell(coords[0], coords[1] + 1));
            neighbors.push(this.selectCell(coords[0] + 1, coords[1] + 1));

            // Besides
            neighbors.push(this.selectCell(coords[0] - 1, coords[1]));
            neighbors.push(this.selectCell(coords[0] + 1, coords[1]));

            return neighbors.filter(function (neighbor) {
                return neighbor !== null;
            });

        },

        countAliveNeighborsOfCell: function (cell) {

            var neighbors = this.getCellNeighbors(cell);

            var self = this;

            var aliveNeighbors = neighbors.filter(function (neighbor) {
                return self.getCellStatus(neighbor) === 'alive';
            });

            return aliveNeighbors.length;

        }

    },

    createAndShowBoard: function () {

        // create <table> element
        var goltable = document.createElement("tbody");

        // build Table HTML
        var tablehtml = '';
        for (var h = 0; h < this.height; h++) {
            tablehtml += "<tr id='row+" + h + "'>";
            for (var w = 0; w < this.width; w++) {
                tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
            }
            tablehtml += "</tr>";
        }
        goltable.innerHTML = tablehtml;

        // add table to the #board element
        var board = document.getElementById('board');
        board.appendChild(goltable);

        // once html elements are added to the page, attach events to them
        this.setupBoardEvents();
    },

    forEachCell: function (iteratorFunc) {
        /*
         Write forEachCell here. You will have to visit
         each cell on the board, call the "iteratorFunc" function,
         and pass into func, the cell and the cell's x & y
         coordinates. For example: iteratorFunc(cell, x, y)
         */
        var self = this;
         [].slice.call(document.getElementsByTagName('td'))
          .forEach(function (cell) {
              var coords = self.utils.getCellCoordinates(cell);
              iteratorFunc(cell, coords[0], coords[1]);
          });
    },

    setupBoardEvents: function () {
        // each board cell has an CSS id in the format of: "x-y"
        // where x is the x-coordinate and y the y-coordinate
        // use this fact to loop through all the ids and assign
        // them "click" events that allow a user to click on
        // cells to setup the initial state of the game
        // before clicking "Step" or "Auto-Play"

        // clicking on a cell should toggle the cell between "alive" & "dead"
        // for ex: an "alive" cell be colored "blue", a dead cell could stay white

        // EXAMPLE FOR ONE CELL
        // Here is how we would catch a click event on just the 0-0 cell
        // You need to add the click event on EVERY cell on the board

        var self = this;

        var onCellClick = function (e) {

            // QUESTION TO ASK YOURSELF: What is "this" equal to here?

            // how to set the style of the cell when it's clicked
           self.utils.toggleCellStatus(this);

        };

        this.forEachCell(function (eachCell, x, y) {
            eachCell.addEventListener('click', onCellClick);
        });


        document.getElementById('reset_btn').addEventListener('click', this.randomizeBoard.bind(this));
        document.getElementById('clear_btn').addEventListener('click', this.clearBoard.bind(this));
        document.getElementById('step_btn').addEventListener('click', this.step.bind(this));
        document.getElementById('play_btn').addEventListener('click', this.enableAutoPlay.bind(this));


    },

    randomizeBoard: function () {

        var self = this;

        this.forEachCell(function (cell) {

            if (Math.random() > .5) {
                self.utils.setCellStatus(cell, 'alive');
            } else {
                self.utils.setCellStatus(cell, 'dead');
            }

        });

        this.stop();

    },

    clearBoard: function () {


        var self = this;

        this.forEachCell(function (cell) {
            self.utils.setCellStatus(cell, 'dead');
        });

        this.stop();


    },

    step: function () {
        // Here is where you want to loop through all the cells
        // on the board and determine, based on it's neighbors,
        // whether the cell should be dead or alive in the next
        // evolution of the game.
        //
        // You need to:
        // 1. Count alive neighbors for all cells
        // 2. Set the next state of all cells based on their alive neighbors

        var self = this;
        var cellsINeedToToggleLater = [];

        this.forEachCell(function (cell) {

            var amountOfLiveNeighbors = self.utils.countAliveNeighborsOfCell(cell);

            if (self.utils.getCellStatus(cell) === 'dead') {
                if (amountOfLiveNeighbors === 3) {
                    // make it alive
                    cellsINeedToToggleLater.push(cell);
                }
            } else {
                if (amountOfLiveNeighbors !== 2 && amountOfLiveNeighbors !== 3) {
                    cellsINeedToToggleLater.push(cell);
                }
            }

        });

        cellsINeedToToggleLater.forEach(function (cell) {
            self.utils.toggleCellStatus(cell);
        });

    },

    stop: function () {
        clearInterval(this.stepInterval);
        this.stepInterval = null;
    },

    enableAutoPlay: function () {
        // Start Auto-Play by running the 'step' function
        // automatically repeatedly every fixed time interval

        if (this.stepInterval === null) {
            this.stepInterval = setInterval(this.step.bind(this), 200);
        } else {
            this.stop();
        }

    }

};

gameOfLife.createAndShowBoard();
