//jQuery代码
//实现左侧导航动画
$(function(){
    //让所有的列表默认合并,收缩全部
    $(".baseUI>li>ul").slideUp("fast");
    //事件代理，给被点击元素的父元素添加事件代理,click支持子元素
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function(){
        //清除li下面所有ul的样式
        $(".baseUI>li>ul").slideUp("fast");
        //给被点击li下面的ul添加动画
        $(this).next("ul").slideDown();
    });
    //默认让第一个展开,get()返回的是dom对象，eq()返回的是jQuery对象
    //trigger模拟点击click事件
    $(".baseUI>li>a").eq(0).trigger("click");

    //添加背景颜色
    $(".baseUI>li>ul>li").off("click");
    $(".baseUI>li>ul>li").on("click",function(){
        if(!$(this).hasClass("current")){
            $(".baseUI>li>ul>li").removeClass("current");
            $(this).addClass("current");
        }

    });

    //模拟默认点击全部题目中的a,点击a，才会引发路径的改变
    $(".baseUI>li>ul>li").eq(0).find("a").trigger("click");



});

//angular
angular.module("app",["ng","ngRoute","app.subjectModule","app.paperModule"])
    .controller("mainController",["$scope",function($scope){

    }])
    .config(["$routeProvider",function($routeProvider){
        //"/subjectList/dpId/1/topicId/2/levelId/3/typeId/1"
        $routeProvider.when("/subjectList/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/subjectManager/dpId/:dpId/typeId/:typeId/topicId/:topicId/levelId/:levelId",{
            templateUrl:"tpl/subject/subjectManger.html",
            controller:"subjectController"
        }).when("/addSubject",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectCheck/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
        }).when("/PaperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperAddSubject/dpId/:dpId/typeId/:typeId/topicId/:topicId/levelId/:levelId",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectController"
        });
    }]);