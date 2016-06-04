var EASING_NAME = "easeInOutCubic";
//计算左边栏高度
var initAsideHeight = function () {
    $(".menu-container").height($(window).height() - $(".aside-menu").position().top);
    $(".menu-container .menu").each(function (i, e) {
        if ($(e).data("jsp"))
            $(e).data("jsp").reinitialise();
    });
};
$(window).resize(initAsideHeight);
initAsideHeight();
//左边栏滚动条
$(".menu-container .main-menu").jScrollPane();
//左边栏导航菜单点击
$(".aside-menu .menu-container .main-menu ul.aside-nav li a").click(function () {
    var mid = $(this).attr("data-mid");
    if (mid) {
        var subMenu = $(".aside-menu .menu-container .sub-menu[data-mid=" + mid + "]");
        if (subMenu.length == 0)
            return;
        if (!$(".aside-menu .menu-container .sub-menu-container").hasClass("active")) {
            $(".aside-menu .menu-container .sub-menu.active").hide().removeClass("active");
            $(".aside-menu .menu-container .sub-menu-container").addClass("active");
            $(".aside-menu .menu-container .sub-menu-close-btn").addClass("active");
            $(".aside-menu").hover(subMenuContainerIn, subMenuContainerOut)
            subMenu.show().fadeTo(0, 1).addClass("active");
            if (subMenu.data("jsp"))
                subMenu.data("jsp").reinitialise();
            else
                subMenu.jScrollPane();
        }
        else if (!subMenu.hasClass("active")) {
            $(".aside-menu .menu-container .sub-menu.active").fadeTo("normal", 0, EASING_NAME, function () {
                $(this).removeClass("active").hide();
                subMenu.addClass("active").show().fadeTo("normal", 1, EASING_NAME, function () {
                    if ($(this).data("jsp"))
                        $(this).data("jsp").reinitialise();
                    else
                        subMenu.jScrollPane();
                });
            });
        }
        else {
            hideSubMenu();
        }
    }
});
//二级菜单隐藏
var hideSubMenuTimer = null;
var hideSubMenu = function () {
    $(".aside-menu .menu-container .sub-menu-close-btn").removeClass("active");
    $(".aside-menu .menu-container .sub-menu-container").removeClass("active");
    $(".aside-menu").off();
};
$(".aside-menu .menu-container .sub-menu-close-btn").click(hideSubMenu);
var subMenuContainerIn = function () {
    if (hideSubMenuTimer) {
        clearTimeout(hideSubMenuTimer);
        hideSubMenuTimer = null;
    }
};
var subMenuContainerOut = function () {
    if (!hideSubMenuTimer) {
        hideSubMenuTimer = setTimeout(hideSubMenu, 2000);
    }
};
//品牌菜单切换
$(".aside-menu .menu-container .main-menu a.brand").click(function () {
    if ($(this).hasClass("active"))
        return;
    $(this).addClass("active");
    //收起其他菜单
    $(".aside-menu .menu-container .main-menu a.brand").not(this).removeClass("active").next("ul.aside-nav").stop(true, false).slideUp("slow", EASING_NAME, function () {
        if ($(".aside-menu .menu-container .main-menu").data("jsp"))
            $(".aside-menu .menu-container .main-menu").data("jsp").reinitialise();
    });
    //展开
    $(this).next("ul.aside-nav").stop(true, false).slideDown("slow", EASING_NAME, function () {
        if ($(".aside-menu .menu-container .main-menu").data("jsp"))
            $(".aside-menu .menu-container .main-menu").data("jsp").reinitialise();
    });
    //设置分割线
    if ($(this).prev(".separator").hasClass("up"))
        $(this).prev(".separator").removeClass("up").addClass("down");
    if ($(this).next("ul.aside-nav").next(".separator").hasClass("down"))
        $(this).next("ul.aside-nav").next(".separator").removeClass("down").addClass("up");
});
//点击分割线切换附近品牌菜单
$(".aside-menu .menu-container .main-menu .separator").click(function () {
    if ($(this).hasClass("up"))
        $(this).next("a.brand").click();
    else if ($(this).hasClass("down"))
        $(this).prev("ul.aside-nav").prev("a.brand").click();
});
//移动端菜单
var $header_m = $(".header-m"),
    $menu_m = $(".menu-m").not(".m-right"),
    $menu_camera = $(".menu-m.m-right");
$header_m.find("a.menu").click(function () {
    $menu_m.addClass("open");
    $menu_camera.removeClass("open");
    $("body").addClass("no-scroll");
});
$menu_m.find("a.close").click(function () {
    $menu_m.removeClass("open");
    $("body").removeClass("no-scroll");
});
if ($menu_camera.length) {
    $header_m.find("a.camera").click(function () {
        $menu_m.removeClass("open");
        $menu_camera.addClass("open");
        $("body").addClass("no-scroll");
    });
    $menu_camera.find("a.close").click(function () {
        $menu_camera.removeClass("open");
        $("body").removeClass("no-scroll");
    });
}