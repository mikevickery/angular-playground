﻿var app = angular.module('racingFrogs', []);
app.controller('MainController', MainController);
//No need to change anything above this line.

function MainController(BettingService, $timeout) {
    var vm = this; //instead of using this when referring to the controller, let's use vm. It will make things easier.
    vm.working = "Yes";

    vm.frogSet = [
        { lane: 1, name: "Frank", posX: 0, picUrl: "img/BullFrog.gif", color: "red" },
        { lane: 2, name: "Harry", posX: 0, picUrl: "img/BullFrog.gif", color: "green" },
        { lane: 3, name: "Eddie", posX: 0, picUrl: "img/BullFrog.gif", color: "maroon" },
        { lane: 4, name: "Duane", posX: 0, picUrl: "img/BullFrog.gif", color: "blue" },
        { lane: 5, name: "Hank", posX: 0, picUrl: "img/BullFrog.gif", color: "orange" },
        { lane: 6, name: "Drake", posX: 0, picUrl: "img/BullFrog.gif", color: "indigo" },
        { lane: 7, name: "Gerik", posX: 0, picUrl: "img/BullFrog.gif", color: "brown" },
        { lane: 8, name: "Monte", posX: 0, picUrl: "img/BullFrog.gif", color: "purple" },
        { lane: 9, name: "Abel", posX: 0, picUrl: "img/BullFrog.gif", color: "orangered" }
    ];

    // initial load of 6 frogs and no winner yet
    vm.frogs = [];
    for (var i = 0; i < 6; i++) {
        vm.frogs.push(vm.frogSet[i]);
    }
    vm.winner = "You have " + vm.frogs.length + "  frogs ready to RACE ! ";
    var raceReady = false;

    for (var i = 0; i < 9; i++) {
        vm.raceId = BettingService.registerRace();
    }
    vm.races = BettingService.getAllRace();

    vm.setFrogposX = function () {
        for (var i = 0; i < vm.frogs.length; i++) {
            vm.frogs[i].posX = 0;
            document.getElementById('frog' + (i + 1)).style.left = vm.frogs[i].posX + "px";
            vm.winner = "You have " + vm.frogs.length + "  frogs ready to RACE ! ";
        }
    }

    vm.addFrog = function () {
        var a = vm.frogs.length + 1;
        if (a > 9) { a = 9 };
        vm.frogs = [];
        for (var i = 0; i < a; i++) {
            vm.frogs.push(vm.frogSet[i]);
        }
        vm.setFrogposX();
    }

    vm.removeFrog = function () {
        var a = vm.frogs.length - 1;
        if (a < 2) { a = 2 };
        vm.frogs = [];
        for (var i = 0; i < a; i++) {
            vm.frogs.push(vm.frogSet[i]);
        }
        vm.setFrogposX();
    }

    vm.getTrackWidth = function () {
        var raceTrackWidth = document.getElementById('raceTrack').offsetWidth - 50 ;
        //console.log("Track width is : " + raceTrackWidth);  in px
        return raceTrackWidth;
    };

    vm.practiceHeat = function () {
        if (!raceReady) {
            vm.winner = "";
            vm.setFrogposX();
            raceReady = true;
            vm.startRace();
        }
    }

    vm.newRace = function () {
        vm.winner = "";
        vm.races = BettingService.getAllRace();
        raceReady = true;
        for (var i = 0; i < vm.frogs.length; i++) {
            vm.frogs[i].posX = 0;
            document.getElementById('frog' + (i + 1)).style.left = vm.frogs[i].posX + "px";
            vm.winner = "You have " + vm.frogs.length + "  frogs ready to RACE ! ";
        }
    }

    vm.startRace = function () {
        if (raceReady) {
            vm.winner = "And they're off ! ";
            var itsDone = false;
            var winning = 0;
            var raceTrackWidth = document.getElementById('raceTrack').offsetWidth - 50;
            if (!itsDone) {
                for (var i = 0; i < vm.frogs.length; i++) {
                    var posX = vm.frogs[i].posX + Math.floor(Math.random() * 20);
                    vm.frogs[i].posX = posX;
                    document.getElementById('frog' + (i + 1)).style.left = posX + "px";
                    if (winning < posX) { winning = posX; };
                    if (winning >= raceTrackWidth) {
                        vm.winner = " Winner: " + vm.frogs[i].name + " wearing " + vm.frogs[i].color + " in lane " + vm.frogs[i].lane + "   ";
                        itsDone = true;
                        break;
                    }
                }
            }
            if (!itsDone) {
                $timeout(vm.startRace, 70);
            } else {
                raceReady = false;
            }
        }
    }


    // Fun with Joe and Bob panel ------------------------------------------------------------ 
    vm.joe = new Guy("Joe", 100);
    vm.bob = new Guy("Bob", 150);
    vm.bank = 200;

    function Guy(name, startingCash) {
        this.name = name;
        this.cash = startingCash;
        this.giveCash = function (amount) {
            if (amount <= this.cash && amount > 0) {
                this.cash = this.cash - amount;
                return amount;
            } else {
                console.log("I don't have enough cash to give you " + amount + ". " + this.name + " says...");
                return 0;
            }
        };
        this.receiveCash = function (amount) {
            if (amount > 0) {
                this.cash = this.cash + amount;
                return amount;
            } else {
                console.log(amount + " isn't an amount I'll take " + this.name + " says...");
                return 0;
            }
        }
    }

    vm.giveMoneyToJoe = function () {
        if (vm.bank >= 10) {
            vm.bank -= vm.joe.receiveCash(10);
        } else {
            alert("The bank is out of money.");
        }
    }

    vm.receiveMoneyFromBob = function () {
        vm.bank += vm.bob.giveCash(5);
    }

}

// Betting Service is separate from Main Controller ================================= 
app.service('BettingService', BettingService);

function BettingService() {
        var _races = {};
        var _raceId = 0;
        this.registerRace = function () {
            var race = new Race();
            return race.id;
        }
        this.getAllRace = function () {
            return _races;
        }
        this.getRace = function (raceId) {
            return _races[raceId];
        }
        this.addContestant = function (raceId, contestant) {
            //Adds a frog to the race object remember to get the race first
            //Also dont let frogs be added after the race has started.
        }
        this.getContestants = function (raceId) {
            //just returns the contestants for a specified race
        }
        //Number raceId, String bettingOn, Boolean outcome, Number wager 
        this.placeBet = function (raceId, bettingOn, wager) {
            console.log("BettingService.placeBet has been called")
            /*this function is the one that gets called from your controller.
              build the appropriate bet object fro the arguments and add it to the race.
              consider ensuring that the raceId is an actual race object 
              validate the bettingOn contestant
              pool the wages from the race
            */
        }
        this.closeRace = function (raceId) {
            //No more bets please the race has started
        }
        this.setWinners = function (raceId, winners) {
            //make sure winners can only be set once
        }
        function isValidBet(race, bet) {
            var valid;
            for (var i = 0; i < race.contestants.length; i++) {
                //make sure the frog selected is actually in the race system Prevents Cheating        
            }
            return valid;
        }
        function generateTicket(race, bet) {
            //responsible for adding a bet to the specified race by its ticketNumber
            //Don't forget to increase the ticketing count system
            race.tickets++;
        }
        var Race = function () {
            this.id = _raceId;
            this.tickets = 1300;
            this.contestants = [];
            this.open = true;
            this.bets = {};
            this.winner = {};
            _races[this.id] = this;
            _raceId++;
        }

    }
// end of Betting Service =====================================================
