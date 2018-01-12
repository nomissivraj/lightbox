/* slightboxjs 2.0 */

/* controls */

/* ANIMATION OPTIONS
"fade",
"slide-down", "slide-down-return",
"slide-up", "slide-up-return"
"slide-right", "slide-right-return"
"slide-left", "slide-left-return"
*/
var imageModeAll = true; // applies lightbox functionality to all images in the DOM
var imageFocus = true; // True makes images focusable by keyboard
var animate = "grow"; // Select which animation you want the lightbox to transition in and out with (list of animation options above)
var elements = []; /* look into deleting element duplicates */
var lastId; // stores the element that was clicked/selected to display lightbox - so that it can be refocused as lightbox closes.

function addTabIndex() { //add this to the onload
    //if imageModeAll = true - get all img tags and add tab-index 0 also add saveId() click event listner
    if (imageModeAll && imageFocus) {
        var elements = document.getElementsByTagName('img');
        for (var i = 0; i < elements.length; i++) {
            elements[i].tabIndex = 0;
        }
    }
    //if imageModeAll = false - apply tab-index 0 to all with slightbox class also add saveId() click event listner
    if (!imageModeAll && imageFocus) {
        var elements = document.getElementsByClassName('slightbox');
        for (var i = 0; i < elements.length; i++) {
            elements[i].tabIndex = 0;
        }
    }
}

function animateIn(animate) {
    var el = document.getElementsByClassName('slightbox__overlay');
    if (animate === "fade") {
        el[0].classList.add("fade-in");
        setTimeout(function() {
            removeClass("fade-in");
        }, 600);
    }
    if (animate === "grow") {
        el[0].classList.add("grow");
        setTimeout(function() {
            removeClass("grow");
        }, 600);
    }
    if (animate === "slide-down" || animate === "slide-down-return") {
        el[0].classList.add("slide-in--down");
        
        setTimeout(function() {
            removeClass("slide-in--down");
        }, 600);
    }
    if (animate === "slide-up" || animate === "slide-up-return") {
        el[0].classList.add("slide-in--up");
        
        setTimeout(function() {
            removeClass("slide-in--up");
        }, 600);
    }
    if (animate === "slide-right" || animate === "slide-right-return") {
        el[0].classList.add("slide-in--right");
        
        setTimeout(function() {
            removeClass("slide-in--right");
        }, 600);
    }
    if (animate === "slide-left" || animate === "slide-left-return") {
        el[0].classList.add("slide-in--left");
        
        setTimeout(function() {
            removeClass("slide-in--left");
        }, 600);
    }
}

function animateOut(animate) {
    var el = document.getElementsByClassName('slightbox__overlay');
    if (animate === "fade") {
        el[0].classList.add("fade-out");
    }
    if (animate === "grow") {
        el[0].classList.add("shrink");
    }
    if (animate === "slide-down" || animate === "slide-up-return") {
        el[0].classList.add("slide-out--down");
    }
    if (animate === "slide-up" || animate === "slide-down-return") {
        el[0].classList.add("slide-out--up")
    }
    if (animate === "slide-right" || animate === "slide-left-return") {
        el[0].classList.add("slide-out--right")
    }
    if (animate === "slide-left" || animate === "slide-right-return") {
        el[0].classList.add("slide-out--left")
    }
    setTimeout(closeLightbox, 400);
}

function removeClass(className) {
    document.getElementsByClassName(className)[0].classList.toggle(className);
}
/* Save & Reset last element */
function saveId(id) {
    console.log(id.path[0]);
    if (!id.path[0].id) {
        //alert("Please give link/button an id") keep this after fix
        return;
    }
    lastId = id.path[0];
    
}

function resetCursor() {
    if (!lastId) {return;}
    lastId.focus();
}

