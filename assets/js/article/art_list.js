$(function() {
    var layer = layui.layer;
    var q = {
        pagenum: 1,
        pagesize: 5,
        cate_id: '',
        state: '',
    }
    initTable();
    // 渲染页面数据
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取图书失败');
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total)
            }
        });
    };
    // 定义模板引擎的事件过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        // 时分秒
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    };
    // 时间补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    };
    initCate();
    //  定义函数获取文章类别下拉框
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取图书类别失败');
                }
                console.log(res);
                var htmlStr = template('tpl-cate', res);
                $('#cate_id').html(htmlStr);
                layui.form.render();
            }
        });
    };
    // 定义筛选函数
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });

    layui.use('laypage', function() {
        var laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',
            count: 50 //数据总数，从服务端得到
        });
    });
    // 渲染分页功能
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        layui.laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页展示多少条
            jump: function(obj, first) {
                console.log(obj.curr)
                q.pagesize = obj.limit
                    // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                if (!first) {
                    initTable()
                };
            }
        });
    };
    // 删除功能实现
    $('tbody').on('click', '#data-del', function() {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})