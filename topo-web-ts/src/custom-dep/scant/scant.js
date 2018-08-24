/**
 * Created by Wuxz on 2017/9/13.
 */
(function($){
    "use strict";

    /**
     * ScTab 对象
     * @param opts
     * @constructor
     */
    var ScAlert = function( opts){

        var opts = typeof opts ==="object" ? opts : {};
        this.options = $.extend({}, ScAlert.SETTINGS, opts);

        //初始化
        this.init();
    };

    /**
     * 默认配置
     * */
    ScAlert.SETTINGS = {
        /**
         * 主题内容
         */
        title:'标题内容',
        /**
         * 主题内容
         */
        content:'主题内容文字描述',
        /**
         * 按钮一
         */
        btn1:'按钮一',
        /**
         * 按钮二
         */
        btn2:'按钮二',

        /**
         * 支持两种类型 （type）：op （操作反馈 默认）、msg（消息提示）
         */
        type: 'op',
        /**
         * 支持两种级别（level）: info（一般，默认）、warn(告警)
         */
        level:'info',
        /**
         * 支持9个方向（t(默认)、r、b、l、c、lt、lb、rt、rb）
         */
        direction:'l',

        /**
         * 默认自动消失时间  设为0的话 为一直存在
         */
        times: 2000,
        /**
         * 按钮一的回调函数
         */
        btn1Click: null,
        /**
         * 按钮二的回调函数
         */
        btn2Click: null,
        /**
         * 弹窗的z-index
         */
        zIndex: 999
    };

    /**
     * 提供方法
     * */
    ScAlert.prototype = {

        /**
         *初始化
         * */
        init: function(){
            var _this = this;
            var opt = _this.options;
            var elementId = 'ScAlert' + opt.zIndex;

            var alertHtml = '';

            if(opt.type == 'op' && opt.level == 'info'){
                alertHtml = '<div class="sc-alert" id="' + elementId + '">'
                +'<span class="alert-icon">'
                +'<i></i>'
                +'</span>'
                +'<div class="sc-tips">'+opt.title +'</div>'
                +'</div>';
            }
            if(opt.type == 'op' && opt.level == 'warn'){
                alertHtml = '<div class="sc-alert warn" id="' + elementId + '">'
                    +'<span class="alert-icon">'
                    +'<i></i>'
                    +'</span>'
                    +'<div class="sc-tips">'
                    +'<h3>'+opt.title +'</h3>'
                    +'<span>原因：'+opt.content+'</span>'
                    +'</div>'
                    +'<div class="btn-box">'
                    +' <button class="sc-btn btn-close">'+opt.btn1+'</button>'
                    +' </div>'
                    +'</div>';
            }
            if(opt.type == 'msg' && opt.level == 'info'){
                alertHtml = '<div class="sc-alert msg" id="' + elementId + '">'
                +'<span class="alert-icon">'
                +'<i></i>'
                +'</span>'
                +'<div class="sc-tips">'
                +'<h3>'+opt.title +'</h3>'
                +'<span>'+opt.content+'</span>'
                +'</div>'
                +'<div class="btn-box">'
                +' <button class="sc-btn btn-1">'+opt.btn1+'</button>'
                +' <button class="sc-btn btn-2">'+opt.btn2+'</button>'
                +' </div>'
                +'</div>';
            }
            if(opt.type == 'msg' && opt.level == 'warn'){
                alertHtml = '<div class="sc-alert msg warn" id="' + elementId + '">'
                +'<span class="alert-icon">'
                +'<i></i>'
                +'</span>'
                +'<div class="sc-tips">'
                +'<h3>'+ opt.title +'</h3>'
                +'<span>'+opt.content+'</span>'
                +'</div>'
                +'<div class="btn-box">'
                +' <button class="sc-btn btn-1">'+opt.btn1+'</button>'
                +' <button class="sc-btn btn-2">'+opt.btn2+'</button>'
                +' </div>'
                +'</div>';
            }

            $('body').append(alertHtml);

            var $element = $('#' + elementId);
            //关闭按钮点击事件
            $element.find('.btn-close').on('click', function(){
                _this.close();
            });
            //按钮点击通知事件
            $element.find('.btn-1').on('click', function(e){
                if( opt.btn1Click instanceof Function){
                    opt.btn1Click.apply(_this,[e]);
                }
            });
            $element.find('.btn-2').on('click', function(e){
                if( opt.btn2Click instanceof Function){
                    opt.btn2Click.apply(_this,[e]);
                }
            });

            /**
             * 设置弹窗的位置 l，t, r, b, c, lt, rt, lb, rb
             *
             */
            var left;
            var top;
            left = ( $(window).width()  - $element.outerWidth() ) / 2 ;
            top = ( $(window).height()  - $element.outerHeight()) / 2 ;

            if( opt.direction == 'l'){
                left = '10px';
            }
            if( opt.direction == 'lt'){

                left = '10px';
                top = '10px';
            }else if( opt.direction == 'rt'){

                left = $(window).width() - $element.outerWidth() - 10;
                top= '10px';
            }else if( opt.direction == 't'){

                top = '10px';
            }else if( opt.direction == 'r'){

                left = $(window).width() - $element.outerWidth() - 10;
            }else if( opt.direction == 'b'){

                top = $(window).height() - $element.outerHeight() - 10;

            }else if( opt.direction == 'c'){

            }else if( opt.direction == 'lb'){

                left = '10px';
                top = $(window).height() - $element.outerHeight() - 10;

            }else if( opt.direction == 'rb'){

                left = $(window).width() - $element.outerWidth() -  10;
                top = $(window).height() - $element.outerHeight() - 10;
            }

            $element.css({left:left,top:top});
            $element.addClass('sc-anim sc-anim-fadein');

            if(opt.times > 0){
                setTimeout(function(){
                    _this.close();
                },opt.times)
            }

        },
        close: function(){
            var opt = this.options;
            var elementId = 'ScAlert' + (opt.zIndex);
            var $element = $('#' + elementId);
            $element.addClass('sc-anim-fadeout');
            setTimeout(function(){
                $element.remove();
            }, 600);
        }
    };

    /**
     * 显示信息函数
     * @param options  配置
     * @returns {ScAlert}
     */
    var alertFunc = function(options){
        if (!options) {
            options = $.extend({}, ScAlert.SETTINGS);
        }
        if (!options.zIndex || options.zIndex == 9999) {
            options.zIndex = ScAlert.SETTINGS.zIndex + 1;
            ScAlert.SETTINGS.zIndex = options.zIndex;
        }

        return new ScAlert(options);
    };

    //对外提供函数
    $(document).ready(function(){
        window.scant = window.scant || {};
        window.scant.alert = alertFunc;
    });

})(window.jQuery);
/**
 * Checkbox插件，在原生input-checkbox基础上进行美化。
 *
 * Created by LuLihong on 2017/8/21.
 */
(function ($, undefined) {
    "use strict";

    /**
     * 插件缓存KEY
     * @type {string}
     */
    var PLUGIN_CACHE_KEY = "sc.check";

    /**
     * ScCheck对象
     * @param element
     * @param opts
     * @constructor
     */
    var ScCheck = function(element, opts) {
        this.$element = $(element);

        var opts = typeof opts === "object" ? opts : {};
        this.options = $.extend({}, ScCheck.SETTINGS, opts);;
        //初始化
        this.init();
    };

    /**
     * 默认配置
     */
    ScCheck.SETTINGS = {
        checkLayer:  {
            position: 'absolute',
            opacity: 0,
            cursor: 'pointer',
            width: '20px',
            height: '20px',
            left: 0
        },
        checkType: 'basic-check' //默认是基础样式 btn-check 按钮样式  capsule-check 胶囊样式
    };

    /**
     * 提供方法。
     */
    ScCheck.prototype = {
        /**
         * 初始化
         */
        init: function() {
            var $el = this.$element;
            var opt = this.options;

            var classStr = 'sc-check';
            if ($el.attr('checked') != undefined) {
                classStr += ' checked';
            }
            if ($el.attr('disabled') != undefined) {
                classStr += ' disabled';
            }
            var checkText = (opt.checkType == '' || opt.checkType == 'basic-check') ?  ''  : $el.attr('data-value');
            var parent = '<div class="' + classStr + ' ' +opt.checkType + '" >'+checkText+'</>';


            $el.css(opt.checkLayer);
            $el.wrap(parent);
            var $parent = $el.parent();

            //如果按钮的类型是 按钮式
            if(opt.checkType === 'btn-check'){

                var btnIcon = '<i class="icon-check"><i/>';
                $parent.append(btnIcon);
            }

            $parent.on('click', function(e) {
                if ($parent.hasClass('disabled')) {
                    return;
                }

                if ($parent.hasClass('checked')) {
                    $parent.removeClass('checked');
                    $el.removeAttr('checked');
                } else {
                    $parent.addClass('checked');
                    $el.attr('checked', 'checked');
                }
                stopEvent (e)
            });
        },

        /**
         * 设置组件选中状态
         * @param isChecked 选中状态，ture: 选中, false:不选中，默认true
         */
        check:  function(isChecked) {
            var $el = this.$element;
            var $parent = $el.parent();

            //默认为选中：true
            isChecked = isChecked == undefined || isChecked;

            if (!$parent) {
                console.error('call ScCheck.check error: Plz init first.');
                return;
            }

            //判断是不是不可用
            if ( !($parent.hasClass('disabled'))) {
                if ($parent.hasClass('checked')) {
                    if (!isChecked) {
                        $parent.removeClass('checked');
                        $el.removeAttr('checked');
                    }
                } else {
                    if (isChecked) {
                        $parent.addClass('checked');
                        $el.attr('checked', 'checked');
                    }
                }
            }else{
                return;
            }
        },

        /**
         * 设置组件启用状态
         * @param isEnabled 启用状态。true:启用；false:禁用
         */
        enable:  function(isEnabled) {
            var $el = this.$element;
            var $parent = $el.parent();

            //默认为启用：true
            isEnabled = isEnabled == undefined || isEnabled;

            if (!$parent) {
                console.error('call ScCheck.enable error: Plz init first.');
                return;
            }

            if ($parent.hasClass('disabled')) {
                if (isEnabled) {
                    $parent.removeClass('disabled');
                    $el.removeAttr('disabled');
                }
            } else {
                if (!isEnabled) {
                    $parent.addClass('disabled');
                    $el.attr('disabled', 'disabled');
                }
            }
        },

        /**
         * 刷新组件，有时候界面代码直接修改checkbox的选中、启用等状态，
         *  但是组件不会改变外观，这里需要调用该方法刷新组件的外观
         */
        refresh: function() {
            var $el = this.$element;
            var $parent = $el.parent();

            //刷新组件选中状态
            if ($el.attr('checked') != undefined ) {
                if (!$parent.hasClass('checked')) {
                    $parent.addClass('checked');
                }
            } else {
                if ($parent.hasClass('checked')) {
                    $parent.removeClass('checked');
                }
            }

            //刷新禁用状态
            if ($el.attr('disabled') != undefined) {
                if (!$parent.hasClass('disabled')) {
                    $parent.addClass('disabled');
                }
            } else {
                if ($parent.hasClass('disabled')) {
                    $parent.removeClass('disabled');
                }
            }
        }
    };

    //阻止事件冒泡
    function stopEvent (e) {
        //取消事件冒泡
        // var e =  event || arguments.callee.caller.arguments[0];
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
    }

    /**
     * 插件方法
     * @param options  初始化配置
     * @returns {*}
     */
    $.fn.scCheck = function(options) {
        //入参，移除了第一个参数
        var inArguments = Array.prototype.slice.call(arguments, 1);

        return this.each(function(){
            var $this = $(this);
            var plugin = $this.data(PLUGIN_CACHE_KEY);
            if (!plugin) {
                plugin = new ScCheck(this, options);
                // 缓存插件
                $this.data(PLUGIN_CACHE_KEY, plugin);
            }
            // 调用方法
            if (typeof options === "string" && typeof plugin[options] == "function") {
                // 执行插件的方法
                plugin[options].apply(plugin, inArguments);
            }
        });
    };

    /**
     * 暴露类名, 可以通过这个为插件做自定义扩展
     * @type {Object|Function}
     */
    $.fn.scCheck.Constructor = ScCheck.prototype;

})(window.jQuery);

