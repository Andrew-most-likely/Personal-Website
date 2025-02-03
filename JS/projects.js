document.body.onload = addelement;

function addelement() {
    //create a new div element
    const newDiv = document.createElement("div");

    //give div content
    const newContent = document.createTextNode("Hello World.");

    //add text to div
    newDiv.appendChild(newContent);
    
    //add content in the Document Object Model or (DOM)
    const content = document.getElementById("projectSection")
}