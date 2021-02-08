(function (namespace, className) {
    // todo 保存 获取任务进度
    var action = Edbox.Action.Task;

    // 任务链ID -> 任务链数据 字典
    var TaskDatas = {};

    // 子任务ID -> 子任务数据 字典
    var NodeDatas = {};

    // 步骤ID -> 步骤数据 字典
    var StepDatas = {};

    // 步骤类别结构及映射
    var StepTypeDatas = {};

    // 已接任务链ID -> 已接任务链实例ID
    var accInstIDMap = {};

    // 任务链ID -> 任务ID -> 任务数据 索引映射
    var TaskToNodeMap = {};

    // 任务链ID->任务ID-> 步骤ID -> 步骤信息
    var TaskToNodeToStepMap = {};

    var TaskInst字段定义 = {
        TaskID: 1000,
        NodeID: 10001,
        NodeState: 0,
        TaskFinish: 0
    };

    var TaskToNodeMap字段定义 =
    {
        "1000": {
            "1001": {},
            "1002": {}
        }
    };

    var TaskToNodeToStepMap字段定义 = {
        "1000": {
            "1001": {
                "10011": {}
            }
        }
    };

    var TaskDatas字段定义 =
    {
        task_id: {
            task_inst_id: "",     // + 实例ID (s)
            Type: "",             // + 任务链所属分类 (c)
            Count: 0,             // + 任务链进度 int类型 (s)
            Total: 0,             // + 任务链子任务个数 int类型 (c)
            State: 0,             // + 任务链状态 int类型 -1不可接  0可接  1进行中  2可完成 3已完成(s)
            ID: "558000",
            Name: "BubbleShoot",
            ShowName: "任务链1",
            Image: "",
            ImageGUID: "",
            Description: "测试任务链1描述",
            Datas: [
                {
                    Count: 0,     // + 子任务进度 int类型 (保存进度在服务端)
                    Total: 0,     // + 子任务步骤个数 int类型 (c)
                    State: 0,     // + 子任务状态 int类型 -1不可接  0可接  1进行中  2可完成 3已完成 (s) 
                    ParentTaskID: "558000",     // + 父任务链ID
                    ID: "534001",
                    Name: "ChangeStyle",
                    ShowName: "任务链1-子任务1",
                    Description: "测试子任务1描述",
                    Image: "",
                    ImageGUID: "",
                    Rewards: {
                        exp: 100,
                        money: 100,
                        items: []
                    },
                    Datas: [
                        {
                            Count: 0,                   // + 子任务进度 int类型 (保存进度在服务端)
                            ParentNodeID: "534001",     // + 父子任务ID
                            ParentTaskID: "558000",     // + 父任务链ID
                            ID: "5340011",
                            Type: "OpenEditor",
                            Guid: "123124",
                            Total: 5
                        }
                    ]
                }
            ]
        }
    };

    /**
     * 初始化步骤类别结构及映射
     * @param {Object} data 递归节点数据
     * @param {Object} taskData 任务链节点数据
     * @param {Object} taskNodeData 任务节点数据
     */
    var InitStepTypeDatas = function (data, taskData, taskNodeData) {
        if (data.Datas) {
            for (var i in data.Datas) {
                var tmpData = data.Datas[i];
                if (!taskData)
                    InitStepTypeDatas(tmpData, tmpData);
                if (taskData)
                    InitStepTypeDatas(tmpData, taskData, data);
            }
        }
        else {
            data.Count = 0; // 添加Count字段
            data.ParentNodeID = taskNodeData.ID;
            data.ParentTaskID = taskData.ID;

            StepTypeDatas[data.Type] ? "" : StepTypeDatas[data.Type] = [];
            StepTypeDatas[data.Type].push({
                Guid: data.Guid,
                Step: data,
                TaskNode: taskNodeData,
                Task: taskData
            });
            StepDatas[data.ID] = data; // 建立步骤字典
        }
    };

    /**
     * 更新任务数据结构TaskDatas
     * @param {Function} success 成功回调
     * @param {Function} error 出错回调
     */
    var UpdateTaskDatas = function (success, error) {
        // 获取未完成任务数据 补充基础任务结构TaskDatas信息
        action.LoadTaskInfos(function (data) {
            var avlTasksArr = data.arr_task_id;   // 可接任务数组 [1000,2000,3000]
            var accTasksArr = data.arr_task_inst; // 已接任务数组 [{...}]

            // 处理可接任务链
            (function () {
                for (var i in avlTasksArr) {
                    var curTaskID = avlTasksArr[i];
                    var curTask = TaskDatas[curTaskID];

                    curTask.Count = 0;
                    curTask.State = 0;
                }
            }());

            // 处理已接任务链
            (function () {
                for (var i in accTasksArr) {
                    HandleInst(accTasksArr[i]);
                }
            }());

            // 获取已完成任务数据 补充基础任务结构TaskDatas信息
            action.GetTaskListDone(function (data) {
                // 处理已完成任务链
                var doneTasksArr = data.task_id_array;
                for (var i in doneTasksArr) {
                    if (TaskDatas[doneTasksArr[i]]) {
                        TaskDatas[doneTasksArr[i]].Count = TaskDatas[doneTasksArr[i]].Total;
                        TaskDatas[doneTasksArr[i]].State = 3;
                    }
                }
                console.table(avlTasksArr);
                console.table(accTasksArr);
                console.table(doneTasksArr);
                if (success)
                    success(TaskDatas);
            });
        }, error);
    };

    /**
     * 处理服务器返回的inst任务链实例对象
     * @param {Object} data inst任务链实例对象
     */
    var HandleInst = function (data) {
        var curTaskID = data.task_id;
        var curTaskNodeID = data.task_node_id;

        var curTask = TaskDatas[curTaskID];
        if (!curTask)
            return;
        var curTaskNode = {};

        var nodeCount = 0; // 已完成的任务个数
        // 处理子任务的状态
        for (var nodeInd in curTask.Datas) {
            curTaskNode = TaskToNodeMap[curTaskID][curTask.Datas[nodeInd].ID];

            // 处理当前进行的子任务
            if (curTask.Datas[nodeInd].ID === curTaskNodeID) {
                curTaskNode.State = data.task_node_status;
                break;
            }
            // 处理已进行的子任务
            else {
                curTaskNode.State = 3;
                nodeCount++;
            }
        }

        curTask.Count = nodeCount;

        curTask.State = 1;

        if (data.finish === 1) {
            // 弹出任务链完成
            curTask.State = 1;
        }

        curTask.task_inst_id = data.id;

        accInstIDMap[data.task_id] = data.id; //任务链id -> 任务链实例id 映射

        // 同步服务器步骤信息
        module.GetTaskSchedule(data.task_id);
    };

    var module = {
        /**
         * 获取完整的任务数据结构 TaskDatas
         * 生成任务数据结构
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTaskDatas: function (success, error) {
            if (JSON.stringify(TaskDatas) !== "{}") {
                UpdateTaskDatas(success, error);
                return;
            }
            $.ajax({
                type: "GET",
                url: "/configs/TaskConfig.json",
                dataType: "json",
                success: function (data) {
                    if (!data.Tasks || data.Tasks.length === 0) {
                        console.error("TaskJson配置错误");
                        return;
                    }
                    // 初始化 基础任务结构TaskDatas 、建立索引TaskToNodeMap
                    for (var i in data.Tasks) {
                        var curTaskType = data.Tasks[i];
                        // 初始化步骤类别结构及映射
                        InitStepTypeDatas(curTaskType);

                        for (var j in curTaskType.Datas) {
                            var curTask = curTaskType.Datas[j];
                            curTask.Type = curTaskType.Type;         // 任务链所属分类
                            curTask.Total = curTask.Datas.length;    // 子任务数量

                            TaskToNodeMap[curTask.ID] = {};
                            TaskToNodeToStepMap[curTask.ID] = {};

                            TaskDatas[curTask.ID] = curTask;    // 建立任务链字典

                            for (var k in curTask.Datas) {
                                var curTaskNode = curTask.Datas[k];
                                curTaskNode.Count = 0;                              // 子任务进度
                                curTaskNode.Total = curTaskNode.Datas.length;       // 步骤数量
                                curTaskNode.ParentTaskID = curTask.ID;              // 父链ID

                                NodeDatas[curTaskNode.ID] = curTaskNode;  // 建立子任务字典

                                TaskToNodeMap[curTask.ID][curTaskNode.ID] = curTaskNode;
                                TaskToNodeToStepMap[curTask.ID][curTaskNode.ID] = {};

                                for (var m in curTaskNode.Datas) {
                                    var curStep = curTaskNode.Datas[m];
                                    TaskToNodeToStepMap[curTask.ID][curTaskNode.ID][curStep.ID] = curStep;
                                }
                            }
                        }
                    }
                    // 获取服务器信息 更新任务结构
                    UpdateTaskDatas(success, error);
                },
                error: function (err) {
                    console.error(err);
                }
            });
        },

        /**
         * 接任务链
         * @param {Number} task_id 任务链Id
         * @param {Function} success 成功回调 回调数据
         * @param {Function} error 出错回调
         */
        StartTask: function (task_id, success, error) {
            task_id -= 0;
            action.StartTask(task_id, function (data) {
                UpdateTaskDatas();
                var TaskInst = {
                    "TaskID": data.task_id,
                    "NodeID": data.task_node_id,
                    "NodeState": data.task_node_status,
                    "TaskFinish": data.finish
                };
                if (success) success(TaskInst);
            }, error);
        },

        /**
         * 接任务节点
         * @param {Number} task_id 任务链Id
         * @param {Function} success 成功回调 回调数据
         * @param {Function} error 出错回调
         */
        StartTaskNode: function (task_id, success, error) {
            action.StartTaskNode(accInstIDMap[task_id], function (data) {
                UpdateTaskDatas();
                var TaskInst = {
                    "TaskID": data.task_id,
                    "NodeID": data.task_node_id,
                    "NodeState": data.task_node_status,
                    "TaskFinish": data.finish
                };
                if (success) success(TaskInst);
            }, error);
        },

        /**
         * 步骤操作埋点
         * @param {String} type 操作（步骤）的类型
         * @param {String} guid 所属游戏
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        EventTrack: function (type, guid, success, error) {
            var curStep = StepTypeDatas[type];
            for (var i = 0; i < curStep.length; i++) {
                // 【任务链】 不在【进行中】状态
                if (curStep[i].Task.State !== 1)
                    return;

                // 【子任务】 不在【进行中】
                if (curStep[i].TaskNode.State !== 1)
                    continue;

                // 步骤已达到要求
                if (curStep[i].Step.Count >= curStep[i].Step.Total)
                    continue;

                // 完成特定步骤 / 完成通用步骤
                if (curStep[i].Guid === guid || curStep[i].Guid === "") {
                    curStep[i].Step.Count += 1;
                    (function (ind) {
                        module.SetTaskSchedule(curStep[ind].Step.ParentTaskID, function (data) {
                            // 步骤目标达成
                            // 更新步骤 ->子任务完成情况
                            if (curStep[ind].Step.Count >= curStep[ind].Step.Total) {
                                if (curStep[ind].TaskNode.Count < curStep[ind].TaskNode.Total)
                                    curStep[ind].TaskNode.Count++;
                                // 更新子任务 -> 任务链完成情况
                                if (curStep[ind].TaskNode.Count >= curStep[ind].TaskNode.Total) {
                                    // 向服务器发起完成子任务请求
                                    (function (nind) {
                                        action.ProcessTask(curStep[nind].Task.task_inst_id, function (data) {
                                            if (curStep[nind].Task.Count < curStep[nind].Task.Total)
                                                curStep[nind].Task.Count++;
                                            if (curStep[nind].Task.Count >= curStep[nind].Task.Total)
                                                curStep[nind].Task.State = 2;
                                            HandleInst(data);
                                            if (success) success(TaskDatas);
                                        }, error);
                                    }(ind));
                                }

                                else {
                                    if (success) success(TaskDatas);
                                }
                            }

                            else {
                                if (success) success(TaskDatas);
                            }
                        }, error);
                    }(i));
                }
                else {
                    if (success) success(TaskDatas);
                }
            }
        },

        /**
         * 领取任务奖励
         * @param {Number} task_id 任务链id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        FinshTaskNode: function (task_id, success, error) {
            action.FinishTask(accInstIDMap[task_id], function (data) {
                HandleInst(data.inst);
                UpdateTaskDatas();
                if (data.inst.task_node_status === 0)
                    // todo 自动接子任务
                    module.StartTaskNode(task_id);
                if (success)
                    success(data.reward);
            }, error);
        },

        /**
         * 保存该任务链下 任务步骤进度
         * @param {Number} task_id 任务链ID 
         * @param {Function} success 成功回调 
         * @param {Function} error 失败回调
         */
        SetTaskSchedule: function (task_id, success, error) {
            // 转换为保存的结构
            var tmp = {};
            for (var task in TaskToNodeToStepMap) {
                tmp[task] = {};
                for (var node in TaskToNodeToStepMap[task]) {
                    tmp[task][node] = {};
                    for (var step in TaskToNodeToStepMap[task][node])
                        tmp[task][node][step] = TaskToNodeToStepMap[task][node][step].Count;
                }
            }

            var schedule = JSON.stringify(tmp);
            action.SetTaskSchedule(accInstIDMap[task_id], schedule, success, error);
        },

        /**
         * 获取该任务链下 任务步骤进度
         * @param {Number} task_id 任务链ID 
         * @param {Function} success 成功回调 
         * @param {Function} error 失败回调
         */
        GetTaskSchedule: function (task_id, success, error) {
            action.GetTaskSchedule(accInstIDMap[task_id], function (data) {
                if (!data || !data.schedule || data.schedule === "")
                    return;

                var schedule = JSON.parse(data.schedule);
                if (!schedule)
                    return;
                // 解析同步步骤信息
                for (var task in schedule) {
                    for (var node in schedule[task]) {
                        for (var step in schedule[task][node])
                            TaskToNodeToStepMap[task][node][step].Count = schedule[task][node][step];
                    }
                }
                if (success)
                    success(schedule);
            }, error);
        }
    };

    module.TaskDatas = TaskDatas;
    module.NodeDatas = NodeDatas;
    module.StepDatas = StepDatas;
    module.StepTypeDatas = StepTypeDatas;
    module.accInstIDMap = accInstIDMap;
    module.TaskToNodeMap = TaskToNodeMap;
    module.TaskToNodeToStepMap = TaskToNodeToStepMap;

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox, "Task"));