/**
 * Created by chenlin on 2017/8/31.
 */

(function ($) {
    "use strict";

    /**
     * 插件缓存KEY
     * @type {string}
     */
    var PLUGIN_CACHE_KEY = "sc.menu";

    /**
     * ScMenu对象
     * @param element
     * @param opts
     * @constructor
     */
    var ScMenu = function(element, opts) {
        this.$element = $(element);

        var opts = typeof opts === "object" ? opts : {};
        this.options = $.extend({}, ScMenu.SETTINGS, opts);
        //初始化
        this.init();
    };

    /**
     * 默认配置
     */
    ScMenu.SETTINGS = {
        /**
         * 已废弃方法，建议使用onMenuClicked
         * @param e
         */
        onSelect: function(e){
            console.log(e);
        },

        /**
         * 触发菜单点击事件
         * @param menuEle   菜单jquery捕获对象
         * @param menuId    菜单ID
         */
        onMenuClicked: function(menuEle, menuId) {
            window.console.log('menu clicked: menuId=' + menuId);
        },

        /**
         * 组件附加CSS，如果调用者需要修改组件样式，可以通过此属性来修改。
         */
        componentCSS: {}

    };

    /**
     * 私有方法 菜单点击事件
     */
    var _private = {

        /*列表点击事件公共变化*/
        itemClickSty : function($el,$icon,$_this){

            var $firstItem = $el.children('li');

            $el.find(".selected").removeClass("selected");
            $_this.addClass("selected");

            /*选中列表 图标变化*/
            $firstItem.children("i").each(function(){
                $(this).removeClass($(this).attr("selClass"));
            });

            var iconClass = $icon.attr("selClass");
            $icon.addClass(iconClass);
        },

        /*一级菜单 点击事件*/
        fistItemClick : function($el,options){
            var _this = this;

            $(".sc-menu-item").on("click", function(e){
                var $_this = $(this);
                var $icon = $(this).children("i");
                _this.itemClickSty($el,$icon,$_this);

                if(options.onSelect instanceof Function){
                    options.onSelect.apply(self,[e]);
                }

                options.onMenuClicked( $(this),  $(this).attr('id'));
            });
        },

        /*二级菜单 父级展开与收起*/
        secondMenuClick : function() {
            $(".sc-first-item").children('a').on("click", function(){
                $(this).parent().toggleClass("sc-menu-open");

                /*展开二级菜单*/
                $(this).next("ul").slideToggle();
            });
        },

        /*二级菜单 子级列表点击事件*/
        secondItemClick : function($el,options){
            var _this = this;
            $(".sc-second-item").on("click", function(e){
                var $_this = $(this);
                var $icon = $(this).parents(".sc-first-item").children("i");
                _this.itemClickSty($el,$icon,$_this);

                if(options.onSelect instanceof Function){
                    options.onSelect.apply(self,[e]);
                }
                options.onMenuClicked( $(this), $(this).attr('id'));
                /*阻止冒泡*/
                e.stopPropagation();
            });
        },

    };
    /**
     * 提供方法。
     */
    ScMenu.prototype = {
        /**
         * 初始化
         */
        init : function() {

            var $el = this.$element;
            $el.addClass('sc-menu');

            var $firstItem = $el.children('li');
            var options = this.options;
            //增加调用者加入的样式
            $el.css(options.componentCSS);

            /*不带图标样式*/
            if(!$firstItem.children("i").length>0){
                $firstItem.addClass("no-icon");
            }

            /*判断菜单有无子级 定义菜单不同className*/
            $firstItem.each(function(){
                var $item = $(this);

                /*二级菜单 父级样式sc-first-item,子级样式sc-second-item*/
                if($item.children("ul").length > 0){
                    var $secondItem = $item.children('ul').children('li');
                    $item.addClass('sc-first-item');
                    $secondItem.addClass('sc-second-item');
                }
                /*一级菜单 样式sc-menu-item*/
                else{
                    $item.addClass("sc-menu-item");
                }
            });

            _private.fistItemClick($el,options);
            _private.secondItemClick($el,options);
            _private.secondMenuClick();

            /*默认选择菜单第一项*/
            $firstItem.eq(0).children("a").click();
            $(".sc-second-item").eq(0).click();
        },

        /**
         * 设置默认选择菜单
         */
        select : function(id){
            var $item = $("#"+id);
            if (!$item.length>0) {
                console.error('call ScMenu.select error: id = '+id+" element not have!Please check");
                return ;
            }
            if ($item.hasClass('sc-second-item')) {
                var $parent = $item.parents(".sc-first-item");

                if(!$parent.hasClass("sc-menu-open")) {
                    $parent.children("a").click();
                }
            }
            $item.click();
        },

        /**
         * 获取当前选中菜单
         */
        getSelectNode : function(){
            var $element = this.$element;
            var selectNode = $element.find(".selected");
            return selectNode.length > 0 ? selectNode.get(0) : null;
        },

        refresh: function() {
            //TODO 增加刷新机制
        }
    };

    /**
     * 插件方法
     * @param options  初始化配置
     * @returns {*}
     */
    $.fn.scMenu = function(options) {
        //入参，移除了第一个参数
        var inArguments = Array.prototype.slice.call(arguments, 1);
        var rdata = null;
        this.each(function(){
            var $this = $(this);
            var plugin = $this.data(PLUGIN_CACHE_KEY);
            if (!plugin) {
                plugin = new ScMenu(this, options);
                // 缓存插件
                $this.data(PLUGIN_CACHE_KEY, plugin);
            }
            // 调用方法
            if (typeof options === "string" && typeof plugin[options] == "function") {
                // 执行插件的方法
                rdata = plugin[options].apply(plugin, inArguments);
            }
        });
        return rdata;
    };

    /**
     * 暴露类名, 可以通过这个为插件做自定义扩展
     * @type {Object|Function}
     */
    $.fn.scMenu.Constructor = ScMenu.prototype;

})(window.jQuery);

/**
 * 信息框，调用方法：scant.msg(info)，类似layer.msg。
 * Created by LuLihong on 2017/9/12.
 */
