window.onload = function() {
    initLightbox('lightbox');
}

document.addEventListener("click", function(){
    var lightbox = document.getElementsByClassName('lightbox__overlay');// Get actionable element
    var closeBtn = document.getElementById('close');
    // If lightbox is clicked toggle hide 
    window.onclick = function(event) {
        if (event.target == lightbox[0] || event.target == closeBtn) {
            closeLightbox()
        }
    }   
});

window.addEventListener("resize", function() {
    if (isOpen()) {
        lightboxPos();
    }
});

window.onchange = function() {
    if (isOpen()) {
        lightboxPos();
    }
};