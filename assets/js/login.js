$(function() {
    $('#link_reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '请输入6-12位无空格密码'],
        regpwd: function(value) {
            if ($('#repwd').val() !== value) {
                return "两次密码不一样"
            }
        }
    });
    var layer = layui.layer
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        }
        console.log(data);
        $.post("/api/reguser", data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
                // 模拟人的点击行为
            $('#link_login').click()
        });
    });
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功');
                localStorage.setItem('token', res.token);
                location.href = '/index.html'
            }
        });
    })
})