(function ($, undefined) {
    "use strict";

    var ScMsg = function(content, opts) {
        opts = typeof opts === "object" ? opts : {};
        this.options = $.extend({}, ScMsg.SETTINGS, opts);
        this.content = content;
        this.init();
    };

    /**
     * 默认配置
     */
    ScMsg.SETTINGS = {
        /**
         * 显示时间，单位：毫秒，如果为0，则一直显示。
         */
        time: 3000,
        /**
         * 是否使用动画
         */
        isAnim: true,
        /**
         * 方位：t-头部、r-右边、b-底部、l-坐标、c-垂直居中(默认)、lt-左上、lb-坐下、rt-右上、rb-右下；
         */
        direction:'c',
        /**
         * 消息框的z-index
         */
        zIndex: 20160212,
        /**
         * 结束或关闭时的回调函数
         * @param $msgElement 显示的信息jQuery捕获对象
         */
        end: function($msgElement){
        }
    };

    ScMsg.prototype = {
        /**
         * 初始化
         */
        init: function() {
            var that = this;
            var opt = that.options;
            var elementId = 'ScMsg' + opt.zIndex;

            //构造原始HTML代码，添加到对象内部
            var pageHtml = '<div class="sc-msg" id="' + elementId + '" >'
                + '<div class="sc-msg-content">' + this.content + '</div>';
                + '</div>';
            $('body').append(pageHtml);

            var $element = $('#' + elementId);
            that.$element = $element;
            $element.css("z-index", opt.zIndex);

            var eleWidth = $element.outerWidth();
            var eleHeight = $element.outerHeight();

            var offsetLeft = ($(window).width() - eleWidth)/2;
            var offsetTop = ($(window).height() - eleHeight)/2;

            var marginRightInt = parseInt($element.css('margin-right'));
            var marginBottomInt = parseInt($element.css('margin-bottom'));
            switch (opt.direction) {
                case 'c':
                    break;
                case 't':
                    offsetTop = 0;
                    break;
                case 'r':
                    offsetLeft = $(window).width() - eleWidth - marginRightInt * 2;
                    break;
                case 'b':
                    offsetTop = $(window).height() - eleHeight - marginBottomInt * 2;
                    break;
                case 'l':
                    offsetLeft = 0;
                    break;
                case 'lt':
                    offsetLeft = 0;
                    offsetTop = 0;
                    break;
                case 'lb':
                    offsetLeft = 0;
                    offsetTop = $(window).height() - eleHeight - marginBottomInt * 2;
                    break;
                case 'rt':
                    offsetLeft = $(window).width() - eleWidth - marginRightInt * 2;
                    offsetTop = 0;
                    break;
                case 'rb':
                    offsetLeft = $(window).width() - eleWidth - marginRightInt * 2;
                    offsetTop = $(window).height() - eleHeight - marginBottomInt * 2;
                    break;
                default : {}
            }
            $element.css({top: offsetTop, left: offsetLeft});
            $element.addClass('sc-anim sc-anim-fadein');

            opt.time <= 0 || setTimeout(function(){
                that.close();
            }, opt.time);
        },

        close: function(){
            var that = this;
            var opt = that.options;
            that.$element.addClass('sc-anim-fadeout');
            setTimeout(function(){
                opt.end( that.$element);
                that.$element.remove();
            }, 300);
        }
    };


    /**
     * 显示信息函数
     * @param content   内容
     * @param options   配置
     * @returns {ScMsg}
     */
    var msgFunc = function(content, options){
        if (!options) {
            options = $.extend({}, ScMsg.SETTINGS);
        }
        if (!options.zIndex || options.zIndex == 20160212) {
            options.zIndex = ScMsg.SETTINGS.zIndex + 1;
            ScMsg.SETTINGS.zIndex = options.zIndex;
        }

        return new ScMsg(content, options);
    };

    //对外提供函数
    $(document).ready(function(){
        window.scant = window.scant || {};
        window.scant.msg = msgFunc;
    });

})(jQuery);



/**
 * Created by chenlin on 2017/8/24.
 */

(function ($) {
    "use strict";

    /**
     * 插件缓存KEY
     * @type {string}
     */
    var PLUGIN_CACHE_KEY = "sc.nav";

    /**
     * ScNav对象
     * @param element
     * @param opts
     * @constructor
     */
    var ScNav = function(element, opts) {
        this.$element = $(element);

        var opts = typeof opts === "object" ? opts : {};
        this.options = $.extend({}, ScNav.SETTINGS, opts);
        //初始化
        this.init();
    };

    /**
     * 默认配置
     */
    ScNav.SETTINGS = {
        onSelect:null
    };

    /**
     * 提供方法。
     */
    ScNav.prototype = {
        /**
         * 初始化
         */
        init: function() {
            var self = this;
            var options = this.options;
            var $el = this.$element;
            $el.addClass('sc-nav');
            $el.children('li').addClass('sc-nav-item');

            var $List = $el.children('li');

            //菜单列表点击事件
            $List.on('click',function(e){

                $List.removeClass("selected");
                $(this).addClass("selected");

                //图标切换
                $List.children("i").each(function(){
                    var iconClass = $(this).attr("selClass");
                    $(this).removeClass(iconClass);
                });

                var iconClass = $(this).children("i").attr("selClass");
                $(this).children("i").addClass(iconClass);

                if(options.onSelect instanceof Function){
                    options.onSelect.apply(self,[e]);
                }

                e.stopPropagation();
            });

            //默认选中第一个
            $List.eq(0).click();
         /*   if(options.select){
                $("#"+options.select).click();
            }else{
                $List.get(0).click();
            }*/
        },

        /**
         * 设置默认选择菜单
         */
        select:function(id){
            var $item = $("#"+id);
            if (!$item.length>0) {
                console.error('call ScNav.select error: id = '+id+" element not have!Please check");
                return;
            }
            $item.click();
        },

        /**
         * 获取当前选中菜单
         */
        getSelectNode:function(){
            var $element = this.$element;
            var selectNode = $element.find(".selected");
            return selectNode.length > 0 ? selectNode.get(0) : null;
        }
    };

    /**
     * 插件方法
     * @param options  初始化配置
     * @returns {*}
     */
    $.fn.scNav = function(options) {
        //入参，移除了第一个参数
        var inArguments = Array.prototype.slice.call(arguments, 1);
        var rdata = null;
        this.each(function(){
            var $this = $(this);
            var plugin = $this.data(PLUGIN_CACHE_KEY);
            if (!plugin) {
                plugin = new ScNav(this, options);
                // 缓存插件
                $this.data(PLUGIN_CACHE_KEY, plugin);
            }
            // 调用方法
            if (typeof options === "string" && typeof plugin[options] == "function") {
                // 执行插件的方法
                rdata = plugin[options].apply(plugin, inArguments);
            }
        });
        return rdata;
    };

    /**
     * 暴露类名, 可以通过这个为插件做自定义扩展
     * @type {Object|Function}
     */
    $.fn.scNav.Constructor = ScNav.prototype;

})(window.jQuery);

/**
 * 迷你分页插件，支持三种风格。
 * Created by LuLihong on 2017/9/6.
 */
(function ($, undefined) {
    "use strict";

    /**
     * 插件缓存KEY
     * @type {string}
     */
    var PLUGIN_CACHE_KEY = "sc.page.tiny";

    /**
     * ScCheck对象
     * @param element
     * @param opts
     * @constructor
     */
    var ScPageTiny = function(element, opts) {
        this.$element = $(element);

        opts = typeof opts === "object" ? opts : {};
        this.options = $.extend({}, ScPageTiny.SETTINGS, opts);
        //初始化
        this.init();
    };

    /**
     * 默认配置
     */
    ScPageTiny.SETTINGS = {
        /**
         * 页码
         */
        pageIndex: 1,
        /**
         * 总记录数
         */
        recordTotal: 0,
        /**
         * 分页大小
         */
        pageSize: 10,
        /**
         * 总页数
         */
        pageTotal: 0,
        /**
         * 是否有上一页
         */
        hasPrev: false,
        /**
         * 是否有下一页
         */
        hasNext: false,
        /**
         * 边框风格：空-无边框（默认）；square-方形；circle-圆形
         */
        borderStyle: '',

        /**
         * 分页选择回调函数
         * @param pageIndex 页码
         * @param pageSize  分页大小
         */
        onPageSelected: function(pageIndex, pageSize){
            window.console.log('Page selected: pageIndex=' + pageIndex + ', pageSize=' + pageSize);
        }
    };

    /**
     * 内部方法，对外不公开
     * @type {{calConfig: Function}}
     */
    var innerMethods = {
        /**
         * 计算配置参数
         * @param options   配置参数
         */
        calConfig: function(options){
            //检测值的越界
            if (options.pageSize == 0) {
                options.pageSize = 10;
            }
            if (options.recordTotal < 0) {
                options.recordTotal = 0;
            }
            if (options.pageIndex < 0) {
                options.pageIndex = 0;
            }

            //计算页数
            options.pageTotal = parseInt((options.recordTotal - 1) / options.pageSize) + 1;
            if (options.pageIndex > options.pageTotal) {
                options.pageIndex = options.pageTotal;
            }
            options.hasPrev = options.pageIndex > 1;
            options.hasNext = options.pageIndex < options.pageTotal;
        },

        /**
         * 处理点击分页按钮点击事件
         * @param options   配置参数
         * @param obj      点击对象
         */
        onPageClick: function(options, obj) {
            var toPageIndex = 0;
            if ($(obj).hasClass('prev')) {
                if (options.hasPrev) {
                    toPageIndex = options.pageIndex - 1;
                } else {
                    return;
                }
            } else if ($(obj).hasClass('next')) {
                if (options.hasNext) {
                    toPageIndex = options.pageIndex + 1;
                } else {
                    return;
                }
            } else if ($(obj).hasClass('num')) {
                var pageNumber = parseInt($(obj).text());
                if (pageNumber == options.pageIndex) {
                    return;
                } else {
                    toPageIndex = pageNumber;
                }
            }
            this.toPage(options, toPageIndex);
        },

        /**
         * 跳转，调用回调函数
         * @param options
         * @param toPageIndex
         */
        toPage: function(options, toPageIndex) {
            if (options.pageIndex != toPageIndex) {
                options.pageIndex = toPageIndex;

                if (toPageIndex > 0 && toPageIndex <= options.pageTotal ) {
                    options.onPageSelected(toPageIndex, options.pageSize);
                }
            }
        },

        /**
         * 是否为数字
         * @param s
         * @returns {boolean}
         */
        isNumber: function(s) {
            var model = /^\d+$/;
            return model.test(s);
        }
    };

    /**
     * 提供方法。
     */
    ScPageTiny.prototype = {
        /**
         * 初始化
         */
        init: function() {
            var $this = this;
            var $el = this.$element;

            //构造原始HTML代码，添加到对象内部
            var pageHtml = '<div class="sc-page-tiny">'
                + '<ul class="items">'
                + '<li class="prev" title="上一页"></li>'
                + '<li class="num index" title="当前页"></li>'
                + '<li class="slash">/</li>'
                + '<li class="num" title="总页数"></li>'
                + '<li class="next" title="下一页"></li>'
                + '</ul>'
                + '</div>';
            $el.append(pageHtml);

            var opt = this.options;
            //上一页绑定点击事件
            $el.find('.prev').on('click', function(){
                innerMethods.onPageClick(opt, this);
                $this.refresh();
            });
            //下一页绑定点击事件
            $el.find('.next').on('click', function(){
                innerMethods.onPageClick(opt, this);
                $this.refresh();
            });

            //square-方形；circle-圆形
            if (opt.borderStyle == 'square' || opt.borderStyle == 'circle') {
                $el.find('.prev').addClass(opt.borderStyle);
                $el.find('.next').addClass(opt.borderStyle);
            }

            this.refresh();
        },

        /**
         * 设置记录总数和页码
         * @param recordTotal   记录总数
         * @param pageIndex     页码（可以不传参）
         */
        setRecordTotal:function(recordTotal, pageIndex) {
            if (recordTotal == undefined) {
                return;
            }
            var opt = this.options;

            opt.recordTotal = recordTotal;
            if (pageIndex != undefined) {
                opt.pageIndex = pageIndex;
            }

            this.refresh();
        },

        /**
         * 刷新界面: 计算参数，修改数字按钮值
         */
        refresh: function() {
            var $el = this.$element;
            var opt = this.options;

            //计算参数
            innerMethods.calConfig(opt);

            //上一页
            if (opt.hasPrev) {
                $el.find('.prev').removeClass('disabled');
            } else {
                $el.find('.prev').addClass('disabled');
            }

            //下一页
            if (opt.hasNext) {
                $el.find('.next').removeClass('disabled');
            } else {
                $el.find('.next').addClass('disabled');
            }

            //总记录数
            $el.find('.num').eq(0).text(opt.pageIndex);
            //总页数
            $el.find('.num').eq(1).text(opt.pageTotal);
        }

    };

    /**
     * 插件方法
     * @param options  初始化配置
     * @returns {*}
     */
    $.fn.scPageTiny = function(options) {
        //入参，移除了第一个参数
        var inArguments = Array.prototype.slice.call(arguments, 1);

        return this.each(function(){
            var $this = $(this);
            var plugin = $this.data(PLUGIN_CACHE_KEY);
            if (!plugin) {
                plugin = new ScPageTiny(this, options);
                // 缓存插件
                $this.data(PLUGIN_CACHE_KEY, plugin);
            }
            // 调用方法
            if (typeof options === "string" && typeof plugin[options] == "function") {
                // 执行插件的方法
                plugin[options].apply(plugin, inArguments);
            }
        });
    };

    /**
     * 暴露类名, 可以通过这个为插件做自定义扩展
     * @type {Object|Function}
     */
    $.fn.scPageTiny.Constructor = ScPageTiny.prototype;

})(window.jQuery);

