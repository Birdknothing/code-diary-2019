var Code = {
    Json: null,

    // 获取Wiki地址
    GetWiki: function (com) {
        var wiki = "http://ndsdn.nd.com.cn/index.php?title=";
        var index = com.indexOf("#");
        if (index < 0) {
            wiki += com;
        }
        else {
            var hash = com.substring(index + 1);
            wiki += com.substring(0, index);
            wiki += "#";
            wiki += encodeURIComponent(hash).replace(/%/g, ".");
        }
        return wiki;
    },

    // 开始生成
    StartGenerate: function (file, generate, error) {
        try {
            if (file) {
                Code.Read(file, generate, error);
            }
            else {
                generate(Code.Json);
            }
        } catch (e) {
            if (error) {
                error("Json格式错误,生成失败");
            }
        }
    },

    // 获取Js/Ts类型
    GetJsType: function (data, isSummary) {
        if (!data) return "void";

        if (Array.isArray(data)) {
            var keys = "";
            for (var i = 0; i < data.length; i++) {
                if (i > 0) {
                    keys += ", ";
                }
                keys += Code.GetJsType(data[i]);
            }
            return keys;
        }

        var type = data.Type;
        if (!type) return "void";

        if (type === "Text" || type === "LongText" || type === "Image" || type === "Audio") return isSummary ? "String" : "string";
        if (type === "Int" || type === "Float" || type === "Double") return isSummary ? "Number" : "number";
        if (type === "Enum") return isSummary ? "Number" : "number";
        if (type === "DateTime") return "Date";
        if (type === "Function") return "Function";
        if (type === "Boolean") return isSummary ? "Boolean" : "boolean";
        if (type === "Array") {
            if (isSummary) return "Array";
            return "Array<" + Code.GetJsType(data.ArrayType) + ">";
        }
        if (type === "Map") return "Dictionary";
        return isSummary ? "Object" : "object";
    },

    // 获取Js/Ts默认值
    GetJsDefaultValue: function (data) {
        var type = data.Type;
        var value = data.Value;
        if (type === "Text" || type === "LongText") {
            return "\"" + value + "\"";
        }
        if (type === "Image" || type === "Audio") return "\"\"";
        if (type === "Json") return "null";
        if (type === "Int" || type === "Float" || type === "Double") return value - 0;
        if (type === "DateTime") return "null";
        if (type === "Boolean") return value;
        if (type === "Array") {
            return "new Array()";
        }
        if (type === "Map") {
            return "new Dictionary()";
        }
        if (type === "Enum") {
            return data.Name + "Enum." + data.EnumType[0];
        }
        return "null";
    },

    // 获取C#类型
    GetCSharpType: function (data) {
        if (!data) return "void";

        if (Array.isArray(data)) {
            var keys = "";
            for (var i = 0; i < data.length; i++) {
                if (i > 0) {
                    keys += ", ";
                }
                keys += Code.GetCSharpType(data[i]);
            }
            return keys;
        }

        var type = data.Type;
        if (!type) return "void";

        if (type === "Text" || type === "LongText" || type === "Image" || type === "Audio") {
            return "string";
        }
        if (type === "Json") return "JsonData";
        if (type === "Int") return "int";
        if (type === "Float") return "float";
        if (type === "Double") return "double";
        if (type === "DateTime") return "DateTime";
        if (type === "Boolean") return "bool";
        if (type === "Function") {
            if (data.FunctionType) {
                if (data.FunctionReturnType) {
                    return "Func<" + Code.GetCSharpType(data.FunctionType) + ", " + Code.GetCSharpType(data.FunctionReturnType) + ">";
                }
                return "Action<" + Code.GetCSharpType(data.FunctionType) + ">";
            }
            else {
                return "Action";
            }
        }
        if (type === "Array") {
            return "List<" + Code.GetCSharpType(data.ArrayType) + ">";
        }
        if (type === "Map") {
            return "Dictionary<" + Code.GetCSharpType(data.MapType) + ">";
        }
        if (type === "Enum") {
            return data.Name + "Enum";
        }
        if (type === "Object") {
            return "object";
        }
        return type;
    },

    // 获取C#默认值
    GetCSharpDefaultValue: function (data) {
        var type = data.Type;
        var value = data.Value;
        if (type === "Text" || type === "LongText") {
            return "\"" + value + "\"";
        }
        if (type === "Image" || type === "Audio") return "\"\"";
        if (type === "Json") return "null";
        if (type === "Int" || type === "Float" || type === "Double") return value - 0;
        if (type === "DateTime") return "default(DateTime)";
        if (type === "Boolean") return value;
        if (type === "Array") {
            return "new List<" + Code.GetCSharpType(data.ArrayType) + ">()";
        }
        if (type === "Map") {
            return "new Dictionary<" + Code.GetCSharpType(data.MapType) + ">()";
        }
        if (type === "Enum") {
            return data.Name + "Enum." + data.EnumType[0];
        }
        return "null";
    },

    // 获取默认类型
    GetBaseType: function (data) {
        if (!data) return "void";

        if (Array.isArray(data)) {
            var keys = "";
            for (var i = 0; i < data.length; i++) {
                if (i > 0) {
                    keys += ", ";
                }
                keys += Code.GetBaseType(data[i]);
            }
            return keys;
        }

        var type = data.Type;
        if (!type) return "void";
        return type;
    },

    // 生成js
    GenerateJS: function (file, success, error) {
        // 代码文本
        var text = "";

        // 清空
        function clear() {
            text = "";
        }

        // 换行
        function newline() {
            text += "\n";
        }

        // 格式
        function tab(cnt) {
            for (var i = 0; i < cnt; i++) {
                text += "    ";
            }
        }

        // 书写内容
        function add(txt, tabcnt) {
            if (tabcnt) {
                tab(tabcnt);
            }
            text += txt;
        }

        // 书写一行
        function addline(line, tabcnt) {
            add(line, tabcnt);
            newline();
        }

        // 获取时间
        function getdate() {
            var date = new Date();
            var yyyy = date.getFullYear();// 年
            var MM = date.getMonth() + 1;//月份 
            var dd = date.getDate(); //日
            var HH = date.getHours();//小时
            var mm = date.getMinutes();//分 
            var ss = date.getSeconds();//秒

            MM = MM > 9 ? MM : "0" + MM;
            dd = dd > 9 ? dd : "0" + dd;
            HH = HH > 9 ? HH : "0" + HH;
            mm = mm > 9 ? mm : "0" + mm;
            ss = ss > 9 ? ss : "0" + ss;

            return yyyy + "年" + MM + "月" + dd + "日 " + HH + ":" + mm + ":" + ss;
        }

        // 添加参数
        function addDatas(datas, isStatic, classname) {
            // 备注
            function addSummary(data, tabcount) {
                addline("/**", tabcount);
                addline(" * " + data.ChineseName, tabcount);
                addline(" * " + data.EnglishName, tabcount);
                addline(" * Type : " + data.Type, tabcount);
                if (data[data.Type + "Type"]) {
                    addline(" * " + data.Type + "Type" + " : " + Code.GetBaseType(data[data.Type + "Type"], true), tabcount);
                }
                if (data.Type === "Function" && data.FunctionReturnType) {
                    addline(" * Function Return Type" + " : " + Code.GetBaseType(data.FunctionReturnType, true), tabcount);
                }
                addline(" * Default Value : " + data.Value, tabcount);
                addline(" */", tabcount);
            }

            // 获取默认值
            function getValue(data) {
                return Code.GetJsDefaultValue(data);
            }

            // 添加枚举
            function addEnum(data, tabcount) {
                if (data.Type !== "Enum") return;
                var list = data.EnumType;
                newline();
                addline("/**", tabcount);
                addline(" * " + data.ChineseName + "枚举", tabcount);
                addline(" * " + data.EnglishName + " Enum", tabcount);
                addline(" */", tabcount);
                addline("var " + data.Name + "Enum = {", tabcount);
                for (var i = 0; i < list.length; i++) {
                    addline("/**", tabcount + 1);
                    addline(" * " + list[i], tabcount + 1);
                    addline(" */", tabcount + 1);
                    if (i === list.length - 1) {
                        addline(list[i] + " : " + i, tabcount + 1);
                    } else {
                        addline(list[i] + " : " + i + ",", tabcount + 1);
                    }
                }
                addline("};", tabcount);
            }

            if (!datas || datas.length < 1) return;

            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                if (data.Type === "Enum") {
                    addEnum(data, 1);
                }

                if (i !== 0) {
                    newline();
                }
                addSummary(data, isStatic ? 0 : 1);
                var value = getValue(data);
                if (!isStatic) {
                    addline("this." + data.Name + " = obj && obj." + data.Name + " || " + value + ";", 1);
                }
                else {
                    addline("Edbox." + classname + "." + data.Name + " = " + value + ";", 0);
                }
            }
        }

        // 添加方法
        function addFunctions(datas, isStatic, classname) {
            function GetKeyType(data) {
                return Code.GetJsType(data, true);
            }

            // 备注
            function addSummary(data, tabcount) {
                addline("/**", tabcount);
                addline(" * " + data.ChineseName, tabcount);
                addline(" * " + data.EnglishName, tabcount);
                if (data.Keys && data.Keys.length > 0) {
                    for (var i = 0; i < data.Keys.length; i++) {
                        var key = data.Keys[i];
                        var line = " * @param {" + GetKeyType(key) + "} " + key.Name + " " + (key.Description || "");
                        if (key[key.Type + "Type"]) {
                            var type = key[key.Type + "Type"];
                            line += " , " + "带" + key.Type + "参数" + Code.GetBaseType(type);
                        }
                        if (key.Type === "Function" && key.FunctionReturnType) {
                            line += " , " + "方法返回类型 :" + Code.GetBaseType(key.FunctionReturnType);
                        }
                        line += " , " + (key.AllowEmpty ? "允许为空" : "不允许为空");
                        addline(line, tabcount);
                    }
                }

                if (data.Return && data.Return.Type) {
                    addline(" * @returns {" + GetKeyType(data.Return) + "} " + (data.Return.Description || "") + (data.Return[data.Return.Type + "Type"] ? " , 队列类型 : " + Code.GetBaseType(data.Return[data.Return.Type + "Type"]) : ""), tabcount);
                }
                addline(" */", tabcount);
            }

            if (!datas || datas.length < 1) return;

            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];

                if (i !== 0) {
                    newline();
                }
                addSummary(data, 0);

                if (isStatic) {
                    add("Edbox." + classname + "." + data.Name + " = function(");
                } else {
                    add("Edbox." + classname + ".prototype." + data.Name + " = function(");
                }
                if (data.Keys && data.Keys.length > 0) {
                    for (var j = 0; j < data.Keys.length; j++) {
                        if (j !== 0) {
                            add(", ");
                        }
                        add(data.Keys[j].Name);
                    }
                }
                addline("){");

                if (data.Return && data.Return.Type) {
                    addline("return null;", 1);
                }

                addline("};", 0);
            }
        }

        // 生成代码
        function generate(json) {
            if (!json) {
                if (error) {
                    error("No Json");
                }
                return;
            }

            var keys = Object.keys(json);
            if (keys.length === 0) {
                if (error) {
                    error("No Data");
                }
                return;
            }

            // 类备注
            function addClassSummary(data, tabcount) {
                addline("/**", tabcount);
                addline(" * " + data.ComponentName.replace(/#/g, ""), tabcount);
                addline(" * " + data.Description, tabcount);
                addline(" * @author " + data.Author, tabcount);
                addline(" * @version " + data.Versions[0].Name + " (" + getdate() + ")", tabcount);
                addline(" * @see " + Code.GetWiki(data.ComponentName), tabcount);
                addline(" * @param {Object} obj 参数对象", tabcount);
                addline(" * @returns {Object} 组件", tabcount);
                addline(" * Depend:", tabcount);
                for (var i = 0; i < data.Depend.length; i++) {
                    addline(" *      " + data.Depend[i].Name + ":" + Code.GetWiki(data.Depend[i].Wiki), tabcount);
                }
                addline(" * */", tabcount);
            }

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = json[key];

                if (!value.Name || !value.ComponentName || !value.Author || !value.Versions || !value.Datas || !value.Depend) {
                    if (error) {
                        error("Class '" + key + "' Format Error");
                    }
                    continue;
                }

                if (i > 0) {
                    newline();
                }

                addClassSummary(value, 0);
                addline("Edbox." + key + " = function (obj) {");
                addline("    var self = this;");
                newline();
                addDatas(value.Datas, false, key);
                newline();
                addline("    return this;");
                addline("};", 0);
                newline();
                addFunctions(value.Functions, false, key);
                newline();
                addDatas(value.StaticDatas, true, key);
                newline();
                addFunctions(value.StaticFunctions, true, key);
            }

            if (success) {
                success(text, "Edbox_" + keys[0] + ".js");
            }
        }

        Code.StartGenerate(file, generate, error);
    },

    // 生成d.ts
    GenerateDts: function (file, success, error) {
        // 代码文本
        var text = "";

        // 清空
        function clear() {
            text = "";
        }

        // 换行
        function newline() {
            text += "\n";
        }

        // 格式
        function tab(cnt) {
            for (var i = 0; i < cnt; i++) {
                text += "    ";
            }
        }

        // 书写内容
        function add(txt, tabcnt) {
            if (tabcnt) {
                tab(tabcnt);
            }
            text += txt;
        }

        // 书写一行
        function addline(line, tabcnt) {
            add(line, tabcnt);
            newline();
        }

        // 获取时间
        function getdate() {
            var date = new Date();
            var yyyy = date.getFullYear();// 年
            var MM = date.getMonth() + 1;//月份 
            var dd = date.getDate(); //日
            var HH = date.getHours();//小时
            var mm = date.getMinutes();//分 
            var ss = date.getSeconds();//秒

            MM = MM > 9 ? MM : "0" + MM;
            dd = dd > 9 ? dd : "0" + dd;
            HH = HH > 9 ? HH : "0" + HH;
            mm = mm > 9 ? mm : "0" + mm;
            ss = ss > 9 ? ss : "0" + ss;

            return yyyy + "年" + MM + "月" + dd + "日 " + HH + ":" + mm + ":" + ss;
        }

        // 添加参数
        function addDatas(datas, isStatic) {
            // 备注
            function addSummary(data, tabcount) {
                addline("/**", tabcount);
                addline(" * " + data.ChineseName, tabcount);
                addline(" * " + data.EnglishName, tabcount);
                addline(" * Type : " + data.Type, tabcount);
                if (data[data.Type + "Type"]) {
                    addline(" * " + data.Type + "Type" + " : " + Code.GetBaseType(data[data.Type + "Type"], true), tabcount);
                }
                if (data.Type === "Function" && data.FunctionReturnType) {
                    addline(" * Function Return Type" + " : " + Code.GetBaseType(data.FunctionReturnType, true), tabcount);
                }
                addline(" * Default Value : " + data.Value, tabcount);
                addline(" */", tabcount);
            }

            function GetKeyType(data) {
                return Code.GetJsType(data, false);
            }

            if (!datas || datas.length < 1) return;

            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];

                if (i !== 0) {
                    newline();
                }
                addSummary(data, 2);
                var type = GetKeyType(data);
                addline("public " + (isStatic ? "static " : "") + data.Name + ": " + type + ";", 2);
            }
        }

        // 添加方法
        function addFunctions(datas, isStatic) {
            function GetKeyType(data, isSummary) {
                return Code.GetJsType(data, isSummary);
            }

            // 备注
            function addSummary(data, tabcount) {
                addline("/**", tabcount);
                addline(" * " + data.ChineseName, tabcount);
                addline(" * " + data.EnglishName, tabcount);
                if (data.Keys && data.Keys.length > 0) {
                    for (var i = 0; i < data.Keys.length; i++) {
                        var key = data.Keys[i];
                        var line = " * @param {" + GetKeyType(key) + "} " + key.Name + " " + (key.Description || "");
                        if (key[key.Type + "Type"]) {
                            var type = key[key.Type + "Type"];
                            line += " , " + "带" + key.Type + "参数" + Code.GetBaseType(type);
                        }
                        if (key.Type === "Function" && key.FunctionReturnType) {
                            line += " , " + "方法返回类型 :" + Code.GetBaseType(key.FunctionReturnType);
                        }
                        line += " , " + (key.AllowEmpty ? "允许为空" : "不允许为空");
                        addline(line, tabcount);
                    }
                }

                if (data.Return && data.Return.Type) {
                    addline(" * @returns {" + GetKeyType(data.Return, true
                    ) + "} " + (data.Return.Description || "") + (data.Return[data.Return.Type + "Type"] ? " , 队列类型 : " + Code.GetBaseType(data.Return[data.Return.Type + "Type"]) : ""), tabcount);
                }
                addline(" */", tabcount);
            }

            if (!datas || datas.length < 1) return;

            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];

                if (i !== 0) {
                    newline();
                }
                addSummary(data, 2);

                add("public " + (isStatic ? "static " : "") + data.Name + "(", 2);
                if (data.Keys && data.Keys.length > 0) {
                    for (var j = 0; j < data.Keys.length; j++) {
                        if (j !== 0) {
                            add(", ");
                        }
                        add(data.Keys[j].Name + (data.Keys[j].AllowEmpty ? "?" : "") + ": " + GetKeyType(data.Keys[j], false));
                    }
                }
                add("): ");

                if (data.Return && data.Return.Type) {
                    addline(GetKeyType(data.Return, false) + ";");
                }
                else {
                    addline("void;");
                }
            }
        }

        // 生成代码
        function generate(json) {
            if (!json) {
                if (error) {
                    error("No Json");
                }
                return;
            }

            var keys = Object.keys(json);

            if (keys.length === 0) {
                if (error) {
                    error("No Data");
                }
                return;
            }

            // 类备注
            function addClassSummary(data, tabcount) {
                addline("/**", tabcount);
                addline(" * " + data.ComponentName.replace(/#/g, ""), tabcount);
                addline(" * " + data.Description, tabcount);
                addline(" * @author " + data.Author, tabcount);
                addline(" * @version " + data.Versions[0].Name + " (" + getdate() + ")", tabcount);
                addline(" * @see " + Code.GetWiki(data.ComponentName), tabcount);
                addline(" * @param {Object} obj 参数对象", tabcount);
                addline(" * @returns {Object} 组件", tabcount);
                addline(" * Depend:", tabcount);
                for (var i = 0; i < data.Depend.length; i++) {
                    addline(" *      " + data.Depend[i].Name + ":" + Code.GetWiki(data.Depend[i].Wiki), tabcount);
                }
                addline(" * */", tabcount);
            }

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = json[key];

                if (!value.Name || !value.ComponentName || !value.Author || !value.Versions || !value.Datas || !value.Depend) {
                    if (error) {
                        error("Class '" + key + "' Format Error");
                    }
                    continue;
                }

                if (i > 0) {
                    newline();
                }

                var classname = key;
                var nb = "";
                if (key.lastIndexOf(".") > 0) {
                    nb = "." + key.substring(0, key.lastIndexOf("."));
                    classname = key.substring(key.lastIndexOf(".") + 1);
                }

                addline("declare module Edbox" + nb + " {");
                addClassSummary(value, 1);
                addline("class " + classname + " {", 1);
                addline("/**", 2);
                addline(" * 创建一个组件实例", 2);
                addline(" */", 2);
                addline("constructor(obj?: object);", 2);
                newline();
                addDatas(value.Datas, false);
                newline();
                addFunctions(value.Functions, false);
                newline();
                addDatas(value.StaticDatas, true);
                newline();
                addFunctions(value.StaticFunctions, true);
                addline("}", 1);
                addline("}", 0);
            }

            if (success) {
                success(text, "Edbox_" + keys[0] + ".d.ts");
            }
        }

        Code.StartGenerate(file, generate, error);
    },

    // 生成C#
    GenerateCSharp: function (file, success, error) {
        // 代码文本
        var text = "";

        // 清空
        function clear() {
            text = "";
        }

        // 换行
        function newline() {
            text += "\n";
        }

        // 格式
        function tab(cnt) {
            for (var i = 0; i < cnt; i++) {
                text += "    ";
            }
        }

        // 书写内容
        function add(txt, tabcnt) {
            if (tabcnt) {
                tab(tabcnt);
            }
            text += txt;
        }

        // 书写一行
        function addline(line, tabcnt) {
            if (tabcnt) {
                tab(tabcnt);
            }
            text += line;
            newline();
        }

        // 获取时间
        function getdate() {
            var date = new Date();
            var yyyy = date.getFullYear();// 年
            var MM = date.getMonth() + 1;//月份 
            var dd = date.getDate(); //日
            var HH = date.getHours();//小时
            var mm = date.getMinutes();//分 
            var ss = date.getSeconds();//秒

            MM = MM > 9 ? MM : "0" + MM;
            dd = dd > 9 ? dd : "0" + dd;
            HH = HH > 9 ? HH : "0" + HH;
            mm = mm > 9 ? mm : "0" + mm;
            ss = ss > 9 ? ss : "0" + ss;

            return yyyy + "年" + MM + "月" + dd + "日 " + HH + ":" + mm + ":" + ss;
        }

        // 获取类型
        function getType(data) {
            return Code.GetCSharpType(data);
        }

        // 添加参数
        function addDatas(datas, isStatic) {
            // 参数备注
            function addSummary(data, tabcount) {
                addline("/// <summary>", tabcount);
                addline("/// <para>" + data.ChineseName + "</para>", tabcount);
                addline("/// <para>" + data.EnglishName + "</para>", tabcount);
                addline("/// <para>Type : " + data.Type + "</para>", tabcount);
                if (data[data.Type + "Type"]) {
                    addline("/// <para>" + data.Type + "Type" + " : " + Code.GetCSharpType(data[data.Type + "Type"]) + "</para>", tabcount);
                }
                if (data.Type === "Function" && data.FunctionReturnType) {
                    addline("/// <para>Function Return Type" + " : " + Code.GetCSharpType(data.FunctionReturnType) + "</para>", tabcount);
                }
                addline("/// <para>Default Value : " + data.Value + "</para>", tabcount);
                addline("/// </summary>", tabcount);
            }

            // 获取默认值
            function getValue(data) {
                return Code.GetCSharpDefaultValue(data);
            }

            // 添加枚举
            function addEnum(data, tabcount) {
                if (data.Type !== "Enum") return;
                var list = data.EnumType;
                newline();
                addline("/// <summary>", tabcount);
                addline("/// <para>" + data.ChineseName + "枚举</para>", tabcount);
                addline("/// <para>" + data.EnglishName + " Enum</para>", tabcount);
                addline("/// </summary>", tabcount);
                addline("public enum " + data.Name + "Enum", tabcount);
                addline("{", tabcount);
                for (var i = 0; i < list.length; i++) {
                    addline("/// <summary>", tabcount + 1);
                    addline("/// <para>" + list[i] + "</para>", tabcount + 1);
                    addline("/// </summary>", tabcount + 1);
                    if (i === list.length - 1) {
                        addline(list[i] + " = " + i, tabcount + 1);
                    } else {
                        addline(list[i] + " = " + i + ",", tabcount + 1);
                    }
                }
                addline("}", tabcount);
            }

            if (!datas || datas.length < 1) return;

            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                if (data.Type === "Enum") {
                    addEnum(data, 2);
                }

                if (i !== 0) {
                    newline();
                }
                addSummary(data, 2);
                var type = getType(data);
                var value = getValue(data);
                addline("public " + (isStatic ? "static " : "") + type + " " + data.Name + " { get; set; } = " + value + ";", 2);
            }
        }

        // 添加方法
        function addFunctions(datas, isStatic) {
            // 备注
            function addSummary(data, tabcount) {
                addline("/// <summary>", tabcount);
                addline("/// <para>" + data.ChineseName + "</para>", tabcount);
                addline("/// <para>" + data.EnglishName + "</para>", tabcount);
                addline("/// </summary>", tabcount);
                if (data.Keys && data.Keys.length > 0) {
                    for (var i = 0; i < data.Keys.length; i++) {
                        var key = data.Keys[i];
                        var line = "/// <param name=\"" + key.Name + "\">" + key.Name + " " + (key.Description || "");
                        if (key[key.Type + "Type"]) {
                            var type = key[key.Type + "Type"];
                            line += " , " + "带" + key.Type + "参数" + Code.GetCSharpType(type);
                        }
                        if (key.Type === "Function" && key.FunctionReturnType) {
                            line += " , " + "方法返回类型 :" + Code.GetCSharpType(key.FunctionReturnType);
                        }
                        line += " , " + (key.AllowEmpty ? "允许为空" : "不允许为空");
                        line += "</param>";
                        addline(line, tabcount);
                    }
                }

                if (data.Return && data.Return.Type) {
                    addline("/// <returns>" + (data.Return.Description || "") + (data.Return[data.Return.Type + "Type"] ? " , 队列类型 : " + Code.GetCSharpType(data.Return[data.Return.Type + "Type"]) : "") + "</returns>", tabcount);
                }
            }

            if (!datas || datas.length < 1) return;

            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];

                if (i !== 0) {
                    newline();
                }
                addSummary(data, 2);

                var type = "void";

                if (data.Return && data.Return.Type) {
                    type = getType(data.Return);
                }

                add("public " + (isStatic ? "static" : "") + " " + getType(data.Return) + " " + data.Name + "(", 2);
                if (data.Keys && data.Keys.length > 0) {
                    for (var j = 0; j < data.Keys.length; j++) {
                        if (j !== 0) {
                            add(", ");
                        }
                        add(getType(data.Keys[j]) + " " + data.Keys[j].Name + (data.Keys[j].AllowEmpty ? " = default(" + getType(data.Keys[j]) + ")" : ""));
                    }
                }
                addline(")");
                addline("{", 2);

                if (data.Return && data.Return.Type) {
                    addline("return default(" + Code.GetCSharpType(data.Return) + ");", 3);
                }

                addline("}", 2);
            }
        }

        // 生成代码
        function generate(json) {
            if (!json) {
                if (error) {
                    error("No Json");
                }
                return;
            }
            clear();

            // 添加依赖
            function addDepend(json) {
                function mergeArray(arr1, arr2) {
                    for (var i = 0; i < arr1.length; i++) {
                        for (var j = 0; j < arr2.length; j++) {
                            if (arr1[i] === arr2[j]) {
                                arr1.splice(i, 1);
                            }
                        }
                    }
                    for (i = 0; i < arr2.length; i++) {
                        arr1.push(arr2[i]);
                    }
                    return arr1;
                }

                addline("#region Depend");
                addline("using System;");
                addline("using System.Collections.Generic;");
                addline("using Edbox.Json;");

                var depend = new Array();

                var keys = Object.keys(json);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = json[key];
                    if (value.Depend) {
                        mergeArray(depend, value.Depend);
                    }
                }

                //for (i = 0; i < depend.length; i++) {
                //    if (depend[i].Name === "Edbox") continue;
                //    if (depend[i].Name.indexOf("Edbox.") > 0) continue;
                //    addline("using " + depend[i].Name + ";");
                //}

                addline("#endregion");
            }

            addDepend(json);

            var keys = Object.keys(json);

            if (keys.length === 0) {
                if (error) {
                    error("No Data");
                }
                return;
            }

            // 类备注
            function addClassSummary(data, nameplus, tabcount) {
                addline("/// <summary>", tabcount);
                addline("/// <para>" + data.ComponentName.replace(/#/g, "") + (nameplus || "") + "</para>", tabcount);
                addline("/// <para>" + data.Description + "</para>", tabcount);
                addline("/// <para>Author : " + data.Author + "</para>", tabcount);
                addline("/// <para>Version : " + data.Versions[0].Name + " (" + getdate() + ")</para>", tabcount);
                addline("/// <para>Wiki : " + Code.GetWiki(data.ComponentName) + " </para>", tabcount);
                addline("/// <para>Depend : " + "</para>", tabcount);
                for (var i = 0; i < data.Depend.length; i++) {
                    addline("/// <para>      " + data.Depend[i].Name + ":" + Code.GetWiki(data.Depend[i].Wiki) + " </para>", tabcount);
                }
                addline("/// </summary>", tabcount);
            }

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = json[key];

                if (!value.Name || !value.ComponentName || !value.Author || !value.Versions || !value.Datas || !value.Depend) {
                    if (error) {
                        error("Class '" + key + "' Format Error");
                    }
                    continue;
                }

                newline();

                addline("#region " + key);
                addline("namespace Edbox");
                addline("{");

                addline("#region Keys");
                addClassSummary(value, "", 1);
                addline("public partial class " + value.Name + " : Object", 1);
                addline("{", 1);

                addDatas(value.Datas, false);
                addline("}", 1);
                addline("#endregion");

                newline();

                addline("#region Functions");
                addClassSummary(value, "Functions", 1);
                addline("public partial class " + value.Name, 1);
                addline("{", 1);
                addFunctions(value.Functions, false);
                addline("}", 1);
                addline("#endregion");

                newline();

                addline("#region Static Keys");
                addClassSummary(value, "Static Keys", 1);
                addline("public partial class " + value.Name, 1);
                addline("{", 1);
                addDatas(value.StaticDatas, true);
                addline("}", 1);
                addline("#endregion");

                newline();

                addline("#region Static Functions");
                addClassSummary(value, "Static Functions", 1);
                addline("public partial class " + value.Name, 1);
                addline("{", 1);
                addFunctions(value.StaticFunctions, true);
                addline("}", 1);
                addline("#endregion");

                addline("}");
                addline("#endregion");
            }

            if (success) {
                success(text, "Edbox_" + keys[0] + ".cs");
            }
        }

        Code.StartGenerate(file, generate, error);
    },

    // 生成Wiki
    GenerateWiki: function (file, success, error) {
        // 代码文本
        var text = "";

        // 清空
        function clear() {
            text = "";
        }

        // 换行
        function newline() {
            text += "\n";
        }

        // 格式
        function tab(cnt) {
            for (var i = 0; i < cnt; i++) {
                text += "    ";
            }
        }

        // 书写内容
        function add(txt, tabcnt) {
            if (tabcnt) {
                tab(tabcnt);
            }
            text += txt;
        }

        // 书写一行
        function addline(line, tabcnt) {
            add(line, tabcnt);
            newline();
            newline();
        }

        // 空一行
        function emptyline() {
            text += "&nbsp;";
            newline();
            newline();
        }

        // 获取时间
        function getdate() {
            var date = new Date();
            var yyyy = date.getFullYear();// 年
            var MM = date.getMonth() + 1;//月份 
            var dd = date.getDate(); //日
            var HH = date.getHours();//小时
            var mm = date.getMinutes();//分 
            var ss = date.getSeconds();//秒

            MM = MM > 9 ? MM : "0" + MM;
            dd = dd > 9 ? dd : "0" + dd;
            HH = HH > 9 ? HH : "0" + HH;
            mm = mm > 9 ? mm : "0" + mm;
            ss = ss > 9 ? ss : "0" + ss;

            return yyyy + "年" + MM + "月" + dd + "日 " + HH + ":" + mm + ":" + ss;
        }

        // 添加参数
        function addDatas(datas, isStatic, classname) {
            if (!datas || datas.length < 1) return;

            addline("{| class=\"wikitable\" style=\"border-collapse:collapse; border:solid windowtext 1.0pt\"");
            addline("|-");
            addline("| width=\"100\" | ");
            addline("'''参数名'''");
            addline("| width=\"100\" | ");
            addline("'''类型'''");
            addline("| width=\"100\" | ");
            addline("'''二级类型'''");
            addline("| width=\"100\" | ");
            addline("'''C#类型'''");
            addline("| width=\"100\" | ");
            addline("'''Js/Ts类型'''");
            addline("| width=\"100\" | ");
            addline("'''默认值'''");
            addline("| width=\"250\" | ");
            addline("'''中文说明'''");
            addline("| width=\"250\" | ");
            addline("'''英文说明'''");

            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];

                addline("|-");
                addline("|");
                addline(data.Name);
                addline("|");
                addline(data.Type);
                addline("|");
                if (data[data.Type + "Type"]) {
                    addline(Code.GetBaseType(data[data.Type + "Type"]));
                }
                else {
                    addline("&nbsp;");
                }
                addline("|");
                addline(Code.GetCSharpType(data));
                addline("|");
                addline(Code.GetJsType(data));
                addline("|");
                addline(data.Value);
                addline("|");
                addline(data.ChineseName);
                addline("|");
                addline(data.EnglishName);
            }

            addline("|}");
        }

        // 添加方法
        function addFunctions(datas, isStatic, classname) {
            if (!datas || datas.length < 1) return;

            if (!isStatic) {
                addline("下列方法调用示例中,com代表一个实例类型");
            }

            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];

                addline("===== " + data.ChineseName + " =====");

                addline("{| class=\"wikitable\" style=\"border-collapse:collapse; border:solid windowtext 1.0pt\"");
                addline("|-");
                addline("|");
                addline("'''方法名'''");
                addline("|");
                addline(data.Name);
                addline("|");
                addline("'''调用示例'''");
                addline("| colspan=\"5\" rowspan=\"1\" | ");
                if (isStatic) {
                    add("Edbox." + classname + "." + data.Name + "(");
                }
                else {
                    add("com." + data.Name + "(");
                }
                if (data.Keys && data.Keys.length > 0) {
                    for (var j = 0; j < data.Keys.length; j++) {
                        if (j !== 0) {
                            add(", ");
                        }
                        add(data.Keys[j].Name);
                    }
                }
                addline(");");

                addline("|-");
                addline("|");
                addline("'''中文说明'''");
                addline("| colspan=\"3\" rowspan=\"1\" | ");
                addline(data.ChineseName);
                addline("|");
                addline("'''英文说明'''");
                addline("| colspan=\"3\" rowspan=\"1\" | ");
                addline(data.EnglishName);

                addline("|-");
                addline("| width=\"100\" | ");
                addline("'''返回类型'''");
                addline("| width=\"100\" | ");
                addline(data.Return ? data.Return.Type : "void");
                addline("| width=\"100\" | ");
                addline("'''二级类型'''");
                addline("| width=\"100\" | ");
                if (data.Return && data.Return[data.Return.Type + "Type"]) {
                    addline(Code.GetBaseType(data.Return[data.Return.Type + "Type"]));
                }
                else {
                    addline("&nbsp;");
                }
                addline("| width=\"100\" | ");
                addline("'''C#类型'''");
                addline("| width=\"100\" | ");
                if (data.Return && data.Return.Type) {
                    addline(Code.GetCSharpType(data.Return));
                }
                else {
                    addline("void");
                }
                addline("| width=\"100\" |");
                addline("'''Js类型'''");
                addline("| width=\"100\" |");
                if (data.Return && data.Return.Type) {
                    addline(Code.GetJsType(data.Return, false));
                }
                else {
                    addline("void");
                }

                if (data.Keys && data.Keys.length > 0) {
                    addline("|-");
                    addline("| width=\"100\" | ");
                    addline("'''参数名'''");
                    addline("| width=\"100\" | ");
                    addline("'''是否允许为空'''");
                    addline("| width=\"100\" | ");
                    addline("'''类型'''");
                    addline("| width=\"100\" | ");
                    addline("'''二级类型'''");
                    addline("| width=\"100\" | ");
                    addline("'''C#类型'''");
                    addline("| width=\"100\" | ");
                    addline("'''Js/Ts类型'''");
                    addline("| colspan=\"2\" rowspan=\"1\" width=\"200\" | ");
                    addline("'''参数说明'''");

                    for (j = 0; j < data.Keys.length; j++) {
                        var key0 = data.Keys[j];
                        addline("|-");
                        addline("|");
                        addline(key0.Name);
                        addline("|");
                        addline(key0.AllowEmpty ? "是" : "否");
                        addline("|");
                        addline(key0.Type);
                        addline("|");
                        if (key0[key0.Type + "Type"]) {
                            addline(Code.GetBaseType(key0[key0.Type + "Type"]));
                        }
                        else {
                            addline("&nbsp; ");
                        }
                        addline("|");
                        addline(Code.GetCSharpType(key0));
                        addline("|");
                        addline(Code.GetJsType(key0));
                        addline("| colspan=\"2\" rowspan=\"1\" | ");
                        addline(key0.Description);
                    }
                }

                addline("|}");
            }
        }

        // 生成代码
        function generate(json) {
            if (!json) {
                if (error) {
                    error("No Json");
                }
                return;
            }

            var keys = Object.keys(json);

            if (keys.length === 0) {
                if (error) {
                    error("No Data");
                }
                return;
            }

            // 头部内容
            function addHeader(data, tabcount) {
                newline();
                addline("= 作者 =", tabcount);
                addline(data.Author, tabcount);
                addline("<span style=\"color:#3498db;\">''<span style=\"font-size:smaller;\">[此Wiki由代码自动生成，修改请联系作者]</span>''</span>", tabcount);
                emptyline();
                addline("= 简介 =", tabcount);
                addline(data.ComponentName.replace(/#/g, "") + "," + data.Description, tabcount);
                emptyline();
                addline("= 版本更新 =", tabcount);
                for (var i = 0; i < data.Versions.length; i++) {
                    var v = data.Versions[i];
                    addline("<span style=\"font-size: medium;\">'''" + v.Name + "'''</span>", tabcount);
                    for (var j = 0; j < v.Changes.length; j++) {
                        addline(" *      " + v.Changes[j], tabcount);
                    }
                }
                emptyline();
                addline("= 依赖组件 =", tabcount);
                for (i = 0; i < data.Depend.length; i++) {

                    addline(" *      " + data.Depend[i].Name + ":" + Code.GetWiki(data.Depend[i].Wiki), tabcount);
                }
                emptyline();
                addline("= 引用说明 =", tabcount);
                addline("<script src=\"/libs/Edbox_" + data.Name + "/js/Edbox_" + data.Name + ".js\" type=\"text/javascript\"></script>", tabcount);
                addline("使用CDN库引用的前往：[http://ndsdn.nd.com.cn/index.php?title=Edbox_JS_SDK_CDN库 Edbox JS SDK CDN库]", tabcount);
                emptyline();
            }

            // 脚步内容
            function addFooter(data, tabcount) {
                addline("= SVN地址 =", tabcount);
                addline("[https://svn.nd.com.cn/svn/Edbox_Gobang/Tool/Edbox_JSLibs/Edbox_" + data.Name + " https://svn.nd.com.cn/svn/Edbox_Gobang/Tool/Edbox_JSLibs/Edbox_" + data.Name + "]", tabcount);
                emptyline();
                addline("= 测试案例 =", tabcount);
                addline("http://component.edbox-qa.101.com/libs/Edbox_" + data.Name + "/", tabcount);
                emptyline();
                emptyline();
                addline("[[Category:Edbox组件文档]]", tabcount);
            }

            addHeader(json[keys[0]], 0);

            function addMainClass(data) {
                addline("= 初始化说明 =");
                addline(data.ComponentName + "使用前，需完成依赖组件的初始化，具体查看组件Wiki:");
                for (var i = 0; i < data.Depend.length; i++) {
                    var com = data.Depend[i].Wiki;
                    var index = com.indexOf("#");
                    if (index < 0) {
                        addline(" *      " + data.Depend[i].Name + ":" + Code.GetWiki(data.Depend[i].Wiki + "#初始化说明"));
                    }
                    else {
                        addline(" *      " + data.Depend[i].Name + ":" + Code.GetWiki(data.Depend[i].Wiki));
                    }
                }

                for (i = 0; i < data.StaticFunctions.length; i++) {
                    if (data.StaticFunctions[i].Name !== "Init") continue;
                    var fun = data.StaticFunctions[i];
                    add("'''" + data.ComponentName + "初始化示例:'''<br/> ");

                    add("&nbsp; &nbsp; &nbsp; &nbsp; Edbox." + data.Name + ".Init(");
                    if (fun.Keys && fun.Keys.length > 0) {
                        for (var j = 0; j < fun.Keys.length; j++) {
                            if (j !== 0) {
                                add(", ");
                            }
                            add(fun.Keys[j].Name);
                        }
                    }
                    addline(");");
                    break;
                }

                emptyline();
                addline("= 调用说明 =");
            }

            function addOtherClass(data) {
                var com = data.ComponentName;
                var index = com.indexOf("#");
                if (index < 0) {
                    return;
                }
                var hash = com.substring(index + 1);
                addline("= " + hash + " =");
                addline("类型名: Edbox." + data.Name);
            }

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = json[key];

                if (!value.Name || !value.ComponentName || !value.Author || !value.Versions || !value.Datas || !value.Depend) {
                    if (error) {
                        error("Class '" + key + "' Format Error");
                    }
                    continue;
                }

                if (i === 0) {
                    addMainClass(value);
                }
                else {
                    addOtherClass(value);
                }

                if (value.Datas && value.Datas.length > 0) {
                    addline("=== 对象参数 ===");
                    addDatas(value.Datas, false, key);
                }
                if (value.Functions && value.Functions.length > 0) {
                    addline("=== 对象方法 ===");
                    addFunctions(value.Functions, false, key);
                }
                if (value.StaticDatas && value.StaticDatas.length > 0) {
                    addline("=== 静态参数 ===");
                    addDatas(value.StaticDatas, true, key);
                }
                if (value.StaticFunctions && value.StaticFunctions.length > 0) {
                    addline("=== 静态方法 ===");
                    addFunctions(value.StaticFunctions, true, key);
                }
                emptyline();
            }

            addFooter(json[keys[0]], 0);

            if (success) {
                success(text, "Edbox_" + keys[0] + ".txt");
            }
        }

        Code.StartGenerate(file, generate, error);
    },

    // 读取Json
    Read: function (file, success, error) {
        var reader = new FileReader();
        if (!/json/.test(file.type)) {
            if (error) {
                error("Error Type:" + file.type);
            }
            return;
        }
        reader.onload = function (data) {
            var result = data.target.result;
            try {
                Code.Json = JSON.parse(result);
                if (success) {
                    success(Code.Json);
                }
            } catch (e) {
                if (error) {
                    error(e);
                }
            }
        };
        reader.readAsText(file);
    }
};