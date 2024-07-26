$(document).ready(function() {
    $('#sendbutton').click(function() {
        var formData = new FormData();
        var fileInput = $('#imageinput')[0];
        if (fileInput.files.length === 0) {
            alert('Please select an image file.');
            return;
        }
        var file = fileInput.files[0];
        formData.append('image', file);

        $.ajax({
            url: '/detectObject',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function() {
                $('.loading').show();
                $('.percent').text('0%');
                $('.text').text('Uploading...');
            },
            success: function(response) {
                $('.loading').hide();
                if (response.status) {
                    $('#imagebox').attr('src', 'data:image/jpeg;base64,' + response.status);
                } else {
                    alert('No image returned.');
                }
                if (response.englishmessage) {
                    alert(response.englishmessage);
                }
            },
            error: function(xhr) {
                $('.loading').hide();
                console.error('Error response:', xhr.responseText);
                alert('Error: ' + (xhr.responseJSON ? xhr.responseJSON.error : 'Unknown error'));
            }
        });
    });

    function readUrl(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#imagebox').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    $('#imageinput').change(function() {
        readUrl(this);
    });
});
