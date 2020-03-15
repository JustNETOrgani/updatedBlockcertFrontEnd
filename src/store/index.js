import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);

const state = {
token: null,
student_info: null,
school_info: null
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  // 异步操作或者复杂的操作放到actions
  actions
});
