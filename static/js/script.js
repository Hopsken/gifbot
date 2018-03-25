// function submit(evt) {
//     var form = new FormData();
//     var files = document.getElementById("gif").files;
//     form.append('gif', files[0], files[0].name);
//     var req = new XMLHttpRequest();
//     req.open("post", "upload/", true);
//     req.send(form);
//     req.onreadystatechange = function () {
//         if (req.readyState == 4 && req.status == 200) {
//             if (!(req.responseText.startsWith("Error"))) {
//                 document.getElementById("output").setAttribute("src", "downloads/" + req.responseText)
//             }
//         }
//     };
// }
$(function () {
    $("#submit").on("click", function(e){
        $(".bouncing-loader").css("display", "flex");
        $(this).attr("disabled", true).html("Loading...");

        var form = new FormData();
        var file = document.getElementById("gif").files;
        form.append('gif', file[0], file[0].name);
        $.ajax({
            url: "upload/",
            type: "post",
            data: form,
            processData: false,
            contentType: false,
            success: function(data){
                $(".bouncing-loader").css("display", "none");
                if (!data.startsWith("Error")) {
                    $("#output").attr("src", "downloads/"+data);
                    $("#submit").html("Success!");
                } else {
                    $("#output").html("Some error happened. Pleaset try again.");
                    $("#submit").html("Error...").removeAtt("disabled");
                }
            },
            error: function (e) { 
                $(".bouncing-loader").css("display", "none");
                $("#output").html("Some error happened. Pleaset try again.");
                $("#submit").html("Error...").removeAtt("disabled");
             }
        });
    });

    $('#gif').each(function () {
        var $input = $(this),
            $label = $input.next("label"),
            labelVal = $label.html();

        $input.on('change', function (e) {
            var filename = "";
            if (e.target.value) {
                filename = e.target.value.split("\\").pop();
            }
            if (filename && filename.endsWith(".gif")) {
                if (filename) {
                    $label.html(filename);
                } else {
                    $label.html(labelVal);
                }
            } else {
                alert("Only support gif files. Please select gif files.");
                return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(this.files[0]);
            reader.onloadstart = function(){
                $(".bouncing-loader").css("display", "flex");
            };
            reader.onloadend = function () {
                $(".bouncing-loader").css("display", "none");
                $("#output").attr("src", this.result);
            };
        });
    });
});