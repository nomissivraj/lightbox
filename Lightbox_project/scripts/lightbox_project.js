// Lightbox Revamp
//Pseudo
//Check dom for content to display
//save information relevant to each item
//display content based on data and types

//[WORKING ON: ]
/*TO DO:
Experimenting with alternative way of finding gallery
 - successfully returns if image is in a gallery or not... but need to find ambiguous gallery
and work out how to show images/set indexes as old checkifGallery funciton does
    -READDRESS GALLERY DETERMINATION LOOK AT: https://stackoverflow.com/questions/2234979/how-to-check-in-javascript-if-one-element-is-contained-within-another?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
        IT SHOWS A BETTER WAY TO IDENTIFY IF ANY PARENT IS 'gallery'
        - NEED TO LOOK AT WHERE GALLERY IS GETTING CALLED/SET 
    -SORT GALLERY MODE STYLINGS OUT
    -SET SO THAT AREA OUTSIDE - CLICKABLE - TO CLOSE IS BASED ON MODE,
        SHOULD BE OUTSIDE OF IMAGE on GALLERY, ELSE OUTSIDE OF CONTAINER.
    -NEED TO SET UP IMAGE FOCUS SETTINGS (TAB INDEXING)
    -RETURN FOCUS TO SAVED POSITION IN DOM ON CLOSE
    -LIMIT/TRAP TAB SCOPE: User shouldn't be able to tab out of the modal with the keyboard
    -GALLERY/SLIDESHOW MODE - ADDED, NOW IMPROVE
    -ANIMATIONS
    -REMEMBER TO ADD ARIA TITLE AND DESCRIPTION ID'S TO BUILD PARTS
*/
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
var mode = "";
var currentGroup = "false";
var currentImage;
var elements = [];
var lastId;

/* IE WORKAROUND FOR .remove() */
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
/* END OF IE WORKAROUND */

// Starts by finding all lightbox elements in the DOM identified either by class or 
function hasClass(el,classname) {
    el = el.classList.toString();
    if (el.indexOf(classname) === 0) {
        return true
    } else return false;
}

//el = el.parentNode.classList : el.parentNode.parentNode.classList;

//MOVE ME LATER:
var galleryIndex;
var galleryImages;
//

function checkIfGallery(e, el) {
    //Currently have a good method of spotting that the image clicked is within a gallery.
    //Just need to ambiguate group-2 to group and any number - then need to set the image and gallery index
    ///... halp!
    var gallery = document.getElementsByClassName('gallery');
    var galleryFound;
    for (var i = 0; i < gallery.length; i++) {   
        if (gallery[i].contains(el)){
            galleryFound = true;
        }
    }
    return galleryFound;
    //return (el === gallery) ? false : gallery.contains(el);
}

function checkIfGalleryOLD(e, el) {

    var parentList = el.parentNode.classList;
    var parentsParentList = el.parentNode.parentNode.classList;
    for (var i = 0; i < parentsParentList.length; i++) {
        var current = parentsParentList[i].toString();
        if (current.indexOf("group") !== -1) {
            currentGroup = current;
            var children = el.parentNode.parentNode.children;
            galleryImages = children;
            for (var i = 0; i < children.length; i++) {
                if (el.parentNode === children[i]) {
                    galleryIndex = i;
                }
            }

            return current;
        } else continue;
    }
    for (var i = 0; i < parentList.length; i++) {
        var current = parentsParentList[i].toString();
        if (current.indexOf("group") !== -1) {
            currentGroup = current;
            var children = el.parentNode.children;
            for (var i = 0; i < children.length; i++) {
                if (el.parentNode === children[i]) {
                    galleryIndex = i;
                }
            }
            return current;
        } else return false;
    }
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
    //console.log(id.path[0]);
    if (!id.path[0].id) {
        //alert("Please give link/button an id") keep this after fix
        return;
    }
    lastId = id.path[0];  
}

function beginlightbox(e, el) {
    width = generalWidth;
    var isGallery = checkIfGallery(e, el);
    console.log("it is a gallery? "+isGallery);
    //mode = el.nodeName === "IMG" || el.dataset.iframe ? "image" : false;
    if (el.nodeName === "IMG" || el.dataset.imageLink) {
        mode = "image";
    } if (el.dataset.linkHtml) {
        mode = "modal";
    } if (el.dataset.iframe) {
        mode = "iframe";
    } if (isGallery !== false || undefined) {
        mode = "gallery";
    }
    console.log("current mode: " + mode);
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
    var body = document.getElementsByTagName('body')[0];
    body.classList.toggle('noscroll');

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
    lightboxEl.classList += " lightbox__content--"+mode;
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


function buildSlides(e, el) {
    console.log("currentGroup: " + currentGroup);
    //If source is in a gallery, build slides for that gallery
    var newContent = document.createElement('div');
    newContent.setAttribute("class", "lightbox__content");
    ///testing
    var testText = document.createElement('p');
    testText.innerHTML = "GALLERY";
    
    //NEED TO RESOLVE IMAGE URL BASED ON GALLERYINDEX VAR
    var image = document.createElement('IMG');
    console.log("gindex: " + galleryIndex);
    image.src = galleryImages[galleryIndex].children[0].src;
    console.log(galleryImages[galleryIndex].children[0].src);
    newContent.appendChild(image);

    var previous = document.createElement('a');
    previous.setAttribute('class', 'previous');
    previous.innerHTML = "<";
    previous.addEventListener("click", function(event) {
          previousItem(image);
    });
    
    var next = document.createElement('a');
    next.setAttribute('class', 'next');
    next.innerHTML = ">";
    next.addEventListener("click", function(event) {
        nextItem(image);
    });
    

    newContent.appendChild(testText);
    newContent.appendChild(image);
    newContent.appendChild(previous);
    newContent.appendChild(next);
    newContent.style.minWidth = "initial";
    width = generalWidth;
    currentImage = image;
    ///
    return newContent; 
}

/*
/////////////////////////////////////////////////////////////////////////////
    BEHAVIOUR 
///////////////////////////////////////////////////////////////////////////
*/

//Next function
function nextItem(currentImage) {
    galleryIndex +=1;
    if (galleryIndex == galleryImages.length){
        galleryIndex = 0;
    }
    //update current image with new gallery index
    currentImage.src = galleryImages[galleryIndex].children[0].src;
}
//previous function
function previousItem(currentImage) {
    galleryIndex -=1;
    if (galleryIndex < 0){
        galleryIndex = galleryImages.length-1;
    }
    //update current image with new gallery index
    currentImage.src = galleryImages[galleryIndex].children[0].src;
}

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
    var body = document.getElementsByTagName('body')[0];
    body.classList.toggle('noscroll');
}

/* close on hitting ESC */
document.onkeyup = function(e) {
    // if lightbox is open toggle closed 
    if (!isOpen()) {return}
    e = e || window.event;
    if (e.keyCode == 27) {
        closeLightbox();
    }


    /* Gallery Previous/Next - ARROW KEYS */
    //37 = left 39 = right
    
    if (e.keyCode == 39) {
        console.log("TEST");
        nextItem(currentImage);
    } else if (e.keyCode == 37) {
        console.log("TEST1");
        previousItem(currentImage);
    }
};