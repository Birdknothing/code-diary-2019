(function (namespace, className) {
    var api = Edbox.Api.Task;

    /**
     * Edbox 任务服务
     * @author 陈彬舰(110181)
     * */
    var module = {
        /**
         * 获取所有任务链完成人数列表  
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetAllTasksFinishCount: function (success, error) {
            api.GetTaskFinishCountList(1, "", success, error);
        },
        /**
         * 获取该任务链完成人数
         * @param {Number} task_id 	任务链id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTaskFinishCount: function (task_id, success, error) {
            api.GetTaskFinishCountList(2, task_id, success, error);
        },
        /**
         * 获取任务链下所有子任务完成人数列表
         * @param {Number} task_id 	任务链id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTaskNodeFinishCount: function (task_id, success, error) {
            api.GetTaskFinishCountList(0, task_id, success, error);
        },
        /**
         * 查询可接和已接任务列表
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        LoadTaskInfos: function (success, error) {
            api.LoadTaskInfos(Edbox.EbUserId, success, error);
        },
        /**
         * 接任务链 
         * 角色接任务链，默认接第一个任务子节点，任务子节点的任务状态为进行中
         * @param {String} task_id 任务链Id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        StartTask: function (task_id, success, error) {
            api.StartTask(Edbox.EbUserId, task_id, success, error);
        },
        /**
         * 接任务节点
         * 接任务节点，如果任务链不止一个任务子节点，则从第二个任务子节点开始调用，调用后，任务子节点的任务状态为可接变成进行中。
         * 注意：任务链的第一个任务子节点，不要调用此请求
        * @param {String} task_inst_id 任务链实例Id
        * @param {Function} success 成功回调
        * @param {Function} error 出错回调
        */
        StartTaskNode: function (task_inst_id, success, error) {
            api.StartTaskNode(Edbox.EbUserId, task_inst_id, success, error);
        },
        /**
         * 处理任务  
         * 如果任务的完成是客户端判断完成的，则调用此请求，将任务状态由进行中转成可完成。
         * 如果任务的完成是由服务端判断的，则不能调用此请求，任务完成时，服务端会推送任务完成到客户端。
         * @param {Number} task_inst_id 任务链实例id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ProcessTask: function (task_inst_id, success, error) {
            api.ProcessTask(Edbox.EbUserId, task_inst_id, success, error);
        },
        /**
         * 完成任务  
         * 执行任务完成，获取奖励，如果还有后续任务子节点，则返回后续任务子节点任务实例
         * @param {Number} task_inst_id 任务链实例id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        FinishTask: function (task_inst_id, success, error) {
            api.FinishTask(Edbox.EbUserId, task_inst_id, success, error);
        },
        /**
         * 保存任务进度  
         * 客户端任务进度数据保存
         * @param {Number} task_inst_id 任务链实例id
         * @param {String} schedule 任务进度数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        SetTaskSchedule: function (task_inst_id, schedule, success, error) {
            api.SetTaskSchedule(task_inst_id, schedule, success, error);
        },
        /**
         * 获取任务进度  
         * 获取客户端任务进度数据
         * @param {Number} task_inst_id 任务链实例id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTaskSchedule: function (task_inst_id, success, error) {
            api.GetTaskSchedule(task_inst_id, success, error);
        },
        /**
         * 获取未完成任务链
         * 获取客户端任务进度数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTaskListUndone: function (success, error) {
            api.GetTaskListByStatus(Edbox.EbUserId, 0, success, error);
        },
        /**
         * 获取已完成任务链
         * 获取客户端任务进度数据
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTaskListDone: function (success, error) {
            api.GetTaskListByStatus(Edbox.EbUserId, 1, success, error);
        }

    };
    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Action, "Task"));