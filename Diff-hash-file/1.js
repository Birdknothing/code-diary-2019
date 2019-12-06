var holder = document.getElementById("holder");
holder.ondragover = function() {
    return false;
};
holder.ondragend = function() {
    return false;
};
holder.ondrop = function(event) {
    event.preventDefault();

    var file = event.dataTransfer.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var binary = event.target.result;
        var md5 = CryptoJS.MD5(binary).toString();
        console.log(md5);
    };

    reader.readAsBinaryString(file);
};


