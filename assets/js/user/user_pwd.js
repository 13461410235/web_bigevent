$(function() {
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '请输入6-12位字符'],
        samePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！';
            }
        }
    })
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败');
                };
                layui.layer.msg('修改密码成功,2秒后重新登陆');
                setTimeout(function() {
                    window.parent.location.href = '/login.html';
                }, 2000)
            }
        });
    })
})