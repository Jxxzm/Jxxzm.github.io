/**
 * Created by Administrator on 2016/9/22.
 */
//题库模块
angular.module("app.subjectModule",["ng"])
    //控制器
    .controller("subjectDelController",["$routeParams","$location","subjectService",function($routeParams,$location,subjectService){
        //删除
        //点击确认和取消的返回值不一样
        var flag=confirm("确认删除吗?");
        if(flag){
            subjectService.checkSubject($routeParams.id,$routeParams.state,function(data){
                alert(data);
            })
        }
        //跳转页面
        $location.path("/subjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    .controller("subjectCheckController",["$routeParams","$location","subjectService",function ($routeParams,$location,subjectService) {
        //审核
        subjectService.checkSubject($routeParams.id,$routeParams.state,function (data) {
            alert(data);
        });
        //跳转
        $location.path("/subjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    .controller("subjectController",["$scope","commentService","$location","subjectService","$filter","$routeParams",
        function($scope,commentService,$location,subjectService,$filter,$routeParams){
        //subjectList题目的筛选
        //封装筛选数据时用的模板对象
      //把路由中传给angular的参数通过$routeParams来接受参数，把接受的参数绑定在作用域中
        $scope.params=$routeParams;
       //匿名函数可进行方法的执行，把方法封装在里面
        var subjectModel=(function(){
            var obj={};
            //id=0，不要参与数据的筛选
            if($routeParams.typeId!=0){
                obj['subject.subjectType.id']=$routeParams.typeId;
            }
            if($routeParams.dpId!=0){
                obj[' subject.department.id']=$routeParams.dpId;
            }
            if($routeParams.topicId!=0){
                obj['subject.topic.id']=$routeParams.topicId;
            }
            if($routeParams.levelId!=0){
                obj['subject.subjectLevel.id']=$routeParams.levelId;
            }
            // console.log(obj);
            return obj;
        })();

        //调用服务方法加载题目属性信息，并且进行绑定
         $scope.isShow=false;
            $scope.selectedSubject=1;



       //subjectList和subjectManager的数据的填充
        //调用服务方法加载题目信息，并且进行绑定
        //获取所有题型
        commentService.getAllType(function(data){
           $scope.types=data;
        });
        //获取所有方向
        commentService.getAllDepartment(function(data){
            $scope.departments=data;
        });
        //获取所有知识点
        commentService.getAllTopics(function(data){
            $scope.topicss=data;
        });
        // 获取所有难度
        commentService.getAllLevel(function(data){
        $scope.levels=data;
    });




        //调用subjectService获取所有题目信息
        subjectService.getAllSubjects(subjectModel,function(data){
            //遍历所有的题目，计算出选择题的答案，并且将选择题答案赋给subject.answer
           data.forEach(function(subject){

               //获取正确答案
               //题目中的题型不等于id=3的简答题
               if(subject.subjectType && subject.subjectType.id!=3){
                   var answer=[];
                   //二重迭代
                    subject.choices.forEach(function(choice,index){
                        if(choice.correct){
                            //将索引转换为A/B/C/D
                            var no=$filter('indexToNumber')(index);
                            answer.push(no);
                        }
                    });
                   //将计算出来的正确答案赋给subject.answer,并且将对象转化为字符串
                   subject.answer=answer.toString();
               }

           });
            $scope.subjects=data;

        });

            //转换A、B、C、D
            // $scope.subjects=data;
            // $scope.choiceArr=["A","B","C","D"];

            //SubjectAdd
            //添加题目信息，给题型、方向、知识点、难度进行数据绑定
            $scope.model={
                typeId:1,
                departmentId:1,
                topicsId:1,
                levelId:1,
                choiceContent:[],
                choiceCorrect:[false,false,false,false,false],
                checkState:"未审核",
                stem:"",
                answer:"",
                analysis:""
            };
            //加载添加题目页面
            $scope.addSubject=function(){
                $location.path("/addSubject");
            };
            //
            $scope.add=function(){
                subjectService.saveSubject($scope.model,function(data){
                    console.log(data);
                });

                var model={
                    typeId:1,
                    departmentId:1,
                    topicsId:1,
                    levelId:1,
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false,false],
                    checkState:"未审核",
                    stem:"",
                    answer:"",
                    analysis:""
                };
                //重置页面
                angular.copy(model,$scope.model);
            };
            //保存并关闭
            $scope.addAndClose=function(){
                subjectService.saveSubject($scope.model,function(data){
                    console.log(data);
                    $location.path("/subjectList/dpId/0/topicId/0/levelId/0/typeId/0");
                });

            }


    }])




    //题目服务，封装操作题目的函数
    .service("subjectService",["$http","$httpParamSerializer",function($http,$httpParamSerializer){
        this.checkSubject = function (id,state,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
                }
            }).success(function (data) {
                handler(data);
            });
        };
        this.delSubject=function(id,handler){
           //传参数比较少的时候可以优先使用get()方法
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function(data){
                handler(data);
            });
        }
        this.getAllSubjects=function(params,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                params:params
            }).success(function(data){
            // $http.get("data/subjects.json").success(function(data){
                    handler(data);
                });
            };


            //添加题目
        this.saveSubject=function(params,handler){
                //将对象转换为angular参数需要的参数
                var obj={};
                for( var key in params){
                    var val=params[key];
                    switch(key){
                        case "typeId":
                            obj['subject.subjectType.id']=val;
                        break;
                        case "departmentId":
                            obj['subject.department.id']=val;
                            break;
                        case "topicsId":
                            obj['subject.topic.id']=val;
                            break;
                        case "levelId":
                            obj['subject.subjectLevel.id']=val;
                            break;
                        case "stem":
                            obj['subject.stem']=val;
                            break;
                        case "answer":
                            obj['subject.answer']=val;
                            break;
                        case "analysis":
                            obj['subject.analysis']=val;
                            break;
                        case "choiceContent":
                            obj['choiceContent']=val;
                            break;
                        case "choiceCorrect":
                            obj['choiceCorrect']=val;
                            break;
                    }

                }
                //将对象转换为表单编码样式的数据
                obj=$httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function(data){
                    handler(data);
                });
            }


    }])

    //公共服务 用于获取题目相关信息
    .factory("commentService",["$http",function($http){
        return{
          getAllType:function(handler){
               $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function(data){
              //$http.get("data/type.json").success(function(data){
                    handler(data);
              });
          },
            getAllDepartment:function(handler){
                //  $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartment/.action").success(function(data){
                $http.get("data/department.json").success(function(data){
                    handler(data);
                });
            },
            getAllTopics:function(handler){
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function(data){
                // $http.get("data/topics.json").success(function(data){
                    handler(data);
                });
            },
            getAllLevel:function(handler){
                 $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function(data){
                // $http.get("data/level.json").success(function(data){
                     handler(data);
                });
           }
        }
    }])
    //过滤department下的topics
    .filter("selectTopics",function(){
        return function(input,id){
            if(input){
                return input.filter(function(item){
                    return item.department.id==id;
                });
            }

        }
    })

    //过滤器
    .filter("indexToNumber",function(){
        return function(input){
            var result;
            switch(input){
                case 0:
                    result='A';
                    break;
                case 1:
                    result='B';
                    break;
                case 2:
                    result='C';
                    break;
                case 3:
                    result='D';
                    break;
                case 4:
                    result='E';
                    break;
                default:
                    result='F';
            }
            return result;
        }
})
    //指令
    .directive("selectOption",function(){
        return{
            restrict:"A",
            link:function(scope,element){


                element.on("change",function(){
                    var type = element.attr("type");
                    var isCheck = element.prop("checked");
                    if(type=='radio'){
                        scope.model.choiceCorrect=[false,false,false,false,false];
                        var index=$(this).val();
                        // console.log( scope.model.choiceContent);
                        scope.model.choiceCorrect[index]=true;
                    }
                    if(type=='checkbox' && isCheck){
                        var index=$(this).val();
                        // console.log( scope.model.choiceContent);
                        scope.model.choiceCorrect[index]=true;
                    }

                    //强制将scope绑定
                    scope.$digest();
                })
            }


        }
    });
