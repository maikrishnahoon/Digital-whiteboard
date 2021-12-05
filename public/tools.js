let optionsCont = document.querySelector(".options-cont");
let optFlag = true;
let toolCont = document.querySelector(".tools-cont");
let penTool = document.querySelector(".pencil-tool-cont");
let eraserTool = document.querySelector(".eraser-tool-cont");
let pen = document.querySelector(".pen");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".stickyNote");
let gallery = document.querySelector(".gallery");
let penFlag = false;
let eraserFlag = false;

//true -> show the tools, false -> hide the tools
optionsCont.addEventListener("click", (e) => {
    optFlag = !optFlag;

    if (optFlag) {
        openTools();
    }
    else {
        closeTools();
    }
})

pen.addEventListener("click", (e) => {
    penFlag = !penFlag;
    
    if (penFlag) {
        penTool.style.display = "block";
    }
    else {
        penTool.style.display = "none";
    }

})

eraser.addEventListener("click", (e) => {
    eraserFlag = !eraserFlag;

    if (eraserFlag) {
        eraserTool.style.display = "flex";
    }
    else {
        eraserTool.style.display = "none";
    }
})


function openTools() {
    let iconEle = optionsCont.children[0];
    iconEle.classList.remove("fa-times");
    iconEle.classList.add("fa-bars");
    toolCont.style.display = "flex";
}

function closeTools() {
    let iconEle = optionsCont.children[0];
    iconEle.classList.remove("fa-bars");
    iconEle.classList.add("fa-times");
    toolCont.style.display = "none";
    penTool.style.display = "none";
    eraserTool.style.display = "none";
}

sticky.addEventListener("click", (e) => {
    let stickyTemplate = `    
    <div class="header-cont">
        <div class="mini"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck = "false"></textarea>
    </div>
    `;

    createSticky(stickyTemplate);
})

function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })

    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display === "none") {
            noteCont.style.display = "block";
            console.log("hello");
        }
        else {
            noteCont.style.display = "none";
            console.log("ok");
        }
    })
}

function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".mini");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}

gallery.addEventListener("click", (e) => {
    //open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplate = `    
        <div class="header-cont">
            <div class="mini"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src= "${url}"/>
        </div>
        `;

        createSticky(stickyTemplate);
        
    })
})

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    //moves the ball at (pageX,pageY) coordinates
    //taking initial shifts into account
    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    //moves the ball on mouse move
    document.addEventListener('mousemove', onMouseMove);

    //drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    }

}