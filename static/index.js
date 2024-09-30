$(document).ready(function() {
    $('#sendbutton').click(function() {
        var file_data = $('#imageinput').prop('files')[0];
        if (!file_data) {
            alert("Please upload an image first!");
            return;
        }

        var form_data = new FormData();
        form_data.append('image', file_data);

        $.ajax({
            url: '/detectObject',
            type: 'POST',
            data: form_data,
            contentType: false,
            processData: false,
            beforeSend: function() {
                $('.loading').show();
            },
            success: function(response) {
                $('.loading').hide();
                if (response.status) {
                    $('#imagebox').attr('src', 'data:image/jpeg;base64,' + response.status);
                }
                alert(response.englishmessage);
            },
            error: function(xhr, status, error) {
                $('.loading').hide();
                alert("Error: " + xhr.responseJSON.error);
            }
        });
    });
});