/**
 * 分页插件
 * Created by LuLihong on 2017/9/6.
 */
(function ($, undefined) {
    "use strict";

    /**
     * 插件缓存KEY
     * @type {string}
     */
    var PLUGIN_CACHE_KEY = "sc.page";

    /**
     * ScCheck对象
     * @param element
     * @param opts
     * @constructor
     */
    var ScPage = function(element, opts) {
        this.$element = $(element);

        var opts = typeof opts === "object" ? opts : {};
        this.options = $.extend({}, ScPage.SETTINGS, opts);
        //初始化
        this.init();
    };

    /**
     * 默认配置
     */
    ScPage.SETTINGS = {
        /**
         * 页码
         */
        pageIndex: 1,
        /**
         * 总记录数
         */
        recordTotal: 0,
        /**
         * 分页大小
         */
        pageSize: 10,
        /**
         * 总页数
         */
        pageTotal: 0,
        /**
         * 是否有上一页
         */
        hasPrev: false,
        /**
         * 是否有下一页
         */
        hasNext: false,
        /**
         * 是否显示总记录数
         */
        showRecordTotal:true,
        /**
         * 是否显示总页数
         */
        showPageTotal:true,
        /**
         * 是否显示跳转
         */
        showJump:true,
        /**
         * 分页选择回调函数
         * @param pageIndex 页码
         * @param pageSize  分页大小
         */
        onPageSelected: function(pageIndex, pageSize){
            window.console.log('Page selected: pageIndex=' + pageIndex + ', pageSize=' + pageSize);
        }
    };

    /**
     * 内部方法，对外不公开
     * @type {{calConfig: Function}}
     */
    var innerMethods = {
        /**
         * 计算配置参数
         * @param options   配置参数
         */
        calConfig: function(options){
            //检测值的越界
            if (options.pageSize == 0) {
                options.pageSize = 10;
            }
            if (options.recordTotal < 0) {
                options.recordTotal = 0;
            }
            if (options.pageIndex < 0) {
                options.pageIndex = 0;
            }

            //计算页数
            options.pageTotal = parseInt((options.recordTotal - 1) / options.pageSize) + 1;
            if (options.pageIndex > options.pageTotal) {
                options.pageIndex = options.pageTotal;
            }
            options.hasPrev = options.pageIndex > 1;
            options.hasNext = options.pageIndex < options.pageTotal;
        },

        /**
         * 处理点击分页按钮点击事件
         * @param options   配置参数
         * @param obj      点击对象
         */
        onPageClick: function(options, obj) {
            var toPageIndex = 0;
            if ($(obj).hasClass('prev')) {
                if (options.hasPrev) {
                    toPageIndex = options.pageIndex - 1;
                } else {
                    return;
                }
            } else if ($(obj).hasClass('next')) {
                if (options.hasNext) {
                    toPageIndex = options.pageIndex + 1;
                } else {
                    return;
                }
            } else if ($(obj).hasClass('num')) {
                var pageNumber = parseInt($(obj).text());
                if (pageNumber == options.pageIndex) {
                    return;
                } else {
                    toPageIndex = pageNumber;
                }
            }
            this.toPage(options, toPageIndex);
        },

        /**
         * 跳转，调用回调函数
         * @param options
         * @param toPageIndex
         */
        toPage: function(options, toPageIndex) {
            if (options.pageIndex != toPageIndex) {
                options.pageIndex = toPageIndex;

                if (toPageIndex > 0 && toPageIndex <= options.pageTotal ) {
                    options.onPageSelected(toPageIndex, options.pageSize);
                }
            }
        },

        /**
         * 是否为数字
         * @param s
         * @returns {boolean}
         */
        isNumber: function(s) {
            var model = /^\d+$/;
            return model.test(s);
        }
    };

    /**
     * 提供方法。
     */
    ScPage.prototype = {
        /**
         * 初始化
         */
        init: function() {
            var $this = this;
            var $el = this.$element;

            //构造原始HTML代码，添加到对象内部
            var pageHtml = '<div class="sc-page">'
                + '<ul class="items">'
                + '<li class="item prev"><span>上一页</span></li>'
                + '<li class="item num">1</li>'
                + '<li class="item dot">...</li>'
                + '<li class="item num"></li>'
                + '<li class="item num"></li>'
                + '<li class="item num"></li>'
                + '<li class="item num"></li>'
                + '<li class="item num"></li>'
                + '<li class="item dot">...</li>'
                + '<li class="item num"></li>'
                + '<li class="item next"><span>下一页</span></li>'
                + '</ul>'
                + '<div class="total">共 <span>100</span> 条记录</div>'
                + '<div class="total">共 <span>100</span> 页</div>'
                + '<div class="jump">'
                + '<span class="text">到第 </span>'
                + '<input class="jump-page" type="text" value="" maxlength="3">'
                + '<span class="text"> 页</span>'
                + '<button class="page-btn">确定</button>'
                + '</div>'
                + '</div>';
            $el.append(pageHtml);

            var opt = this.options;
            //上一页绑定点击事件
            $el.find('.prev').on('click', function(){
                innerMethods.onPageClick(opt, this);
                $this.refresh();
            });
            //下一页绑定点击事件
            $el.find('.next').on('click', function(){
                innerMethods.onPageClick(opt, this);
                $this.refresh();
            });
            //数字按钮绑定点击事件
            $el.find('.num').on('click', function(){
                innerMethods.onPageClick(opt, this);
                $this.refresh();
            });

            //总记录数显示
            if (opt.showRecordTotal) {
                $el.find('.total').eq(0).show();
            } else {
                $el.find('.total').eq(0).hide();
            }

            //总页数显示
            if (opt.showPageTotal) {
                $el.find('.total').eq(1).show();
            } else {
                $el.find('.total').eq(1).hide();
            }

            //跳转
            if (opt.showJump) {
                $el.find('.jump').show();
            } else {
                $el.find('.jump').hide();
            }
            //跳转按钮绑定点击事件
            $el.find('.page-btn').on('click', function(){
                var toPageVal = $el.find('.jump-page').val();
                if (innerMethods.isNumber(toPageVal)) {
                    var toPage = parseInt(toPageVal);
                    if (toPage > opt.pageTotal) {
                        toPage = opt.pageTotal;
                    } else if (toPage <= 0) {
                        toPage = 1;
                    }
                    $el.find('.jump-page').val(toPage);
                    innerMethods.toPage(opt, toPage);
                    $this.refresh();
                }
            });

            this.refresh();
        },

        /**
         * 设置记录总数和页码
         * @param recordTotal   记录总数
         * @param pageIndex     页码（可以不传参）
         */
        setRecordTotal:function(recordTotal, pageIndex) {
            if (recordTotal == undefined) {
                return;
            }
            var opt = this.options;

            opt.recordTotal = recordTotal;
            if (pageIndex != undefined) {
                opt.pageIndex = pageIndex;
            }

            this.refresh();
        },

        /**
         * 刷新界面: 计算参数，修改数字按钮值
         */
        refresh: function() {
            var $el = this.$element;
            var opt = this.options;

            //计算参数
            innerMethods.calConfig(opt);

            //上一页
            if (opt.hasPrev) {
                $el.find('.prev').removeClass('prev-disabled');
            } else {
                $el.find('.prev').addClass('prev-disabled');
            }

            //下一页
            if (opt.hasNext) {
                $el.find('.next').removeClass('next-disabled');
            } else {
                $el.find('.next').addClass('next-disabled');
            }

            //总记录数
            $el.find('.total').eq(0).find('span').text(opt.recordTotal);
            //总页数
            $el.find('.total').eq(1).find('span').text(opt.pageTotal);
            //跳转
            $el.find('.jump .jump-page').val(opt.pageIndex);

            //构造数字按钮
            if (opt.pageTotal <= 7) {
                $el.find('.dot').hide();
                $el.find('.num').each(function(index, obj){
                    //index从0开始
                    if (index == opt.pageIndex - 1) {
                        $(obj).addClass('active');
                    } else {
                        $(obj).removeClass('active');
                    }
                    if (index < opt.pageTotal) {
                        $(obj).show();
                    } else {
                        $(obj).hide();
                    }
                    //设置页码
                    $(obj).text(index + 1);
                });
                $el.find('.num').eq(opt.pageIndex - 1).addClass('active');
            } else {
                var numbers = [1];
                if (opt.pageIndex <= 4) {
                    $el.find('.dot').eq(0).hide();
                    $el.find('.dot').eq(1).show();
                    numbers.push(2, 3, 4, 5, 6);
                } else if (opt.pageIndex >= opt.pageTotal - 3){
                    numbers.push(opt.pageTotal - 5, opt.pageTotal - 4, opt.pageTotal - 3, opt.pageTotal - 2, opt.pageTotal - 1);
                    $el.find('.dot').eq(0).show();
                    $el.find('.dot').eq(1).hide();
                } else {
                    numbers.push(opt.pageIndex - 2, opt.pageIndex - 1, opt.pageIndex, opt.pageIndex + 1, opt.pageIndex + 2);
                    $el.find('.dot').show();
                }
                numbers.push(opt.pageTotal);

                $el.find('.num').each(function(index, obj){
                    var pageVal = numbers[index];
                    if (pageVal == opt.pageIndex) {
                        $(obj).addClass('active');
                    } else {
                        $(obj).removeClass('active');
                    }
                    $(obj).text(pageVal).show();
                });
            }
        }

    };

    /**
     * 插件方法
     * @param options  初始化配置
     * @returns {*}
     */
    $.fn.scPage = function(options) {
        //入参，移除了第一个参数
        var inArguments = Array.prototype.slice.call(arguments, 1);

        return this.each(function(){
            var $this = $(this);
            var plugin = $this.data(PLUGIN_CACHE_KEY);
            if (!plugin) {
                plugin = new ScPage(this, options);
                // 缓存插件
                $this.data(PLUGIN_CACHE_KEY, plugin);
            }
            // 调用方法
            if (typeof options === "string" && typeof plugin[options] == "function") {
                // 执行插件的方法
                plugin[options].apply(plugin, inArguments);
            }
        });
    };

    /**
     * 暴露类名, 可以通过这个为插件做自定义扩展
     * @type {Object|Function}
     */
    $.fn.scPage.Constructor = ScPage.prototype;

})(window.jQuery);

