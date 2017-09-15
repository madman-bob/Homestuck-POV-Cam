function initArrowNavigation(nextPageLink) {
    document.onkeydown = function (e) {
        if (e.keyCode == 39) {
            // Press right
            if (nextPageLink) {
                nextPageLink.click();
                return false;
            } else {
                return true;
            }
        } else if (e.keyCode == 37) {
            // Press left
            history.back();
            return false;
        }
        return true;
    };
}