var running = false;
var textScreen = document.getElementById("textOutput");
var GFXscreen = document.getElementById("screenCanvas").getContext("2d");

var debug = {
    instructions: function () {
        for (var i = 0; i < instruction.length; i++) {
            console.log(i + ": " + instruction[i].description);
        }
    }
}

var memory = {
    program: {
        currentLocation: 0,
        mem: new Array(128),
        setBit: function (location, value) {
            memory.program.mem[location] = value;
        },
        changeCurrentLocation: function (amount) {
            memory.program.currentLocation += amount;
            if (memory.program.currentLocation > programMemSize) {
                memory.program.currentLocation = programMemSize;
            } else if (memory.program.currentLocation < 0) {
                memory.program.currentLocation = 0;
            }
        }
    },
    registers: {
        mem: new Array(32),
        setBit: function (location, value) {
            memory.registers.mem[location] = value;
        },
        selected: 0,
        select: function (num) {
            memory.registers.selected = num % 32;
        }
    }
}

var gui = {
    submitMemoryForm: function () {
        var location = document.getElementById("memoryLocation").value;
        var value = document.getElementById("memoryValue").value;
        memory.program.setBit(location, value);
    },
    dumpMemory: function () {
        gpu.writeLine("Program:\n" + memory.program.mem + "\nRegisters:\n" + memory.registers.mem)
    }
}

var action = {
    onToggle: function () {
        if (running) {
            document.getElementById("powerButton").setAttribute("class", "material-icons");
        } else {
            document.getElementById("powerButton").setAttribute("class", "material-icons onButton");
            action.boot();
        }
        running = !running;
    },
    stepToggle: function () {
        if (stepMode) {
            document.getElementById("debugButton").setAttribute("class", "material-icons");
        } else {
            document.getElementById("debugButton").setAttribute("class", "material-icons onButton");
        }
        stepMode = !stepMode;
    },
    stepNext: function () {
        if (stepMode) {
            stepNext = true;
        }
    },
    boot: function () {
        cpu.runProgram();
    },
    sendInput: function () {
        var input = document.getElementById("input").value;
        input.value = "";
        input.setAttribute("readonly", "");
    }
}

var cpu = {
    runProgram: function () {
        memory.program.currentLocation = 0;
        for (var i = 0; i < memory.program.mem.length; i += 2) {
            memory.program.currentLocation = i;
            if (memory.program.mem[memory.program.currentLocation] == undefined) {
                gpu.writeLine("Instruction " + memory.program.mem[memory.program.currentLocation] + " not found.");
                return;
            }
            instruction[memory.program.mem[memory.program.currentLocation]].run(memory.program.mem[memory.program.currentLocation + 1]);
        }
    }
}

var gpu = {
    writeLine: function (words) {
        textScreen.innerHTML += words + "\n";
        textScreen.scrollTop = textScreen.scrollHeight;
    },
    drawPixel: function (on, x, y) {
        if (on) {
            GFXscreen.fillStyle = "white";
        } else {
            GFXscreen.fillStyle = "black"
        }
        var screenWH = 300;
        var screenRes = 10;
        var pixelSize = screenWH / screenRes;
        GFXscreen.fillRect(x * pixelSize, y * pixelSize / 2, pixelSize, pixelSize / 2);

    },
    clearScreen: function () {
        GFXscreen.clearRect(0, 0, 300, 300);
    }
}

var storage = {
    snapshot: {
        save: function (name) {
            window.localStorage.setItem(name, memory.program.mem);
        },
        restore: function (name) {
            memory.program.mem = window.localStorage.getItem(name).split(",");
        },
        delete: function (name) {
            window.localStorage.removeItem(name);
        }
    }

}

var instruction = [
    {
        description: "Null instruction.",
        run: function () {
            return;
        }
    },
    {
        description: "Prints the argument to the output console.",
        run: function (arg) {
            gpu.writeLine(arg);
        }
    },
    {
        description: "Gets input and sets the nth register to it.",
        run: function (arg) {
            memory.registers.mem[arg] = prompt("The program is requesting input");
        }
    },
    {
        description: "Prints the selected register.",
        run: function () {
            gpu.writeLine(memory.registers.mem[memory.registers.selected]);
        }
    },
    {
        description: "Selects the nth register",
        run: function (arg) {
            memory.registers.select(arg);
        }
    },
    {
        description: "Sets the selected register to the argument",
        run: function (arg) {
            memory.registers.mem[memory.registers.selected] = arg;
        }
    },
    {
        description: "Sets the pixel x: register 0, y: register 1 to either on or off depending on the arg (1 or 0)",
        run: function (arg) {
            gpu.drawPixel(!!arg, memory.registers.mem[0], memory.registers.mem[1]);
        }
    }
]

for (var i = 0; i < memory.program.mem.length; i++) {
    memory.program.mem[i] = 0;
}

for (var i = 0; i < memory.registers.mem.length; i++) {
    memory.registers.mem[i] = 0;
}
