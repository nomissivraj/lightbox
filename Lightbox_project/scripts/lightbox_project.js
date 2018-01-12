// Lightbox Revamp
//Pseudo
//Check dom for content to display
//save information relevant to each item
//display content based on data and types

var animation;
var width = 400;
var height = 400;
var mode = "";
var elements = [];
var imageModeAll = true;
var showCaption = true;
var lastId;
//Build individual components
// Starts by finding all slightbox elements in the DOM identified either by class or 
function hasClass(el,classname) {
    el = el.classList.toString();
    if (el.indexOf(classname) === 0) {
        return true
    } else return false;
}

function initLightbox(selectedClass) {
    var classes = document.getElementsByClassName(selectedClass);
    for (i = 0; i < classes.length; i++) {
        elements.push(classes[i]);
        // IF we want keyboard users to access the image - add tabindex 0 to .slightbox elements that are images
    }

    if (imageModeAll === true) {
        var images = document.getElementsByTagName('img');
        for (i = 0; i < images.length; i++) {
            if (!hasClass(images[i], selectedClass)){
                elements.push(images[i]);
            }
            // IF we want keyboard users to access the image - add tabindex 0 to the images
        }
    }
    initListen();
}

function initListen() {
    for (i = 0; i < elements.length; i++) {
        if (elements[i])
        elements[i].id = "saveId"+i;
        elements[i].style.cursor = "pointer";
        elements[i].addEventListener('click', function(event){
            beginSlightbox(event, this);
        });
        elements[i].addEventListener('blur', function(event){
            saveId(event, this);
        });
    }
}
function isOpen() {
    var el = document.getElementsByClassName('slightbox__overlay');
    if (el[0]){
        return true;
    } else {
        return false;
    }
}
function saveId(id) {
    console.log(id.path[0]);
    if (!id.path[0].id) {
        //alert("Please give link/button an id") keep this after fix
        return;
    }
    lastId = id.path[0];  
}

function beginSlightbox(e, el) {
    //mode = el.nodeName === "IMG" || el.dataset.iframe ? "image" : false;
    if (el.nodeName === "IMG" || el.dataset.imageLink) {
        mode = "image";
    } else if (el.dataset.linkHtml) {
        mode = "modal";
    } else if (el.dataset.iframe) {
        mode = "iframe";
    } else /* if dataset or something indicates gallery*/ mode = false;

    buildLightbox(e, el, width, height);
}

//event listener will have a separate function which calls this one as well as
//saving the link id that was clicked

//Build lightbox parts, starting with the core/common frame
///Build lightbox Core
function buildLightbox(e, el, w, h) {
    var lightboxElCont = document.createElement('div');
    lightboxElCont.setAttribute("class", "slightbox__overlay");
    /// give role and aria attr
    lightboxElCont.setAttribute("role", "dialogue");
    lightboxElCont.setAttribute("aria-labelledby", "dialogueTitle");
    lightboxElCont.setAttribute("aria-describedby", "dialogueDescription");

    // call function to make correct container box
    if (mode === "modal") {
        var lightboxEl = buildModal();
    } else if (mode === "image") {
        var lightboxEl = buildImage(e, el);
    } else if (mode === "iframe") {
        var lightboxEl = buildIframe();
    } else if (mode === "gallery") {
        var lightboxEl = buildGallery();
    } else {return false}
    
    
    // Add content container to the lightbox
    lightboxElCont.appendChild(lightboxEl);
    lightboxElCont.appendChild(buildCloseBtn());
    // Add Lightbox to page
    if(document.body != null) { 
        document.body.appendChild(lightboxElCont);
    }
    slightboxPos();
}

///Build parts 

function buildCaption(e,el) {
    var caption = document.createElement('div');
    caption.setAttribute("class", "lightbox__caption");
    console.log(el);
    // build div with p element in and write logic to pull
    //caption from either alt tag or data tag if showCaption is set true
    var captionContent = document.createElement('p'); //does this need to be tabindex 0?
    //check if either alt or data exists before attempting [DO THIS]
    var text = el.alt || el.data.lightboxTitle; // getting text
    captionContent.innerHTML = text;
    captionContent.id ="dialogueTitle";
    captionContent.classList += "lightbox-caption";
    caption.appendChild(captionContent);

    return caption;
}

function buildCloseBtn() {
    var closeBtn = document.createElement('a');
    closeBtn.setAttribute("id", "close");
    closeBtn.setAttribute("href", "#");
    closeBtn.setAttribute("alt", "close lightbox");
    closeBtn.innerHTML = "X";
    return closeBtn;
}

function buildModal() {
    var newContent = document.createElement('div');
    newContent.setAttribute("class", "slightbox__content");
    ///testing
    var testText = document.createElement('p');
    testText.innerHTML = "MODAL";
    newContent.appendChild(testText);
    ///
    return newContent;    
}

function buildImage(e, el) {
    var newContent = document.createElement('div');
    newContent.setAttribute("class", "slightbox__content");
    ///testing
    var image = document.createElement('IMG');
    image.src = el.src || el.dataset.imageLink;
    newContent.appendChild(image);
    
    //caption
    if (showCaption) {
        newContent.appendChild(buildCaption(e, el));
    }
    //showCaption ? buildCaption(): console.log("captions disabled");
    ///
    return newContent; 
}

function buildIframe() {
    var newContent = document.createElement('div');
    newContent.setAttribute("class", "slightbox__content");
    ///testing
    var testText = document.createElement('p');
    testText.innerHTML = "IFRAME";
    newContent.appendChild(testText);
    ///
    return newContent; 
}

function buildGallery() {
    var newContent = document.createElement('div');
    newContent.setAttribute("class", "slightbox__content");
    ///testing
    var testText = document.createElement('p');
    testText.innerHTML = "GALLERY";
    newContent.appendChild(testText);
    ///
    return newContent; 
}

// Handle positioning and size of lightbox
function slightboxPos() {
    var box = document.getElementsByClassName('slightbox__content');
    var closeBtn = document.getElementById('close');
    //set width
    box[0].style.maxWidth = width + "px";
    //get total width/heights including paddings etc
    var newHeight = box[0].offsetHeight;
    var newWidth = box[0].offsetWidth;
    // set vertical position so that the frame is centered
    box[0].style.top = "calc(50% - " + newHeight/2 + "px)";
    closeBtn.style.top = "calc(50% - " + newHeight/2 + "px)";
    closeBtn.style.right = "calc(50% - " + newWidth/2 + "px)";
}

function closeLightbox() {
    var el = document.getElementsByClassName('slightbox__overlay');
    el[0].remove();
}