var currentLocation = 0;
const memSize = 127;
var memory = new Array(memSize + 1);

var debug = {
    memory: function() {
        console.log(memory);
    }
}

function setMemoryBit (location, value) {
    memory[location] = value;
}

function changeCurrentLocation (amount) {
    currentLocation += amount;
    if (currentLocation > memSize) {
        currentLocation = memSize;
    } else if (currentLocation < 0) {
        currentLocation = 0;
    }
}

function submitMemoryForm() {
    var location = document.getElementById("memoryLocation").value;
    var value = document.getElementById("memoryValue").value;
    setMemoryBit(location, memory);
}