function getFirstLast(position) {
    position = position.toLowerCase();
    if (position == "first") {
        var firstLink = document.getElementsByClassName('slightbox__content')[0].getElementsByTagName('a')[0];
        var title = document.getElementsByClassName('slightbox__content')[0].getElementsByTagName('h2')[0];
        var firstFocusPos = firstLink || title;
        return firstFocusPos;
    } else if (position == "last") {
        var lastFocusPos = document.getElementsByClassName('slightbox__overlay')[0].lastElementChild;
        return lastFocusPos;
    } else return false;
}

function setFocus(position) {
    if (position === "first") {
        var firstFocusPos = getFirstLast(position);

        firstFocusPos.focus();
    }
    if (position === "last") {
        var lastFocusPos = getFirstLast(position);

        lastFocusPos.focus();
    }
}

// Get elements that will open lightbox and add to array
function findElements () {
    var classes = document.getElementsByClassName('slightbox');
    for (i = 0; i < classes.length; i++) {
        elements.push(classes[i]);
        // IF we want keyboard users to access the image - add tabindex 0 to .slightbox elements that are images
    }

    if (imageModeAll === true) {
        var images = document.getElementsByTagName('img');
        for (i = 0; i < images.length; i++) {
            elements.push(images[i]);
            // IF we want keyboard users to access the image - add tabindex 0 to the images
        }
    }
    initListen();
}

function initListen() {
    for (i = 0; i < elements.length; i++) {
        elements[i].id = "saveId"+i;
        elements[i].style.cursor = "pointer";
        elements[i].addEventListener('click', function(event){
            openSlightbox(event, this);
        });
        elements[i].addEventListener('blur', function(event){
            saveId(event, this);
        });
    }
}

function openSlightbox(e, el) {
    console.log(el.parentElement.parentElement)
    if (el.parentElement.className === "sb-group") {console.log("huzzah")}
    if (document.getElementsByClassName('slightbox__overlay')[0]) {return;}

    // make overlay container
    var newEl = document.createElement('div');
    newEl.setAttribute("class", "slightbox__overlay");
    /// give role and aria attr
    newEl.setAttribute("role", "dialogue");
    newEl.setAttribute("aria-labelledby", "dialogueTitle");
    newEl.setAttribute("aria-describedby", "dialogueDescription");

    // make content container box
    newContent = document.createElement('div');
    newContent.setAttribute("class", "slightbox__content");
    if (el.nodeName === "IMG" || el.dataset.imageLink) {newContent.className += " image";}
    if (el.dataset.iframe) {newContent.className += " slightbox__content--iframe";}
    newEl.appendChild(newContent);
    

    //Make close button
    var closeBtn = document.createElement('a');
    closeBtn.setAttribute("id", "close");
    closeBtn.setAttribute("href", "#");
    closeBtn.setAttribute("alt", "close lightbox");
    closeBtn.innerHTML = "X";
    newEl.appendChild(closeBtn);

    //has title data or alt tag
    if (el.dataset.slightboxTitle || el.alt) {
        //make title
        var title = el.dataset.slightboxTitle || el.alt;
        console.log(el.alt);
        var h2 = document.createElement('h2');
        h2.setAttribute("tabindex", "0");
        h2.innerHTML = title;
        h2.id = "dialogueTitle";
        //append title
        newContent.appendChild(h2);
    } else if (!el.dataset.slightboxTitle && !el.alt) {alert("You need to give your slightbox element a data-slightbox-title")}

    //make dialogue description div
    var dialogueDescDiv = document.createElement('div');
    dialogueDescDiv.id = "dialogueDescription";
    newContent.appendChild(dialogueDescDiv);


    //has description
    if (el.dataset.slightboxDesc) {
        var desc = el.dataset.slightboxDesc;
        var p = document.createElement('p');
        p.innerHTML = desc;
        dialogueDescDiv.appendChild(p);
    }
    // if el is a link
    if (el.nodeName == "A"){
        if (!el.dataset.linkHtml) {
            //build from href=""
        }
        //if target is modal - get content
        if (el.dataset.linkHtml){
            var modalId = el.dataset.linkHtml;
            var modalContent = document.getElementById(modalId).cloneNode(true);
            modalContent.id = "someid";
            modalContent.classList.remove('hidden');
            dialogueDescDiv.appendChild(modalContent);
        }
        if (el.dataset.iframe) {
            //build iframe markup
            //insert el.dataset.iframe value
            var iframe = document.createElement('iframe');
            iframe.src = el.dataset.iframe;
            iframe.setAttribute('frameborder', "0");
            iframe.setAttribute('allowfullscreen', "true");
            iframe.style.width = "calc(100% - 10px)";
            iframe.style.height = "calc(90% - 80px)";
            iframe.style.position = "absolute";
            dialogueDescDiv.appendChild(iframe);
            // resize similar to image
        }
    }
    /* if el is an image */
    // use alt tag
    if (el.nodeName == "IMG" || el.dataset.imageLink){
        var image = document.createElement('img');
        image.src = el.src || el.dataset.imageLink;
        dialogueDescDiv.appendChild(image);

    }
    //append to body and check position
    if(document.body != null) { 
        document.body.appendChild(newEl);
        slightboxPos();
    }
    
    setFocus("first");
    //console.log(lastId);
    animateIn(animate);
}
// END openSlightbox() function

