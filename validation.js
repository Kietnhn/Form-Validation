
/*
function Validator(options){

    function getParent (element, selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};
    function validate(inputElement, rule){
        var errorElement = getParent(inputElement, options.formGroupSelection).querySelector(options.errorSelector)
        var errorMessage;
        //lấy ra các rules cúa selector
        var rules = selectorRules[rule.selector]
        //Lặp qua từng rule & check
        //Nếu co lỗi thì dừng việc kiểm
        for (var i = 0; i < rules.length; i++){
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break;
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelection).classList.add('invalid')
        }else{
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelection).classList.remove('invalid')
        }
        return !errorMessage
    }
    var formElement = document.querySelector(options.form);
    if (formElement) {

        formElement.onsubmit = function(e){
            e.preventDefault()

            var isFormValid = true;

            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement,rule)
                if(!isValid) {
                    isFormValid = false
                }
            })
            
            if (isFormValid) {
                // Xử lý hành vi với js
                if (typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValue = Array.from(enableInputs).reduce(function (values, input){
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="'+ input.name + '"]:checked').value
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    // values[input.name] = '';
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value
                        }

                        return values
                    }, {})

                    options.onSubmit(formValue)
                }
                // xử lý với hành vi mặc định
                else{
                    formElement.submit()
                }
            }
        }


        //Lap qua mỗi rule và xử lý
        options.rules.forEach(function (rule){

            // Luu cac rule cho mooxi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }
            
            var inputElements = formElement.querySelectorAll(rule.selector)
            Array.from(inputElements).forEach(function(inputElement){
                var errorElement = getParent(inputElement, options.formGroupSelection).querySelector(options.errorSelector)
                //Xử lý blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement,rule)
                }
                
                //Xử lý khi đang nhập
                inputElement.oninput = function(){
                    errorElement.innerText = ''
                    getParent(inputElement, options.formGroupSelection).classList.remove('invalid')
                }
            })
            
        })
       
    }
}



Validator.isRequired = function(selector,mesage) {
    return {
        selector: selector,
        test (value) {
            return value.trim() ? undefined : mesage || 'Vui lòng nhập trường này'
        }
    }
}
Validator.isGender = function(selector,mesage) {
    return {
        selector: selector,
        test (value) {
            return value ? undefined : mesage || 'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail = function(selector,mesage) {
    return {
        selector: selector,
        test (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : mesage || 'Vui lòng nhập email'
        }
    }
}
Validator.minLength = function(selector,min) {
    return {
        selector: selector,
        test (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}
Validator.isConfirmed = function(selector,isConfirmValue,mesage) {
    return {
        selector: selector,
        test (value) {
            return value === isConfirmValue() ? undefined : mesage || 'Dữ liệu nhập vào không chính xác'
        }
    }
}
*/

//---------------------------------------------------
/*
function Validator (formSelector,options = {}) {
    var formRules = {}
    function getParent(element, selector){
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement
        }
    }
    var validatorRules = {
        required: function (value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        },
        email: function (value)  {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`
            }
        }

    }
    var formElement = document.querySelector(formSelector)
    if(formElement) {

        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs) {
            var rules = input.getAttribute('rules').split('|')
            for (var rule of rules) {
                var ruleInfo;
                var isRuleHasValue = rule.includes(":");
                if(isRuleHasValue){
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }
                var ruleFunc = validatorRules[rule];
                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1])
                }
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc)
                }else{
                    formRules[input.name] = [ruleFunc]
                }
            }
            
            // lắng nge sự kiện
            input.onblur = handleValidate;
            input.oninput = handleClearError;

        }
        function handleValidate(event) {
            var rules = formRules[event.target.name]
            var errorMessage;
            for (var rule of rules) {
                errorMessage = rule(event.target.value)
                if(errorMessage) break;
            }
           
            if (errorMessage) {
                var formGroup = getParent(event.target, ".form-group")
                if(formGroup){
                    formGroup.classList.add("invalid")
                    var mesage = formGroup.querySelector('.form-message')
                    if(mesage){
                        mesage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage
        }
        function handleClearError(event) {
            var formGroup = getParent(event.target, ".form-group")
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove("invalid")
                var mesage = formGroup.querySelector('.form-message')
                if(mesage){
                    mesage.innerText = '';
                }
            }
        }
       

        formElement.onsubmit = function(event) {
            event.preventDefault()
            var inputs = formElement.querySelectorAll('[name][rules]');
            var isValid = true;
            for(var input of inputs) {
               if(!handleValidate({target: input})){
                isValid = false;
               }
            }
            if(isValid){
                if(typeof options.onSubmit === "function"){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValue = Array.from(enableInputs).reduce(function (values, input){
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="'+ input.name + '"]:checked').value
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    // values[input.name] = '';
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value
                        }

                        return values
                    }, {})

                    options.onSubmit(formValue)
                }else{
                    formElement.submit()
                }
            }
        }
    }
}
*/
function Validator (formid,options){
    var formRules = {}
    function getParent (element, selector){
        while (element.parentElement) {
            if (element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var validatorRules = {
        required: function (value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này';
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`
            }
        }

    }
    var formElement = document.querySelector(formid)
    if(formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        if(inputs){
            for (var input of inputs){
               var rules = input.getAttribute('rules').split('|')
                for (var rule of rules) {
                    var isRuleHasValue = rule.includes(':')
                    var ruleInfo;
                    if (isRuleHasValue) {
                        ruleInfo = rule.split(':')
                        rule = ruleInfo[0];
                    }
                    var ruleFunc = validatorRules[rule];
                    if(isRuleHasValue) {
                        ruleFunc = ruleFunc(ruleInfo[1])
                    }
                    if (Array.isArray(formRules[input.name])){
                            formRules[input.name].push(ruleFunc)
                    }else{
                            formRules[input.name] = [ruleFunc]
                    }
                }
                input.onblur = handleValidate;
                input.oninput = handleClearError;
            }
            function handleValidate (event) {
                var rules = formRules[event.target.name]
                var errorMessage;
                for (var rule of rules) {
                    errorMessage = rule(event.target.value)
                    if(errorMessage) break;
                }
                if(errorMessage) {
                    var formGroup = getParent(event.target, ".form-group");
                    if(formGroup){
                        formGroup.classList.add('invalid')
                        var message = formGroup.querySelector('.form-message')
                        if(message){
                            message.innerText = errorMessage;
                        }
                    }
                }
                
            }
            function handleClearError(event) {
                var formGroup = getParent(event.target, ".form-group");
                    if(formGroup.classList.contains('invalid')){
                        formGroup.classList.remove('invalid')
                        var message = formGroup.querySelector('.form-message')
                        if(message){
                            message.innerText = '';
                        }
                    }
            }
        }
        formElement.onsubmit = function(event){
            event.preventDefault()
        }
    }
    
}