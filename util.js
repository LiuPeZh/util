(function(window){
    var utilEvents = {
        /**
         * 绑定事件
         * @param ele  DOM元素
         * @param event 字符串 事件类型
         * @param func 函数 事件处理函数
         * 
         */
        addEvent: function(ele, event, func){
        if(ele.addEventListener){
            ele.addEventListener(event, func, false)
        }else if(ele.attachEvent){
            ele.attachEvent('on' + event, func)
        }else {
            ele['on' + event] = func
        }
        },
        /**
         * 移除事件
         * @param ele  DOM元素
         * @param event 字符串 事件类型
         * @param func 函数 事件处理函数
         * 
         */
        delEvent: function(ele, event, func){
            if(ele.removeEventListener){
                ele.removeEventListener(event, func, false)
            }else if(ele.detachEvent){
                ele.detachEvent('on' + event, func)
            }else {
                ele['on' + event] = null;
            }
        },
        /**
         * 获取事件target属性
         * @param event 事件对象
         * 
         */
        getSrcElement: function(event){
            return event.target || event.srcElement
        },
        /**
         * 获取事件event对象
         * @param event 事件对象
         * 
         */
        getEvent: function(event){
            return event ? event : window.event
        },
        /**
         * 阻止冒泡
         * @param event 事件对象
         * 
         */
        stopBuble: function(event){
            if(event.stopPropagation){
                event.stopPropagation()
            }else {
                event.cacelBuble = false
            }
        },
        /**
         * 阻止事件默认行为
         * @param event 事件对象
         * 
         */
        preventDefault: function(event){
            if(evnet.preventDefault){
                event.preventDefault()
            }else {
                event.returnValue = false
            }
        }
    }
    var utils = {
        /**
         * 类型检测
         * @param target 要检测类型的变量
         * 
         */
        checkedType: function(target){
            return Object.prototype.toString.call(target).slice(8, -1)
        },
        /**
         * ajax
         * @param url 发起ajax的url
         * @param options ajax选项对象 包括请求类型、要发送的数据、异步还是同步以及成功后的回调函数
         * 
         */
        ajax: function(url, options){
            var xhr = null
            var formsParams = function(data){
                var param = ''
                for(var key in data){
                    param += key + '=' + data[key] + '&'
                }
                return param.replace(/&$/, '')

            }
            var params = formsParams(options.data)
            var async = options.async || true
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest()
            }else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP')
            }
            if(options.type === 'GET'){
                xhr.open(options.type, url + '?' + params, async)
                xhr.send(null)
            }else if(options.type === 'POST'){
                xhr.open(options.type, url, async)
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                xhr.send(params)
            }
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    options.success(xhr.responseText)
                }
            }
        },
        /**
         * 浅拷贝
         * @param src 要拷贝的原对象
         * 
         */
        shallowCopy: function(src){
            var dst = {}
            for(var key in src){
                if(src.hasOwnProperty(key)){
                    dst[key] = src[key]
                }
            }
            return dst
        },
        /**
         * 深拷贝
         * @param src 要拷贝的原对象
         * 
         */
        depthCopy: function(src){
            var dst = null,
                srcType = utils.checkedType(src)
            if(srcType === 'Object'){
                dst = {}
            }else if(srcType === 'Array'){
                dst = []
            }else {
                return src
            }
            for(var key in src){
                var value = src[key]
                if(utils.checkedType(value) === 'Object' ||
                    utils.checkedType(value) === 'Array'){

                    dst[key] = utils.depthCopy(value) 
                }else {
                    dst[key] = value
                }
            }
            return dst
        },
        /**
         * 修复Number.prototype.toFixed()在chrome中的bug
         * @param src 原始数字
         * @param len 要保留小数的位数
         * 
         */
        toFixed: function(src, len){
            if(len > 20 || len < 0){
                return
            }
            var number = Number(src)
            if(isNaN(number) || number >= Math.pow(10, 21)){
                return number.toString()
            }
            if(utils.checkedType(len) === 'undefined' || len === 0){
                return Math.round(number).toString()
            }
            var result = number.toString(),
                numberArr = result.split('.')
            if(numberArr.length < 2){
                return padNum(result)
            }
            var intNum = numberArr[0],
                deciNum = numberArr[1],
                lastNum = deciNum.substr(len, 1)
            if(deciNum.length === len){
                return result
            }
            if(deciNum.length < len){
                return padNum(result)
            }
            result = intNum + '.' + deciNum.substr(0, len)
            if(parseInt(lastNum, 10) === 5){
                var times = Math.pow(10, len)
                var changedInt = Number(result.replace('.', ''))
                changedInt++
                changedInt /= times
                result = padNum(changedInt + '')
            }
            return result
            function padNum(num){
                var dotPos = num.indexOf('.')
                if(dotPos === -1){
                    num += '.'
                    for(var i = 0; i < len; i++){
                        num += '0'
                    }
                    return num
                }else {
                    var need = len - (num.length - dotPos - 1)
                    for(var j = 0; j < need; j++){
                        num += '0'
                    }
                    return num
                }
            }
        },
        /**
         * 函数防抖
         * @param func 函数
         * @param wait 延迟执行毫秒
         * @param immediate true表示立即执行，false表示延迟后执行
         * 
         */
        debounce: function(func, wait, immediate){
            var timeout = null
            return function(){
                var context = this,
                    args = arguments
                if(timeout){
                    clearTimeout(timeout)
                }
                if(immediate){
                    var callNow = !timeout
                    timeout = setTimeout(function(){
                        timeout = null
                    }, wait)
                    if(callNow){
                        func.apply(context, args)
                    }
                }else {
                    timeout = setTimeout(function(){
                        func.apply(context, args)
                    }, wait)
                }
            }
        },
        /**
         * 函数节流
         * @param func 函数
         * @param wait 延迟执行毫秒
         * @param type true表示立即执行，false表示延迟后执行
         * 
         */
        throttle: function(func, wait, type){
            if(type === true){
                var previous = 0
            }else if(type === false){
                var timeout = null
            }
            return function(){
                var context = this,
                    args = arguments
                if(type === true){
                    var now = Date.now()
                    if(now - previous > wait){
                        func.apply(context, args)
                        previous = now
                    }
                }else if(type === false){
                    if(!timeout){
                        timeout = setTimeout(function(){
                            timeout = null
                            func.apply(context, args)
                        }, wait)
                    }
                }
            }
        }
    }
    var formValidate = {
        /**
         * 手机号码验证
         * @param str 字符串
         * 
         */
        isPhoneNumber: function(str){
            var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/
            if(reg.test(str)){
                return true
            }else {
                return false
            }
        },
        /**
         * 邮箱验证
         * @param str 字符串
         * 
         */
        isEmail: function(str){
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
            if(reg.test(str)){
                return true
            }else {
                return false
            }
        },
        /**
         * 数字验证 
         * @param str 字符串
         * 
         */
        isNumber: function(str){
            var reg = /^\d+&/
            if(reg.test(str)){
                return true
            }else {
                return false
            }
        },
        /**
         * 检测是否有中文
         * @param str 字符串
         * 
         */
        isChinese: function(str){
            var reg = /[\u4e00-\u9fa5]/gm
            if(reg.test(str)){
                return true
            }else {
                return false
            }
        },
        /**
         * 身份证号码验证
         * @param str 字符串
         * 
         */
        isIdCard: function(str){
            var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
            if(reg.test(str)){
                return true
            }else {
                return false
            }
        }
    }

    if(window){
        window.utilEvents = utilEvents
        window.utils = utils
        window.formValidate = formValidate
    }else {
        exports.utilEvents = utilEvents
        exports.utils = utils
        exports.formValidate = formValidate
    }
    
})(typeof(window) === 'undefined' ? false : window)