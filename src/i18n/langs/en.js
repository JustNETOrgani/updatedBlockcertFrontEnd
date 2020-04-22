import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
    common: {
        login: "Login",
        register: "Register",
        reset: "Reset",
        student: "Student",
        school: "School",
        confirm: "Confirm",
        cancel: "Cancel",
        logout: "Log out",
        logOutDialogMessage: "Are you sure you want to quit?",
        logOutSuccess: "Signed out successfully",
        view: "View",
        title: "Title",
        email: "Email",
        chain: "Chain",
        time: "Time",
        operation: "Operation",
        txid: "Transaction ID",
        home: "Home",
        certificates: "Certificates",
        issueList: "Issue certificate"
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
    studentRegister:{
      welcomeMsg: "Welcome to Student Registration",
      instruction: "Please, fill the form below.",
      fnameLabel: "First name",
      fnamePlaceholder: "Please, enter your first name here.",
      fnameFormat1: "Please input your first name",
      fnameFormat2: "Length should be at least two",
      lnameLabel: "Last name",
      lnamePlaceholder: "Please, enter your last name here.",
      lnameFormat1: "Please input your last name",
      lnameFormat2: "Length should be at least two",
      emailLabel: "Email address",
      emailPlaceholder: "Please, enter your email here.",
      emailFormat1: "Please input email address",
      emailFormat2: "Please input correct email address",
      stdIDLabel: "Student ID",
      stdIDPlaceholder: "Please, enter your student ID.",
      stdIDFormat1: "Please input your student ID",
      stdIDFormat2: "Length should be at least two",
      passwordLabel: "Password",
      passwordPlaceholder: "Please, enter your password.",
      passwordFormat1: "Please input your password",
      passwordFormat2: "Length should be at least six",
      bAddressLabel: "Blockchain address",
      bAddressPlaceholder: "Please, enter your blockchain address.",
      bAddressFormat1: "Please input your blockchain address",
      bAddressFormat2: "Length should be at least twenty",
      blockchainAddressTypeLinkBitcoin: "You can create Bitcoin address",
      blockchainAddressTypeLinkEthereum: "Ethereum address",
      link: "here",
      registrationSuccess: "Congratulations. Registration successful, Please Login",
      registrationFail: "Registration failed, please try again later, or contact the administrator!!!"
    },
    ...enLocale
}

export default en;