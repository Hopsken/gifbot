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
    var $loader = $(".bouncing-loader");
    var $output = $("#output");
    var $btn = $("#submit");
    $loader.hide();
    $("#submit").on("click", function(e){
        $loader.show();
        //避免重复点击
        $btn.attr("disabled", true).html("Reversing...");
        $output.attr("src", null).hide();

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
                if (!data.startsWith("Error")) {
                    var $downloadBtn = $("<a></a>");
                    $downloadBtn.attr("href", "downloads/"+data)
                                .attr("class", "btn")
                                .html("Download");

                    $btn.html("Loading...");
                    $output.attr("src", "downloads/"+data)
                            .show()
                            .after($downloadBtn)
                            .on("load", function(){
                                $loader.hide();
                                $btn.html("Success!");
                            });
                } else {
                    $loader.hide();
                    $output.html("Some error happened. Pleaset try again.").show();
                    $btn.html("Error...");
                }
            },
            error: function (e) { 
                $loader.hide();
                $output.html("Some error happened. Pleaset try again.").show();
                $btn.html("Error...");
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

            $btn.removeAttr("disabled"); 

            var reader = new FileReader();
            reader.readAsDataURL(this.files[0]);
            reader.onloadstart = function(){
                $loader.show();
            };
            reader.onloadend = function () {
                $loader.hide();
                $("#output").attr("src", this.result);
            };
        });
    });
});
