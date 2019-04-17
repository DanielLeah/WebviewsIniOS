/*jslint devel: true */

/*eslint no-console: "off", no-undef: "off" */

// IMPLEMENTING THE MODULE PATTERN // 

//Manage Data 
var registrationController = (function(){
    
    var inputAlphabet = function(inputtext) {
        var alphaExp = /^[a-zA-Z]+$/;
        if (inputtext.match(alphaExp)) {
            return true;
        } else {
            return false;
        }
    };

    var emailValidation = function(inputtext) {
       if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputtext))
       {
           return (true)
       }
           return (false)
    };

    var trueSelection = function (inputtext) {
        if (inputtext == "choose") {
            return false;
        } else {
            return true;
        }
    };
    
    //var dataLocal = JSON.parse(localStorage.getItem("formInputs"));
    
    
    return{
        getValidation: function(firstN,lastN,email,gender) {
            return {
                firstNameVal : inputAlphabet(firstN), 
                lastNameVal : inputAlphabet(lastN),
                emailVal : emailValidation(email),
                genderVal : trueSelection(gender)              
            }
        },
        
       /* getData: function(){   why not working?
            return dataLocal;
        }*/
        
  }  
    
    
})();

//Manage UI
var UIController = (function(){
    var DOMStrings = {
        firstname : 'firstname',
        lastname : 'lastname',
        email : 'email',
        gender : 'gender',
        bday : 'bday',
        submitButton : '.btn'
    }; 
    
    var initClasses = function() {
        var icons = document.getElementsByClassName('icon');

        for(var i=0; i< icons.length; i++){
            icons[i].classList.add('hidden');
            icons[i].classList.remove('invalid');
            icons[i].classList.remove('valid');
        }
    }
    
    var updateClasses = function (isVal, key) {
        if (isVal !== true){
            document.querySelector('.'+key).classList.remove('hidden');
            document.querySelector('.'+key).classList.add('invalid');
        }else{
            document.querySelector('.'+key).classList.remove('hidden');
            document.querySelector('.'+key).classList.add('valid');
        }     
    };
    
    var updateData = function (data){
        document.getElementById(DOMStrings.firstname).value = data.firstName;
        document.getElementById(DOMStrings.lastname).value = data.lastName;
        document.getElementById(DOMStrings.email).value = data.email;
        document.getElementById(DOMStrings.gender).value = data.gender;
        document.getElementById(DOMStrings.bday).value = data.bday;
    };
    
    return {
        
        // get the data from inputs
        getInputs : function(){
            return {
                firstName : document.getElementById(DOMStrings.firstname).value,
                lastName : document.getElementById(DOMStrings.lastname).value,
                email : document.getElementById(DOMStrings.email).value,
                gender : document.getElementById(DOMStrings.gender).value,
                bday : document.getElementById(DOMStrings.bday).value
            }
        },
        
        //return the DOMStrings
        getDOMStrings : function(){
            return DOMStrings;
        },
        
        setClasses: function(isVal, key){
            updateClasses(isVal, key);  
        },
        
        initClasses: function(){
            initClasses();
        },
        
        updateData: function(data){
            updateData(data);
        }
    }
})();

// Global App Controller

var controller = (function(regisCtrl, UICtrl){
     
    var formInputs;
    var setupEventListeners = function() {

        
        var DOMStr = UICtrl.getDOMStrings();
        
        document.querySelector(DOMStr.submitButton).addEventListener('click', saveRegistration);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                saveRegistration();
            }
        });
    }
    
    var saveRegistration = function() {
        var input, valResult, isValid;
        input = UICtrl.getInputs();
        UICtrl.initClasses();
        if (input.firstname !== "" && input.lastname !== "" ){
            valResult = regisCtrl.getValidation(input.firstName, input.lastName, input.email, input.gender);
        }
        isValid = true;
        Object.keys(valResult).forEach(function(key){
            UICtrl.setClasses(valResult[key], key);  
            if (valResult[key] === false){
                isValid = false;
            }
        });
        if (isValid){
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                window.webkit.messageHandlers.jsHandler.postMessage(input);
                
            }else{
                localStorage.setItem("formInputs",JSON.stringify(input));
                console.log("if valid");
                formInputs = JSON.parse(localStorage.getItem("formInputs"));
                document.getElementById("inputs").innerHTML = JSON.stringify(JSON.parse(localStorage.getItem("formInputs")));
                clearInputs();
                 setTimeout(function(){
                    UICtrl.updateData(formInputs);
                 },1500);
        
            }
            
        }else{
            console.log('not saved');
        }
        
    };
    
    function clearInputs(){
        
        
        document.getElementById("firstname").value = "";
        document.getElementById("lastname").value = "";
        document.getElementById("email").value = "";
        document.getElementById("gender").value = "choose";
        document.getElementById("bday").value = "";
        UICtrl.initClasses(); 
    }
    
   /* function clearLocal(){
        localStorage.clear();
    }*/
    
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.initClasses();
            setupEventListeners();
        },
        
        clearLocalInputs: function(){
            clearInputs();
        }
    };
    
})(registrationController, UIController);
document.getElementById("inputs").innerHTML = JSON.stringify(JSON.parse(localStorage.getItem("formInputs")));
controller.init();



/* ------------- VERSION 1  ---------------------------

function formValidation() {
    
    var firstname = document.getElementById('firstname');
    var lastname = document.getElementById('lastname');
    var email = document.getElementById('email');
    var gender = document.getElementById('gender');
    var bday = document.getElementById('bday');
    
    if ((firstname.value.length == 0) || (lastname.value.length == 0)){
        firstname.focus();
        return false;
    }

    if (inputAlphabet(firstname, "* For your name please use alphabets only *")){
        if (inputAlphabet(lastname, "* For your name please use alphabets only *")){
            if (emailValidation(email, "* Please enter a valid email address *")) {
               if(trueSelection(gender, "* Please select your gender *" )){
                   var obj = {
                       firstname : firstname.value,
                       lastname : lastname.value,
                       email : email.value,
                       gender : gender.value,
                       birthday : bday.value
                   };
                   localStorage.setItem("formInputs",JSON.stringify(obj));
                   clearInputs();
                   loadInputs();
                   localStorage.clear;
               }
            }
        }
        
    }
        
}

function inputAlphabet(inputtext, alertMsg) {
    var alphaExp = /^[a-zA-Z]+$/;
    if (inputtext.value.match(alphaExp)) {
        return true;
    } else {
        alert(alertMsg);
        inputtext.focus();
    return false;
    }
}

function emailValidation(inputtext, alertMsg) {
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputtext.value))
   {
       return (true)
   }
       alert(alertMsg);
       return (false)
}

function trueSelection(inputtext, alertMsg) {
    if (inputtext.value == "Please Choose") {
        alert(alertMsg); 
        inputtext.focus();
        return false;
    } else {
        return true;
    }
}

function clearInputs(){    
    document.getElementById('myform').reset();   
}

function loadInputs(){
    var obj = JSON.parse(localStorage.getItem("formInputs"));
    document.getElementById('firstname').value = obj.firstname;
    document.getElementById('lastname').value = obj.lastname;
    document.getElementById('email').value = obj.email;
    document.getElementById('gender').value = obj.gender;
    document.getElementById('bday').value = obj.birthday;
}*/