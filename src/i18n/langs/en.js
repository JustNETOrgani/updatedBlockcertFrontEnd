import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
    common: {
        login: "Login",
        register: "Register",
        student: "Student",
        school: "School",
        confirm: "Confirm",
        cancel: "Cancel",
        logout: "Login out",
        view: "View",
        title: "Title",
        email: "Email",
        chain: "Chain",
        time: "Time",
        operation: "Operation",
        txid: "Transaction ID",
        home: "Home",
        certificates: "Certificates"
      },
    home: {
        index: {
          page: "Blockcerts Universal View",
          placeholder: "Please input student email...",
          dialogTitleUserType: "Select registered user type",
          dialogTitleVerify: "Verify result",
          emailFormat: 'Please fill in the correct email format',
          getVerifyListFail: "Get certs list fail. Please try it later",
          step: "Step {num}",
          step1: "Checking certificate has not been tampered with",
          step2: "Checking certificate has not expired",
          step3: "Checking not revoked by issuer",
          step4: "Checking authenticity",
          step5: "Validation",
          verifyFail: "Failed",
          verifyPass: "Passed",
          verify: "Verify",
          requestVerifyFail: {
            step: "step 1",
            name: "Validation"
          }
        }
      },
      login: {
        usernamePlaceHolder: "Please, input your username.",
        passwordPlaceHolder: "Please, input your password.",
        username: "Username: ",
        password: "Password: ",
        role: "Role: ",
        usernameMessage: "Please input username.",
        usernameFormat: "Length should be at least two",
        passwordMessage: "Please input your password.",
        passwordFormat: "Length should be at least six.",
        loginSuccess: "Congratulations. Login successful",
        loginFail: "Account or password is wrong, please enter the correct account and password"
      },
    ...enLocale
}

export default en;