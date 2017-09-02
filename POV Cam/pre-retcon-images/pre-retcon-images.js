/*
    Some pages have been retro-actively modified by the author
    This utility allows you to switch back and forth between the pre and post retcon images
*/

function createPreRetconImage(postRetconImage) {
    var preRetconImage = document.createElement("img");

    preRetconImage.src = postRetconImage.src.replace("_retcon", "").replace("retcon", "");
    preRetconImage.className = "pre-retcon";

    return preRetconImage;
}

function overlayPreRetconImage(postRetconImage) {
    var doubleImageContainer = document.createElement("div");
    doubleImageContainer.className = "retcon-container";

    postRetconImage.parentElement.insertBefore(doubleImageContainer, postRetconImage);

    doubleImageContainer.appendChild(postRetconImage);
    doubleImageContainer.appendChild(createPreRetconImage(postRetconImage));
}