(function (namespace, className) {
    /**
     * 用于Edbox任务组件的接口
     * @author 陈彬舰(110181)
     * @see 服务端接口 http://ndsdn.nd.com.cn/index.php?title=Edbox%E4%BB%BB%E5%8A%A1%E6%9C%8D%E5%8A%A1-%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3v0.1
     * */
    var module = {
        /**
         * 查询可接和已接任务列表
         * @param {Number} owner_id 拥有者Id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        LoadTaskInfos: function (owner_id, success, error) {
            var url = "/v0.1/api/task/role_task/actions/load_task";
            var data = new Object();
            data.owner_id = owner_id;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 接任务链 
         * 角色接任务链，默认接第一个任务子节点，任务子节点的任务状态为进行中
         * @param {Number} owner_id 拥有者Id
         * @param {String} task_id 任务链Id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        StartTask: function (owner_id, task_id, success, error) {
            var url = "/v0.1/api/task/role_task/actions/start_task";
            var data = new Object();
            data.owner_id = owner_id;
            data.task_id = task_id;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 接任务节点 
         * 接任务节点，如果任务链不止一个任务子节点，则从第二个任务子节点开始调用，调用后，任务子节点的任务状态为可接变成进行中。
         * 注意：任务链的第一个任务子节点，不要调用此请求
         * @param {Number} owner_id 拥有者Id
         * @param {Number} task_inst_id 任务链实例id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        StartTaskNode: function (owner_id, task_inst_id, success, error) {
            var url = "/v0.1/api/task/role_task/actions/start_task_node";
            var data = new Object();
            data.owner_id = owner_id;
            data.task_inst_id = task_inst_id;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 处理任务  
         * 如果任务的完成是客户端判断完成的，则调用此请求，将任务状态由进行中转成可完成。
         * 如果任务的完成是由服务端判断的，则不能调用此请求，任务完成时，服务端会推送任务完成到客户端。
         * @param {Number} owner_id 拥有者Id
         * @param {Number} task_inst_id 任务链实例id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        ProcessTask: function (owner_id, task_inst_id, success, error) {
            var url = "/v0.1/api/task/role_task/actions/process_task";
            var data = new Object();
            data.owner_id = owner_id;
            data.task_inst_id = task_inst_id;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 完成任务  
         * 执行任务完成，获取奖励，如果还有后续任务子节点，则返回后续任务子节点任务实例
         * @param {Number} owner_id 拥有者Id
         * @param {Number} task_inst_id 任务链实例id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        FinishTask: function (owner_id, task_inst_id, success, error) {
            var url = "/v0.1/api/task/role_task/actions/finish_task";
            var data = new Object();
            data.owner_id = owner_id;
            data.task_inst_id = task_inst_id;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
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
            var url = "/v0.1/api/task/role_task/actions/set_task_schedule";
            var data = new Object();
            data.task_inst_id = task_inst_id;
            data.schedule = schedule;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 获取任务进度  
         * 获取客户端任务进度数据
         * @param {Number} task_inst_id 任务链实例id
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTaskSchedule: function (task_inst_id, success, error) {
            var url = "/v0.1/api/task/role_task/actions/get_task_schedule";
            var data = new Object();
            data.task_inst_id = task_inst_id;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 获取任务完成人数列表  
         * @param {Number} count_type 统计类型，可不填值默认0表示获取租户任务链的所有节点任务。值1标识获取所有任务链完成的人数
         * @param {Number} task_id 	任务链id，当count_type为1时task_id必填
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTaskFinishCountList: function (count_type, task_id, success, error) {
            var url = "/v0.1/api/task/role_task/actions/get_task_finish_count_list";
            var data = new Object();
            data.count_type = count_type;
            data.task_id = task_id;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        },
        /**
         * 根据状态获取任务链列表
         * @param {Number} owner_id 拥有者Id
         * @param {Number} status 	状态，1表示获取未完成任务链，
         * @param {Function} success 成功回调
         * @param {Function} error 出错回调
         */
        GetTaskListByStatus: function (owner_id, status, success, error) {
            var url = "/v0.1/api/task/role_task/actions/get_task_list_by_status";
            var data = new Object();
            data.owner_id = owner_id;
            data.status = status;
            Edbox.Request.Post(Edbox.GetHost('MMO'), url, JSON.stringify(data), success, error);
        }
    };

    if (namespace && className && !namespace[className]) {
        namespace[className] = module;
    }
}(Edbox.Api, "Task"));