/**
 * Created by Wuxz on 2017/9/21.
 */
(function($){
    "use strict";

    /**
     * ScTab 对象
     * @param opts
     * @constructor
     */
    var ScPrompt = function( opts){

        var opts = typeof opts ==="object" ? opts : {};
        this.options = $.extend({}, ScPrompt.SETTINGS, opts);

        //初始化
        this.init();
    };

    /**
     * 默认配置
     * */
    ScPrompt.SETTINGS = {
        /**
         * 主题内容
         */
        title:'标题内容',
        /**
         * 主题内容
         */
        content:'主题内容文字描述',
        /**
         * 按钮一
         */
        btn1:'取消',
        /**
         * 按钮二
         */
        btn2:'确定',

        /**
         * 按钮一的回调函数
         */
        btn1Click: null,
        /**
         * 按钮二的回调函数
         */
        btn2Click: null
        /**
         * 弹窗的z-index
         */
    };

    /**
     * 提供方法
     * */
    ScPrompt.prototype = {

        /**
         *初始化
         * */
        init: function(){
            var _this = this;
            var opt = _this.options;
            var elementId = 'ScPrompt';

            var alertHtml = '';
            var btn2Class = 'btn-confirm';
            if(opt.btn2 == '删除'){
                btn2Class = 'btn-delete';
            }
            alertHtml = '<div class="sc-prompt" id="' + elementId + '">'
            +'<span class="prompt-icon">'
            +'</span>'
            +'<div class="sc-tips">'
            +'<h3>'+ opt.title +'</h3>'
            +'</div>'
            +'<div class="btn-box">'
            +' <button class="pro-btn btn-2 '+btn2Class+'">'+opt.btn2+'</button>'
            +' <button class="pro-btn btn-cancel btn-1">'+opt.btn1+'</button>'
            +' </div>'
            +'</div>';

            $('body').append(alertHtml);

            var $element = $('#' + elementId);

            var left = ( $(window).width() - $element.outerWidth() ) / 2 ;
            var top = ( $(window).height() - $element.outerHeight()) / 2 ;

            $element.css({left:left,top:top});
            $element.addClass('sc-anim-fadein');

            //按钮点击通知事件
            $element.find('.btn-1').on('click', function(e){
                if( opt.btn1Click instanceof Function){
                    _this.close();
                    opt.btn1Click.apply(_this,[e]);

                }
            });
            $element.find('.btn-2').on('click', function(e){
                if( opt.btn2Click instanceof Function){
                    _this.close();
                    opt.btn2Click.apply(_this,[e]);
                }
            });

        },
        close: function(){
            var opt = this.options;
            var elementId = 'ScPrompt';
            var $element = $('#' + elementId);
            $element.addClass('sc-anim-fadeout');
            setTimeout(function(){
                $element.remove();
            },500);
        }
    };

    /**
     * 显示信息函数
     * @param options  配置
     * @returns {ScPrompt}
     */
    var promptFunc = function(options){
        if (!options) {
            options = $.extend({}, ScPrompt.SETTINGS);
        }
        if (!options.zIndex || options.zIndex == 9999) {
            options.zIndex = ScPrompt.SETTINGS.zIndex + 1;
            ScPrompt.SETTINGS.zIndex = options.zIndex;
        }

        return new ScPrompt(options);
    };

    //对外提供函数
    $(document).ready(function(){
        window.scant = window.scant || {};
        window.scant.prompt = promptFunc;
    });

})(window.jQuery);
/**
 * Created by Wuxz on 2017/8/28.
 */
