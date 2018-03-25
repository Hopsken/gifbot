function submit(evt) {
    var form = new FormData();
    var files = document.getElementById("gif").files;
    form.append('gif', files[0], files[0].name);
    var req = new XMLHttpRequest();
    req.open("post", "upload/", true);
    req.send(form);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            if (!(req.responseText.startsWith("Error"))) {
                document.getElementById("output").setAttribute("src", "downloads/" + req.responseText)
            }
        }
    };
}
$('#gif').each(function(){
    var $input = $(this),
        $label = $input.next("label"),
        labelVal = $label.html();
    
        $input.on('change', function(e){
            var filename = "";
            if(e.target.value){
                filename = e.target.value.split("\\").pop();
            }
            if (filename && filename.endsWith(".gif")){
                if (filename){
                    $label.html(filename);
                } else {
                    $label.html(labelVal);
                }
            } else {
                alert("Only support gif files. Please select gif files.");
                return false;
            }

        });
});