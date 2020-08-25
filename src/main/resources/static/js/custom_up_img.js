$(document).ready(function(){
        $("#up-img-touch").click(function(){
        		  $("#up-modal-frame").modal({});
        });
});
$(function() {
    'use strict';
    // 初始化
    var $image = $('#up-img-show');
    $image.cropper({
        aspectRatio: '1',
        autoCropArea:0.8,
        preview: '.up-pre-after',
        responsive:true,
    });

    // 上传图片
    var $inputImage = $('.up-modal-frame .up-img-file');
    var URL = window.URL || window.webkitURL;
    var blobURL;

    if (URL) {
        $inputImage.change(function () {
        	
            var files = this.files;
            var file;

            if (files && files.length) {
               file = files[0];

               if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {
                        // Revoke when load complete
                       URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    window.alert('请选择一个图片文件.');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }
    
    //绑定上传事件
    $('.up-modal-frame .up-btn-ok').on('click',function(){
    	var $modal_loading = $('#up-modal-loading');
    	var $modal_alert = $('#up-modal-alert');
    	var img_src=$image.attr("src");
    	if(img_src==""){
    		set_alert_info("请选择图片");
    		$modal_alert.modal();
    		return false;
    	}
    	
    	$modal_loading.modal();

    	var url=$(this).attr("href");
        console.log("url:"+url);
    	//parameter
    	var parameter=$(this).attr("parameter");
    	var parame_json = eval('(' + parameter + ')');
    	var width=parame_json.width;
    	var height=parame_json.height;
    	console.log(parame_json.width);
    	console.log(parame_json.height);

    	//控制裁剪图片的大小
    	var canvas=$image.cropper('getCroppedCanvas',{width: width,height: height});
    	var data=canvas.toDataURL(); //转成base64
        var requestData={image:data};
        $.ajax( {  
                url:url,  
                dataType:'json',  
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                success: function(response){
                	$modal_loading.modal('close');
                	if(response.success){
                        set_alert_info(response.msg);
                        $modal_alert.modal();
                        $('#image-msg-btn').click(function () {
                            window.location.reload();
                            $("#up-modal-frame").modal('close');
                        });
                	}else{
                        set_alert_info(response.msg);
                        $modal_alert.modal();
                    }
                },
                error: function(){
                	$modal_loading.modal('close');
                	set_alert_info("上传头像失败了！请重试!");
                	$modal_alert.modal();
                }  
         });  
    	
    });
    
    $('#up-btn-left').on('click',function(){
    	$("#up-img-show").cropper('rotate', 90);
    });
    $('#up-btn-right').on('click',function(){
    	$("#up-img-show").cropper('rotate', -90);
    });
});


function set_alert_info(content){
	$("#alert_content").html(content);
}



 
