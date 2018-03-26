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
        var $sub
        $loader.show();
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
                    $btn.html("Loading...");
                    $output.attr("src", "downloads/"+data)
                            .show()
                            .on("load", function(){
                                $loader.hide();
                                $btn.html("Success!");
                                $btn.removeAttr("disabled");
                            });
                } else {
                    $loader.hide();
                    $output.html("Some error happened. Pleaset try again.").show();
                    $btn.html("Error...").removeAttr("disabled");
                }
            },
            error: function (e) { 
                $loader.hide();
                $output.html("Some error happened. Pleaset try again.").show();
                $btn.html("Error...").removeAttr("disabled");
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
                $loader.show();
            };
            reader.onloadend = function () {
                $loader.hide();
                $("#output").attr("src", this.result);
            };
        });
    });
});