(function($){
    "use strict";

    /**
     * 插件缓存key
     * @type {string}
     */
    var PLUGIN_RADIO_KEY = "sc.radio";

    /**
     * ScRadio 对象
     * @param element
     * @param opts
     * @constructor
     */
    var ScRadio = function(element, opts){
        this.$element = $(element);

        var opts = typeof opts ==="object" ? opts : {};
        this.options = $.extend({}, ScRadio.SETTINGS, opts);

        //初始化
        this.init();
    };

    /**
     * 默认配置
     * */
    ScRadio.SETTINGS = {
       /* radioLayer: {
            position: "absolute",
            opacity: 0,
            cursor: "pointer"
        }*/
       radioType:'normal'
    };

    /**
     * 提供方法
     * */
    ScRadio.prototype = {
        /**
         *初始化
         * */
        init: function(){
            var $el = this.$element;
            var opt = this.options;

            if(opt.radioType==='normal') {
                var classStr = 'sc-radio';
                if ($el.attr('checked') != undefined) {
                    classStr += ' checked';
                }
                if ($el.attr('disabled') != undefined) {
                    classStr += ' disabled';
                }
                var parent = '<div class="' + classStr + '"></div>';
                $el.wrap(parent);
            }else if(opt.radioType==='button') {
                $el.parent().parent().addClass('sc-radio-btn');
                var $parent=$el.parent();
                var  classStr='';
                if ($el.attr('checked') != undefined) {
                    classStr += ' checked';
                }
                if ($el.attr('disabled') != undefined) {
                    classStr += ' disabled';
                }
                $parent.addClass(classStr);
            }
                var $parent = $el.parent();


                $parent.on('click', function () {
                    if ($parent.hasClass('disabled')) {
                        return;
                    }

                    //如果当前目标没有选中，去除所有具有相同name单选框的选中
                    if (!$parent.hasClass('checked')) {
                        var oName = $el.attr('name');
                        var radios = $('body').find('input[name = "' + oName + '"]');

                        radios.each(function () {
                            $(this).removeAttr('checked');
                            $(this).parent().removeClass('checked');
                        });
                        $parent.addClass('checked');
                        $el.attr('checked', 'checked');
                    }
                });

        },

        /**
         * 设置组件选中状态
         * @param isChecked 选中状态，ture: 选中, false:不选中，默认true
         */
        check: function(isChecked){
            var $el = this.$element;
            var $parent = $el.parent();

            //默认为选中：true
            isChecked = isChecked == undefined || isChecked;

            if (!$parent) {
                console.error('call ScRadio.check error: Plz init first.');
                return;
            }
            if ($parent.hasClass('disabled')) {
                return;
            }

            var oName = $el.attr('name');
            //如果当前目标没有选中，且isChecked 等于true 去除所有具有相同name单选框的选中
            if(!$parent.hasClass('checked')){
                if(isChecked){
                    this.checkNone(oName);
                    $el.attr('checked','checked');
                    $parent.addClass('checked');
                }
            }else{
                if(!isChecked){
                    $el.removeAttr('checked','checked');
                    $parent.removeClass('checked')
                }
            }
        },

        /**
         * 设置组件启用状态
         * @param isEnabled 启用状态。true:启用；false:禁用
         */
        enable: function(isEnabled){
            var $el = this.$element;
            var $parent = $el.parent();

            //默认为启用：true
            isEnabled = isEnabled == undefined || isEnabled;

            if(!$parent){
                console.error('call ScRadio.enable error: Plz init first.');
                return;
            }

            if(!$parent.hasClass('disabled')){
                if(!isEnabled){
                    $el.attr('disabled','disabled');
                    $parent.addClass('disabled');
                }
            }else{
                if(isEnabled){
                    $el.removeAttr('disabled');
                    $parent.removeClass('disabled');
                }
            }
        },
        /**
         * 设置单选框全不选中
         * @param oName 单选框的name
         */
        checkNone: function(oName){
            var radios = $('body').find('input[name = "' + oName + '"]');

            radios.each(function(){
                $(this).removeAttr('checked');
                $(this).parent().removeClass('checked');
            });
        },
        /**
         * 刷新组件，有时候界面代码直接修改radio的选中、启用等状态，
         *  但是组件不会改变外观，这里需要调用该方法刷新组件的外观
         */
        refresh: function(){
            var $el = this.$element;
            var $parent = $el.parent();

            //刷新组件选中状态
            if($el.attr('checked') != undefined){
                if(!$parent.hasClass('checked')){
                    $parent.addClass('checked');
                }
            }else{
                if($parent.hasClass('checked')){
                    $parent.removeClass('checked');
                }
            }

            //刷新禁用状态
            if($el.attr('disabled') != undefined){
                if(!$parent.hasClass('disabled')){
                    $parent.addClass('disabled');
                }
            }else{
                if($parent.hasClass('disabled')){
                    $parent.removeClass('disabled')
                }
            }

        }
    };

    /**
     * 插件方法
     * @param options 初始化配置
     * @returns {*}
     */

    $.fn.scRadio = function(options){
        //入参，移出了第一个参数 （转为数组）
        var inArguments = Array.prototype.slice.call(arguments,1);

        return this.each(function(){
            var $this = $(this);
            var plugin = $this.data(PLUGIN_RADIO_KEY);
            if(!plugin) {
                plugin = new ScRadio(this, options);
                //缓存插件
                $this.data(PLUGIN_RADIO_KEY,plugin);
            }
            //调用方法
            if(typeof options === 'string' && typeof plugin[options] == 'function'){
                //执行插件的方法
                plugin[options].apply(plugin, inArguments);
            }
        });
    };

    /**
     * 暴露类名，可以通过这个为插件做自定义扩展
     * @type {Object|Function}
     */
    $.fn.scRadio.Constructor = ScRadio.prototype;

})(window.jQuery);
/**
 * Created by chenlin on 2017/9/24.
 */

(function ($) {
    "use strict";

    /**
     * 插件缓存KEY
     * @type {string}
     */
    var PLUGIN_CACHE_KEY = "sc.switch";

    /**
     * ScSwitch对象
     * @param element
     * @param opts
     * @constructor
     */
    var ScSwitch = function(element, opts) {
        this.$element = $(element);

        var opts = typeof opts === "object" ? opts : {};
        this.options = $.extend({}, ScSwitch.SETTINGS, opts);
        //初始化
        this.init();
    };

    /**
     * 默认配置
     */
    ScSwitch.SETTINGS = {
        "open": false
    };


    /**
     * 内部方法，对外不公开
     * addText 添加文字  addIcon 添加图标
     */
    var innerMethods = {

        addText: function(options,$text){
            if(options){
                $text.html(options);
            }
        },

        addIcon: function(options,$img){
            if(options){
                $img.attr("src",options);
            }
        }
    }


    /**
     * 提供方法。
     */
    ScSwitch.prototype = {
        /**
         * 初始化
         */
        init: function() {

            var options = this.options;
            var $el = this.$element;
            $el.addClass('sc-switch');

            //白色滑块
            var $slider = document.createElement("i");
            $slider.className = 'sc-switch-slider';
            $el.append($slider);

            //如果有文字添加文字容器
            if(options.textOpen || options.textClose){
                var $text = $("<span></span>");
                $text.addClass("sc-switch-text");
                $el.append($text);
            }

            //如果有图片添加图片容器
            if(options.iconOpen || options.iconClose){
                var $img = $("<img src=''/>");
                $img.addClass("sc-switch-img");
                $el.append($img);
            }

            if(options.open){
                $el.addClass("sc-switch-open");
                innerMethods.addText(options.textOpen , $text);
                innerMethods.addIcon(options.iconOpen , $img);
            }else{
                $el.addClass("sc-switch-close");
                innerMethods.addText(options.textClose , $text);
                innerMethods.addIcon(options.iconClose , $img);
            }

            $el.click(function(){

                if($(this).hasClass("sc-switch-open")){
                    $(this).removeClass("sc-switch-open").addClass("sc-switch-close");
                    innerMethods.addText(options.textClose, $text);
                    innerMethods.addIcon(options.iconClose, $img);
                }else{
                    $(this).removeClass("sc-switch-close").addClass("sc-switch-open");
                    innerMethods.addText(options.textOpen, $text);
                    innerMethods.addIcon(options.iconOpen, $img);
                }
            });

        }
    };

    /**
     * 插件方法
     * @param options  初始化配置
     * @returns {*}
     */
    $.fn.scSwitch = function(options) {
        //入参，移除了第一个参数
        var inArguments = Array.prototype.slice.call(arguments, 1);
        var rdata = null;
        this.each(function(){
            var $this = $(this);
            var plugin = $this.data(PLUGIN_CACHE_KEY);
            if (!plugin) {
                plugin = new ScSwitch(this, options);
                // 缓存插件
                $this.data(PLUGIN_CACHE_KEY, plugin);
            }
            // 调用方法
            if (typeof options === "string" && typeof plugin[options] == "function") {
                // 执行插件的方法
                rdata = plugin[options].apply(plugin, inArguments);
            }
        });
        return rdata;
    };

    /**
     * 暴露类名, 可以通过这个为插件做自定义扩展
     * @type {Object|Function}
     */
    $.fn.scSwitch.Constructor = ScSwitch.prototype;

})(window.jQuery);
/**
 * Created by Wuxz on 2017/8/28.
 */
(function($){
    "use strict";

    /**
     * 插件缓存key
     * @type {string}
     */
    var PLUGIN_TAB_KEY = "sc.tab";

    /**
     * ScTab 对象
     * @param element
     * @param opts
     * @constructor
     */
    var ScTab = function(element, opts){
        this.$element = $(element);

        var opts = typeof opts ==="object" ? opts : {};
        this.options = $.extend({}, ScTab.SETTINGS, opts);

        //初始化
        this.init();
    };

    /**
     * 默认配置
     * */
    ScTab.SETTINGS = {
        /**
         *返回当前选中的项
         * @param selected
         */
        onTabSelected: function(selected){},
        //方向水平level,垂直vertical
        direction:'level',
        //标签样式base基本，card卡片，button按钮
        tabType:'base',
        //按钮类型大小
        btnSize:'normal'
    };

    /**
     * 提供方法
     * */
    ScTab.prototype = {

        /**
         *初始化
         * */
        init: function(){
            var _this = this;
            var opt = _this.options;
            var $el = _this.$element;
            //卡片的四种形式，其中base包括俩种方向，其余俩种
            if(opt.tabType==='base'){
                $el.addClass('sc-tab');
                //添加选中效果线
                $el.find('ul').append('<i class="sc-line"></i>');
                if(opt.direction == 'vertical'){
                    $el.addClass('tab-top');
                }

                var $list = $el.find('li');
                //tab列表点击事件
                $list.on('click',function(){
                    $list.removeClass('selected');
                    $(this).addClass('selected');

                    if($el.hasClass('tab-top')){
                        var top = $(this).height() * $(this).index() + 10;
                        //改变选中线的top值
                        $el.find('.sc-line').css({
                            'top':top
                        });
                    }else{
                        var width =  $(this).width();
                        var left = $(this).position().left + 18;
                        //改变选中线的宽度，与位置
                        $el.find('.sc-line').css({
                            'width':width,
                            'left':left
                        });
                    }

                    if(opt.onTabSelected instanceof Function){
                        opt.onTabSelected.apply(self,$(this));
                    }

                });

                //默认选中第一个
                $list.eq(0).click();
            }else if(opt.tabType==='card'){ 
                $el.addClass('sc-tabCard');
                $el.find('ul').css('width',$el.find('.tab-content').width());

                var $lists=$el.find('li');
                $lists.click(function(){
                    $lists.removeClass('selected');
                    $(this).addClass('selected');

                    $el.find('.tab-content').hide();
                    $el.find('.tab-content').eq($(this).index()).show();

                    if(opt.onTabSelected instanceof Function){
                        opt.onTabSelected.apply(self,$(this));
                    }
                })
                //默认选中第一个
                $lists.eq(0).click();
            }else if(opt.tabType==='button'){
                $el.addClass('sc-tabButton');
                var $lists=$el.find('li');
                //如果指定按钮尺寸为small,则添加小按钮样式
                if(opt.btnSize==='sm'){
                    $lists.addClass('small');
                }
                $lists.click(function(){
                    $lists.removeClass('selected');
                    $(this).addClass('selected');

                    if(opt.onTabSelected instanceof Function){
                        opt.onTabSelected.apply(self,$(this));
                    }
                })
              //默认选中第一个
                $lists.eq(0).click(); 
            }

        },

        /**
         * 设置默认选择菜单
         * @param id
         */
        select: function(id){
            var item = $('#'+ id);
            if(item.length <= 0){
                console.error('call scTab.select error: id = '+id+" does not exist!");
                return;
            }
            item.click();
        },
        /**
         * 获取当前选中菜单
         */
        getSelectNode:function(){
            var $element = this.$element;
            var selectNode = $element.find(".selected");
            return selectNode.length > 0 ? selectNode.get(0) : null;
        }

    };

    /**
     * 插件方法
     * @param options 初始化配置
     * @returns {*}
     */

    $.fn.scTab = function(options){
        //入参，移出了第一个参数 （转为数组）
        var inArguments = Array.prototype.slice.call(arguments,1);

        return this.each(function(){
            var $this = $(this);
            var plugin = $this.data(PLUGIN_TAB_KEY);
            if(!plugin) {
                plugin = new ScTab(this, options);
                //缓存插件
                $this.data(PLUGIN_TAB_KEY,plugin);
            }
            //调用方法
            if(typeof options === 'string' && typeof plugin[options] == 'function'){
                //执行插件的方法
                plugin[options].apply(plugin, inArguments);
            }
        });
    };

    /**
     * 暴露类名，可以通过这个为插件做自定义扩展
     * @type {Object|Function}
     */
    $.fn.scTab.Constructor = ScTab.prototype;

})(window.jQuery);
/**
 * Created by wuxiaozhen on 2018/5/18.
 */
