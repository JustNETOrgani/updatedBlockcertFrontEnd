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
        txid: "Transaction ID"
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
    ...enLocale
}

export default en;