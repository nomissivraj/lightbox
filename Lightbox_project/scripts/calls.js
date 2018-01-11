window.onload = function() {
    initLightbox('slightbox');
}

document.addEventListener("click", function(){
    var slightbox = document.getElementsByClassName('slightbox__overlay');// Get actionable element
    var closeBtn = document.getElementById('close');
    // If slightbox is clicked toggle hide 
    window.onclick = function(event) {
        if (event.target == slightbox[0] || event.target == closeBtn) {
            closeLightbox()
        }
    }   
});

window.addEventListener("resize", function() {
    if (isOpen()) {
        slightboxPos();
    }
});

window.onchange = function() {
    if (isOpen()) {
        slightboxPos();
    }
};