(function($,scant){
    "use strict";

    /**
     * 插件缓存key
     * @type {string}
     */
    var PLUGIN_TABLE_KEY = "sc.table";

    /**
     * ScTable 对象
     * @param element
     * @param opts
     * @constructor
     */
    var ScTable = function(element, opts) {
        this.$element = $(element);

        var opts = typeof opts === "object" ? opts : {};
        this.options = $.extend({}, ScTable.SETTINGS, opts);
        //初始化
        this.init();


    };

    /**
     * 默认配置
     * @type {{}}
     */
    ScTable.SETTINGS = {
        //表格类型 1默认； 2 弹框式； 3 带边框
        type:1,
        //表格 是否使用自动布局
        autoWidth: true,
        /**
         * 表头列配置
         * key 对应数据字段
         * name 名称
         * width 列宽度
         * textAlign 内容布局 left 居左 center 居中 right 居中：  默认居中
         * visible 是否显示该列 默认显示
         * orderable 是否显示排序 目前功能还没做 默认不显示
         */
        columnDefs: [],
        //表格数据list
        tableData: [],
        //checkbox
        checkboxs: {
            visible:false //默认不显示
        },
        /**
         * 操作按钮 默认不显示
         * visible 是否显示操作按钮
         * used:  edit 编辑 ; detele 删除
         * ext 自定义操作按钮 需要包括 type 按钮类型 title 按钮提示信息 iconClass 按钮的 class 用来定义样式
         */
        actions:{
            visible: false,
            used:['edit','delete'],
            ext:[
                {"type": "password", "title": '修改密码', "iconClass": "", index:1}
            ]
        },
        /**
         * 事件集合
         */
        event: {
            // 处理操作图标点击事件
            handleAction: function(type, obj) {
            },
            handleRowClick: function(obj) {
            },
            handleRowDbclick: function(obj) {
            },
            handleCheckevent: function(obj){
            },
            handelCheckAllEvent: function(e){
            },
            // 排序
            handleOrderEvent: function(key, orderType) {
            }
        },
        //表格一行数据变色
        setClassInRow: function(trData) {
        },
        /**
         * 刷新表格数据
         * @param key
         * @param value
         */
        renderer: function(key,value) {
        }
    };




    /**
     * 常量
     **/
    ScTable.Actions = [
        {"type": "edit", "title": '编辑', "iconClass": "btn-edit"},
        {"type": "delete", "title": '删除', "iconClass": "btn-delete"}
    ];
    ScTable.ColumnKey = ['checkboxs', 'actions'];
    /**
     * 插件方法
     * @type {{}}
     */
    ScTable.prototype = {
        /**
         * 初始化
         */
        init: function () {
            var _this = this;
            var $element = _this.$element;
            var opt = _this.options;

            $element.addClass('sc-table');

            if(opt.autoWidth){
                $element.addClass('auto-width');
            }

            //表格类型
            if (opt.type === 2) {
                $element.addClass('table-pop');
            } else if (opt.type === 3) {
                $element.addClass('table-border');
            }
            var tableHtml = '';
            var theadHtml = '';
            var tbodyHtml = '';

            //如果checkboxs.visible 属性为true 则显示复选框 默认不显示
            if (opt.checkboxs.visible) {
                theadHtml = '<th width="80px"><input type="checkbox" name="check-all"/></th>';
            }

            var columnDefsLen = opt.columnDefs.length;
            for (var i = 0; i < columnDefsLen; i++) {
                //表格宽度是否使用自适应 为true 则 columnDefs 里的width 不起作用
                if (opt.autoWidth) {
                    theadHtml += '<th>' + opt.columnDefs[i].name + '</th>';
                } else {
                    theadHtml += '<th width="' + opt.columnDefs[i].width + '">' + opt.columnDefs[i].name + '</th>';
                }
                if (opt.columnDefs[i].setTdClass instanceof Function) {
                  //  opt.setClassInRow.apply(_this,[ opt.tableData[j]]);
                }

            }
            //如果actions.visible 属性为true 则显示操作按钮
            if (opt.actions.visible) {
                theadHtml += '<th width="150px">操作</th>';
            }

            //是否居左 是则加 class align-left

            for ( var even = '', j = 0; j < opt.tableData.length; j++) {

                //是否是偶数行 是则加 class even
                if ( j % 2 === 0) {
                    even = 'even';
                } else {
                    even = '';
                }
              //根据某一字段属性给一行加上Class
                if (opt.setClassInRow instanceof Function) {
                    opt.setClassInRow.apply(_this,[ opt.tableData[j]]);

                }
                even += ' '+ opt.setClassInRow(opt.tableData[j]);

                //如果checkboxs.visible 属性为true 则显示复选框
                if (opt.checkboxs.visible) {
                    tbodyHtml += '<tr class="'+ even +'"><td><input type="checkbox" name="check"/></td>';
                }else{
                    tbodyHtml += '<tr class="'+ even +'">';
                }
                var tdValue ;
                for (var k = 0; k < opt.columnDefs.length; k++) {
                    var textAlign = '';
                    //设置列class样式 根据某一字段
                    if (opt.columnDefs[k].setTdClass instanceof Function) {
                        opt.columnDefs[k].setTdClass.apply(_this, [opt.tableData[j]]);
                        textAlign = opt.columnDefs[k].setTdClass(opt.tableData[j]);
                    }


                    //此列是否设置水平 位置
                    if(opt.columnDefs[k].textAlign === 'left'){
                        textAlign += ' align-left';
                    }else{
                        textAlign += '';
                    }
                    if ( opt.columnDefs[k].renderData ) {
                        //渲染表格数据
                        tdValue = rendererData(opt.tableData[j][opt.columnDefs[k].key] ,opt.columnDefs[k].renderData);
                    }else{
                        tdValue = opt.tableData[j][opt.columnDefs[k].key];
                    }

                     tbodyHtml += '<td class="'+ textAlign +'">' + tdValue + '</td>';

                }

                //如果actions.visible 属性为true 则显示操作按钮
                if (opt.actions.visible) {
                    var btnsHtml = '';
                    var actionsUsedLen = opt.actions.used.length;
                    var actionsType = '';

                    $.each(ScTable.Actions, function(index, obj){

                        for (var i = 0; i < actionsUsedLen; i++) {

                            actionsType = opt.actions.used[i];

                            if (actionsType === obj.type) {

                                btnsHtml += '<button type="button" data-attr="'+ obj.type +'" title="'+ obj.title +'" class="'+ obj.iconClass +'"></button>';
                            }
                        }
                    });

                    //如果自定义按钮存在
                    if (opt.actions.ext) {
                        if (opt.actions.ext.length > 0) {
                            $.each(opt.actions.ext, function(index, obj){
                                btnsHtml += '<button type="button" data-attr="'+ obj.type +'" title="'+ obj.title +'" class="'+ obj.iconClass +'"></button>';
                            });
                        }
                    }
                    tbodyHtml += '<td width="150px">'+ btnsHtml +'</td>';
                }

                tbodyHtml += '</tr>';
            }


            //表格内容
            tableHtml = '<table>' +
                    '<thead>' +
                         '<tr>' + theadHtml +'</tr>' +
                    '</thead>' +
                    '<tbody>' + tbodyHtml + '</tbody>' +
                '</table>';

            $element.append(tableHtml);
            $('input[type="checkbox"]').scCheck('check', false);

            //行单击事件
            $element.find('tbody tr').on('click', function( e){
                if ( opt.event.handleRowClick instanceof Function) {
                    //返回当前点击列的数据
                    opt.event.handleRowClick.apply(_this,[opt.tableData[e.currentTarget.rowIndex - 1]]);
                }
            });
            //行双击事件
            $element.find('tbody tr').on('dblclick', function(e){
                if ( opt.event.handleRowDbclick instanceof Function) {
                    //返回当前点击列的数据
                    opt.event.handleRowDbclick.apply(_this,[opt.tableData[e.currentTarget.rowIndex - 1]]);
                }
            });

            //表体复选框点击事件 返回点击行 数据
            $element.find('input[name="check"]').on('change', function(e){
                if ( opt.event.handleCheckevent instanceof Function) {
                    var indexNum = $(e.currentTarget).parents('tr').index();

                    var trLength = $(e.currentTarget).parents('tbody').find('tr').length;

                    var checkedLength = $(e.currentTarget).parents('tbody').find('input:checked').length;

                    //如果表格表体行的长度 等于 CheckBox选中的长度 则选中表头CheckBox
                    if ( checkedLength === trLength) {
                        $element.find('input[name="check-all"]').scCheck('check',true);
                    }else if (checkedLength + 1 === trLength){
                        $element.find('input[name="check-all"]').scCheck('check',false);

                    }
                    opt.event.handleCheckevent.apply(_this,[opt.tableData[indexNum]]);
                }
            });

            //表头复选框点击事件
            $element.find('input[name="check-all"]').on('change', function(e){
                if ( opt.event.handelCheckAllEvent instanceof Function) {

                    if ($(e.currentTarget).attr('checked') ) {
                        $element.find('input[name="check"]').scCheck('check',true);
                    } else {
                        $element.find('input[name="check"]').scCheck('check',false);
                    }

                    opt.event.handelCheckAllEvent.apply(_this,[e]);
                }
            });

            //右侧图标点击事件
            $element.find('tbody button').on('click', function(e){
                stopEvent (e);
                if ( opt.event.handleAction instanceof Function) {
                    var indexNum = $(e.currentTarget).parents('tr').index();
                    var btnType = $(e.currentTarget).attr('data-attr');
                    opt.event.handleAction.apply(_this,[btnType, opt.tableData[indexNum]]);
                }
            });

        },
        /**
         * 刷新表格数据
         * @param key
         * @param data
         */
        renderer: function (key, data) {
        },
        setClassInRow: function (trData) {
        }
    };

    //阻止事件冒泡
    function stopEvent (e) {
        console.log(arguments);
        //取消事件冒泡
       // var e =  event || arguments.callee.caller.arguments[0];
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
    }

    function rendererData(key, data){
        var len = data.length;

        for (var i = 0; i < len ; i++) {
            for (var keys in data[i]) {
                if ( key == keys) {
                    return data[i][keys];
                }
            }
        }
    }

    $.fn.scTable = function(options){
        //入参，移出了第一个参数 （转为数组）
        var inArguments = Array.prototype.slice.call(arguments,1);

        return this.each(function(){
            var $this = $(this);
            var plugin = $this.data(PLUGIN_TABLE_KEY);
            if(!plugin) {
                plugin = new ScTable(this, options);
                //缓存插件
                $this.data(PLUGIN_TABLE_KEY,plugin);
            }
            //调用方法
            if(typeof options === 'string' && typeof plugin[options] == 'function'){
                //执行插件的方法
                plugin[options].apply(plugin, inArguments);
            }
        });
    };


    /**
     * 暴露类名，可以通过这个为插件做自定义扩展
     * @type {Object|Function}
     */
    $.fn.scTable.Constructor = ScTable.prototype;

})(window.jQuery,window.scant);


