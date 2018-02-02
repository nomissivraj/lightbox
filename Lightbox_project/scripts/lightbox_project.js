// Lightbox Revamp
//Pseudo
//Check dom for content to display
//save information relevant to each item
//display content based on data and types

//[TO CONSIDER: MOVE CONTENT DIV FROM MODULES INTO MAIN BUILD PANEL UNLESS UNIQUE CLASSES ARE NEEDED]
// REMEMBER TO ADD ARIA TITLE AND DESCRIPTION ID'S TO BUILD PARTS
//[WORKING ON: MODAL/BUILD TITLE]

/*
  /////////////////////////////////////////////////////////////////////////////
    CONTENTS:
    [025]CUSTOMISATION VARIABALS : You can update these values to adjust lightbox dimensions/behaviour
    --------------------------------
    [035] INITIALISATION : variables and functions regarding initial opening of lightbox
    [037] --CORE/DEFAULT Variables
    --------------------------------
    [122] CONSTRUCTING THE LIGHTBOX
    [125] --CORE LIGHTBOX : The core frame/content container for the lightbox - needed in all modes.
    [162] --MODULAR COMPONENTS : Individual components that are called depending on source data
    --------------------------------
    [262] BEHAVIOUR : Functions the manage the behaviour/interaction of the lightbox
  ///////////////////////////////////////////////////////////////////////////
*/

//Custom controls
var generalWidth = "400px"
var iframeWidth = "90%";
var animation;
var mode = "";
var imageModeAll = true;
var showCaption = true;

/*
/////////////////////////////////////////////////////////////////////////////
    INITIALISATION 
///////////////////////////////////////
    CORE/DEVAULT VARIABLES [CAUTION]
/////////////////////////////////////
*/

// SET controls & Defaults
var width = "400px";
var height = "400px";
var elements = [];
var lastId;

// Starts by finding all lightbox elements in the DOM identified either by class or 
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
        // IF we want keyboard users to access the image - add tabindex 0 to .lightbox elements that are images
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
            beginlightbox(event, this);
        });
        elements[i].addEventListener('blur', function(event){
            saveId(event, this);
        });
    }
}
function isOpen() {
    var el = document.getElementsByClassName('lightbox__overlay');
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

function beginlightbox(e, el) {
    width = generalWidth;
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
/*
/////////////////////////////////////////////////////////////////////////////
    CONSTRUCTING THE LIGHTBOX 
///////////////////////////////////////////////////////////////////////////

    CORE LIGHTBOX
/////////////////////////////////////
*/
//Build lightbox parts, starting with the core/common frame
///Build lightbox Core
function buildLightbox(e, el, w, h) {
    var lightboxElCont = document.createElement('div');
    lightboxElCont.setAttribute("class", "lightbox__overlay");
    /// give role and aria attr
    lightboxElCont.setAttribute("role", "dialogue");
    lightboxElCont.setAttribute("aria-labelledby", "dialogueTitle");
    lightboxElCont.setAttribute("aria-describedby", "dialogueDescription");

    // call function to make correct container box
    if (mode === "modal") {
        var lightboxEl = buildModal(e, el);
    } else if (mode === "image") {
        var lightboxEl = buildImage(e, el);
    } else if (mode === "iframe") {
        var lightboxEl = buildIframe(e, el);
    } else if (mode === "gallery") {
        var lightboxEl = buildSlides(e, el);
    } else {return false}
    
    
    // Add content container to the lightbox
    lightboxElCont.appendChild(lightboxEl);
    lightboxElCont.appendChild(buildCloseBtn());
    // Add Lightbox to page
    if(document.body != null) { 
        document.body.appendChild(lightboxElCont);
    }
    lightboxPos();
}

/*
///////////////////////////////////////
    MODULAR COMPONENTS
/////////////////////////////////////
*/

function buildCaption(e,el) {
    var caption = document.createElement('div');
    caption.setAttribute("class", "lightbox__caption");
    console.log(el);
    var captionContent = document.createElement('p'); //does this need to be tabindex 0?
    var text = el.alt || el.dataset.lightboxTitle; // getting text
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
    closeBtn.innerHTML = "close [x]";
    return closeBtn;
}

function buildTitle(e, el) {
    if (el.dataset.lightboxTitle) {
        var title = document.createElement("h1");
        title.setAttribute("tabindex", "0");
        title.innerHTML = el.dataset.lightboxTitle;
        return title;
    } else return;
}

function buildModal(e, el) {
    //Create content div
    var newContent = document.createElement('div');
    newContent.setAttribute("class", "lightbox__content");
    //select target to clone
    var target = el.dataset.linkHtml;

    //If title exists/is-set build title
    if (el.dataset.lightboxTitle) {
        newContent.appendChild(buildTitle(e, el));
    }
    //clone and build content based on target
    var htmlBlock = document.getElementById(target).cloneNode(true);
    htmlBlock.id= "cloned";
    htmlBlock.classList.remove('hidden');
    newContent.appendChild(htmlBlock);
    return newContent;    
}

function buildImage(e, el) {
    var newContent = document.createElement('div');
    newContent.setAttribute("class", "lightbox__content");
    var image = document.createElement('IMG');
    image.src = el.src || el.dataset.imageLink;
    newContent.appendChild(image);
    newContent.appendChild(buildCaption(e, el));

    return newContent; 
}

function buildIframe(e, el) {

    //[WORKNING ON THIS BIT - height is fucked]
    var newContent = document.createElement('div');
    newContent.classList.add("lightbox__content");
    newContent.classList.add("lightbox__content--iframe");
    var iframe = document.createElement('iframe');
    iframe.src = el.dataset.iframe;
    iframe.setAttribute('frameborder', "0");
    iframe.setAttribute('allowfullscreen', "true");
    iframe.style.position = "absolute";
    iframe.style.width = "calc(100% - 10px)";
    iframe.style.height = "calc(100% - 10px)";
    newContent.appendChild(iframe);
    width = iframeWidth;
    return newContent; 
}

function buildSlides() {
    //If source is in a gallery, build slides for that gallery
    var newContent = document.createElement('div');
    newContent.setAttribute("class", "lightbox__content");
    ///testing
    var testText = document.createElement('p');
    testText.innerHTML = "GALLERY";
    newContent.appendChild(testText);
    ///
    return newContent; 
}

/*
/////////////////////////////////////////////////////////////////////////////
    BEHAVIOUR 
///////////////////////////////////////////////////////////////////////////
*/

// Handle positioning and size of lightbox
function lightboxPos() {
    var box = document.getElementsByClassName('lightbox__content');
    var closeBtn = document.getElementById('close');
    //set width
    box[0].style.maxWidth = width;
    //get total width/heights including paddings etc
    var newHeight = box[0].offsetHeight;
    var newWidth = box[0].offsetWidth;
    // set vertical position so that the frame is centered
    box[0].style.top = "calc(50% - " + newHeight/2 + "px)";
    closeBtn.style.top = "calc(50% - " + newHeight/2 + "px)";
    closeBtn.style.right = "calc(50% - " + newWidth/2 + "px)";
}

function closeLightbox() {
    var el = document.getElementsByClassName('lightbox__overlay');
    el[0].remove();
}