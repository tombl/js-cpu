var running = false;
var stepMode = false;

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
    stepNext: function () {},
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
        var output = document.getElementById('output');
        output.innerHTML += words + "\n";
        output.scrollTop = output.scrollHeight;
    }
}

var storage = {

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
            gpu.writeLine(arg);
        }
    },
    {
        description: "Prints the registers.",
        run: function () {
            gpu.writeLine("Registers:\n" + memory.registers.mem);
        }
    }
]

for (var i = 0; i < memory.program.mem.length; i++) {
    memory.program.mem[i] = 0;
}

for (var i = 0; i < memory.registers.mem.length; i++) {
    memory.registers.mem[i] = 0;
}