/**
 * 气泡框，调用方法：scant.tip(info)，类似layer.tip。
 * Created by LuLihong on 2017/9/12.
 */
(function ($, undefined) {
    "use strict";

    var ScTip = function(content, follow, opts) {
        opts = typeof opts === "object" ? opts : {};
        this.options = $.extend({}, ScTip.SETTINGS, opts);
        this.content = content;
        this.follow = follow;
        this.init();
    };

    /**
     * 默认配置
     */
    ScTip.SETTINGS = {
        /**
         * 显示时间，单位：毫秒，如果为0，则一直显示。
         */
        time: 3000,
        /**
         * 文字颜色
         */
        color: '#FFFFFF',
        /**
         * 背景色
         */
        backgroundColor: '#000000',
        /**
         * 边框颜色
         */
        borderColor: '#000000',

        /**
         * 是否使用动画
         */
        isAnim: true,
        /**
         * 方位：t-头部、r-右边(默认)、b-底部、l-坐标、tl-上左、tr-上右、rt-右上、rb-右下、bl-下左、br-下右、lt-左上、lb-坐下
         */
        direction:'r',
        /**
         * 消息框的z-index
         */
        zIndex: 20160212,
        /**
         * 结束或关闭时的回调函数
         */
        end: function(){}
    };


    ScTip.prototype = {
        /**
         * 初始化
         */
        init: function() {
            var that = this;
            var opt = that.options;
            var $follow = that.follow;
            var elementId = 'ScTip' + opt.zIndex;

            //构造原始HTML代码，添加到对象内部
            var pageHtml = '<div class="sc-tip" id="' + elementId + '" >'
                + '<div class="sc-tip-content">' + this.content + '<i class="triangle"></i></div>';
            + '</div>';
            $('body').append(pageHtml);

            var $element = $('#' + elementId);
            that.$element = $element;
            $element.css("z-index", opt.zIndex);

            var triangleLen = 8;
            var triangleOffset = 10 + triangleLen / 2;

            var followCal = {
                width: $follow.outerWidth(),
                height: $follow.outerHeight(),
                top: $follow.offset().top,
                left: $follow.offset().left
            };

            var eleCal = {
                width: $element.outerWidth(),
                height: $element.outerHeight(),
                top: $element.offset().top,
                left: $element.offset().left
            };

            var offsetLeft = 0;
            var offsetTop = 0;

            //三角形
            var $triangle = $element.find('.triangle');

            switch (opt.direction) {
                case 't':
                    offsetTop = followCal.top - eleCal.height - triangleLen;
                    offsetLeft = followCal.left + followCal.width / 2 - eleCal.width / 2;
                    $triangle.addClass('triangle-top').css({borderTopColor: opt.borderColor});
                    break;
                case 'r':
                    offsetTop = followCal.top + followCal.height / 2  - eleCal.height / 2;
                    offsetLeft = followCal.left + followCal.width + triangleLen;
                    $triangle.addClass('triangle-right').css({borderRightColor: opt.borderColor});
                    break;
                case 'b':
                    offsetTop = followCal.top + followCal.height + triangleLen;
                    offsetLeft = followCal.left + followCal.width / 2 - eleCal.width / 2;
                    $triangle.addClass('triangle-bottom').css({borderBottomColor: opt.borderColor});
                    break;
                case 'l':
                    offsetTop = followCal.top + followCal.height / 2 - eleCal.height / 2;
                    offsetLeft = followCal.left - eleCal.width - triangleLen;
                    $triangle.addClass('triangle-left').css({borderLeftColor: opt.borderColor});
                    break;
                case 'tl':
                    offsetTop = followCal.top - eleCal.height - triangleLen;
                    offsetLeft = followCal.left + followCal.width / 2  - triangleOffset;
                    $triangle.addClass('triangle-top-left').css({borderTopColor: opt.borderColor});
                    break;
                case 'tr':
                    offsetTop = followCal.top - eleCal.height - triangleLen;
                    offsetLeft = followCal.left + followCal.width / 2 - eleCal.width + triangleOffset;
                    $triangle.addClass('triangle-top-right').css({borderTopColor: opt.borderColor});
                    break;
                case 'bl':
                    offsetTop = followCal.top + followCal.height + triangleLen;
                    offsetLeft = followCal.left + followCal.width / 2  - triangleOffset;
                    $triangle.addClass('triangle-bottom-left').css({borderBottomColor: opt.borderColor});
                    break;
                case 'br':
                    offsetTop = followCal.top + followCal.height + triangleLen;
                    offsetLeft = followCal.left + followCal.width / 2 - eleCal.width + triangleOffset;
                    $triangle.addClass('triangle-bottom-right').css({borderBottomColor: opt.borderColor});
                    break;
                case 'rt':
                    offsetTop = followCal.top + followCal.height / 2  - triangleOffset;
                    offsetLeft = followCal.left + followCal.width + triangleLen;
                    $triangle.addClass('triangle-right-top').css({borderRightColor: opt.borderColor});
                    break;
                case 'rb':
                    offsetTop = followCal.top + followCal.height / 2  - eleCal.height + triangleOffset;
                    offsetLeft = followCal.left + followCal.width + triangleLen;
                    $triangle.addClass('triangle-right-bottom').css({borderRightColor: opt.borderColor});
                    break;
                case 'lt':
                    offsetTop = followCal.top + followCal.height / 2  - triangleOffset;
                    offsetLeft = followCal.left - eleCal.width - triangleLen;
                    $triangle.addClass('triangle-left-top').css({borderLeftColor: opt.borderColor});
                    break;
                case 'lb':
                    offsetTop = followCal.top + followCal.height / 2  - eleCal.height + triangleOffset;
                    offsetLeft = followCal.left - eleCal.width - triangleLen;
                    $triangle.addClass('triangle-left-bottom').css({borderLeftColor: opt.borderColor});
                    break;
                default : {}
            }
            $element.css({top: offsetTop, left: offsetLeft, color: opt.color, backgroundColor: opt.backgroundColor,
                borderColor: opt.borderColor});
            $element.addClass('sc-anim sc-anim-fadein');

            opt.time <= 0 || setTimeout(function(){
                that.close();
            }, opt.time);
        },

        close: function(){
            var that = this;
            var opt = that.options;
            that.$element.addClass('sc-anim-fadeout');
            setTimeout(function(){
                opt.end();
                that.$element.remove();
            }, 600);
        }
    };


    /**
     * 显示信息函数
     * @param content   内容
     * @param options   配置
     * @returns {ScTip}
     */
    var tipFunc = function(content, follow, options){
        if (!options) {
            options = $.extend({}, ScTip.SETTINGS);
        }
        if (!options.zIndex || options.zIndex == 20160212) {
            options.zIndex = ScTip.SETTINGS.zIndex + 1;
            ScTip.SETTINGS.zIndex = options.zIndex;
        }

        return new ScTip(content, follow, options);
    };

    //对外提供函数
    $(document).ready(function(){
        window.scant = window.scant || {};
        window.scant.tip = tipFunc;
    });

})(jQuery);



/**
 * Created by LuLihong on 2017/8/22.
 */

