$(function () {
    var $loader = $(".bouncing-loader");
    var $output = $("#output");
    var $btn = $("#submit");
    $loader.hide();
    $("#submit").on("click", function(e){
        var form = new FormData();
        var file = document.getElementById("gif").files;
        if (!file[0]){
            return false;
        }
        form.append('gif', file[0], file[0].name);

        $loader.show();
        $btn.attr("disabled", true).html("Reversing...");
        $output.attr("src", null).hide();
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
