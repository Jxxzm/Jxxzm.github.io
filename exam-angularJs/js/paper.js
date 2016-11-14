/**
 * Created by Administrator on 2016/9/28.
 */
//这是一个试卷模块
angular.module("app.paperModule",["ng","app.subjectModule"])
    .controller("paperListController",["$scope",function($scope){

    }])
    .controller("paperAddController",["$scope","commentService","paperModel","$routeParams"
        ,function($scope,commentService,paperModel,$routeParams){
        //将查询到的所有方向的数据绑定在作用域中
        commentService.getAllDepartment(function(data){
           $scope.departments=data;
        });
    //双向绑定对象
    $scope.model=paperModel.model;
    var id=$routeParams.id;
    if(id!=0){
        paperModel.addSubjectId(id);
        paperModel.addSubject(angular.copy($routeParams));



    }
}])

    .factory("paperModel",function(){
    return{
        model:{
        departmentId:1,
        title:"",
        desc:"",
        tt:'',
        at:'',
        scores:[],
        subjectIds:[],
        subjects:[]

        },
       addSubjectId:function(id){
           this.model.subjectIds.push(id);
       } ,
        addScore:function(index,score){
           this.model.scores[index]=score;
        },
        addSubject:function(subject){
            this.model.subjects.push(subject);
        }

    }
});