function closeLightbox() {
    var el = document.getElementsByClassName('slightbox__overlay');
    el[0].remove();
}

function isOpen() {
    var el = document.getElementsByClassName('slightbox__overlay');
    if (el[0]){
        return true;
    } else {
        return false;
    }
}

function slightboxPos() {
    var box = document.getElementsByClassName('slightbox__content');
    var closeBtn = document.getElementById('close');
    var newHeight = box[0].offsetHeight;
    var newWidth = box[0].offsetWidth;
    /* set height of element to be exactly centered in the window */
    box[0].style.top = "calc(50% - " + newHeight/2 + "px)";
    closeBtn.style.top = "calc(50% - " + newHeight/2 + "px)";
    closeBtn.style.right = "calc(50% - " + newWidth/2 + "px)";
}

/* --------------------------------------| EVENTS |---------------------------------------- */

// Find all elements with a class of slightbox
window.onload = function() {
    findElements();
    addTabIndex();
}

/* --------------- Handle Position on window resize --------------- */
window.addEventListener("resize", function() {
    if (isOpen()) {
        slightboxPos();
    }
});

/* --------------- Handle closing Lightbox --------------- */
/* close with mouse */
document.addEventListener("click", function(){
    var slightbox = document.getElementsByClassName('slightbox__overlay');// Get actionable element
    var closeBtn = document.getElementById('close');
    // If slightbox is clicked toggle hide 
    window.onclick = function(event) {
        if (event.target == slightbox[0] || event.target == closeBtn) {
            animateOut(animate);
            resetCursor();
        }
    }   
});

/* close on hitting ESC */
document.onkeydown = function(e) {
    // if lightbox is open toggle closed 
    if (!isOpen()) {return}
    e = e || window.event;
    if (e.keyCode == 27) {
        animateOut(animate);
        resetCursor();
    }
};

/* limit tab scope */

/* if shift tabbed on first link */
document.addEventListener("keydown", function(e) {
    /* if lightbox is open and active element is the first link */
    if (isOpen() && getFirstLast("first") == document.activeElement) {
        e = e || window.event;

        if (e.keyCode == 9 && e.shiftKey) {
            setFocus("last");
            e.preventDefault();
        }
    }
});


/* if tabbed on last link */
document.addEventListener("keydown", function(e) {
    /* if lightbox is open and active element is the last link */
    if (isOpen() && getFirstLast("last") == document.activeElement) {
        e = e || window.event;

        if (e.keyCode == 9 && !e.shiftKey) {
            setFocus("first");
            e.preventDefault();
        }

    }
});