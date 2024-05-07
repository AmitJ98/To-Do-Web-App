function validatePassword() {
    console.log("here1")
    const password = document.getElementById("Password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    if (password == confirmPassword){
        return true;
    }
    else{
        alert('Password need to be the same in both fiels');
        return false;
    }
    
}


function validate_new_user_form(){
    if(validatePassword() == true  ){
        return true;
    }
    else{
        return false;
    }
}