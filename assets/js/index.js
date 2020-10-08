$(function() {
    getUserinfo();
    var layer = layui.layer;
    $('#sign-out').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token');
            location.href = 'login.html';
            // 关闭 confirm 询问框
            layer.close(index)
        });
    });

});

function getUserinfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            // 渲染头像
            randerAvatar(res.data);
        },
        complete: function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = '/login.html'
            }
        },

    });
};

function randerAvatar(user) {
    if (user.nickname) {
        $('.welcome').html('欢迎' + user.nickname)
    } else {
        $('.welcome').html('欢迎' + user.username)
    }
    if (user.user_pic !== null) {
        $('.text-photo').show();
        $('.layui-nav-img').attr('src', user.user_pic).show();
    } else {
        var first = user.username[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text-photo').html(first).show();
    }
}