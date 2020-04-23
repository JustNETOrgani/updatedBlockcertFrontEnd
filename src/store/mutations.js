export default {
  set_token(state, token) {
    state.token = token;
    // sessionStorage.token = token;
    sessionStorage.setItem('API-HTTP-AUTHORIZATION', token);
    console.log("API-HTTP-AUTHORIZATION token: ",token)
  },
  del_token(state) {
    state.token = null;
    sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
  },
  // set_student_info(state, student_info){
  //   console.log("student_info", student_info)
  //   console.log(typeof(student_info))
  //   state.student_info = student_info
  //   sessionStorage.setItem('STUDENT-INFO', student_info);
  // },
  // del_student_info(state){
  //   state.student_info = null;
  //   sessionStorage.removeItem("STUDENT-INFO");
  // },
  // set_school_info(state, school_info){
  //   console.log("school_info", school_info)
  //   console.log(typeof(school_info))
  //   state.school_info = school_info
  //   sessionStorage.setItem('SCHOOL-INFO', school_info);
  // },
  // del_school_info(state){
  //   state.school_info = null;
  //   sessionStorage.removeItem("SCHOOL-INFO");
  // }, 
  certViewData(state, certDetails){
    console.log(typeof(certDetails))
    state.certDetails = certDetails
    sessionStorage.setItem('Cert_Details', JSON.stringify(certDetails));
  },
  del_certViewData(state){
    state.certDetails = null;
    sessionStorage.removeItem("Cert_Details");
  },
  set_certDispStatus(state, status){
    state.certStatus = status
    sessionStorage.setItem('Cert_Status', status);
  },
  del_certDispStatus(state){
    state.certStatus = null;
    sessionStorage.removeItem("Cert_Status");
  },
  set_school_Name(state, name){
    state.schName = name
    sessionStorage.setItem('school_Name', name);
  },
  del_school_Names(state){
    state.schName = null;
    sessionStorage.removeItem("school_Name");
  },
  set_user_type(state, user_type){
    state.user_type = user_type
    sessionStorage.setItem('USER-TYPE', user_type);
  },
  del_user_type(state){
    state.student_info = null;
    sessionStorage.removeItem("USER-TYPE");
  },
};
