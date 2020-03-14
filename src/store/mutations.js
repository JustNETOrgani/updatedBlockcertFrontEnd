export default {
  set_token(state, token) {
    state.token = token;
    // sessionStorage.token = token;
    sessionStorage.setItem('API-HTTP-AUTHORIZATION', token);
  },
  del_token(state) {
    state.token = null;
    sessionStorage.removeItem("API-HTTP-AUTHORIZATION");
  },
  set_student_info(state, student_info){
    console.log("student_info", student_info)
    console.log(typeof(student_info))
    state.student_info = student_info
    sessionStorage.setItem('STUDENT-INFO', student_info);
  },
  del_student_info(state){
    state.student_info = null;
    sessionStorage.removeItem("STUDENT-INFO");
  },
  set_school_info(state, school_info){
    console.log("school_info", school_info)
    console.log(typeof(school_info))
    state.school_info = school_info
    sessionStorage.setItem('SCHOOL-INFO', school_info);
  },
  del_school_info(state){
    state.school_info = null;
    sessionStorage.removeItem("SCHOOL-INFO");
  }
};
