import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: [],
    userToken: localStorage.getItem("user-token") || null,
    detailTodo: {
      title: '',
      description: ''
    },
    snackbar: false,
    message: ''
  },
  mutations: {
    setToken(state, token) {
      state.userToken = token;
    },
    setErrorMsg(state) {
      state.errorMsg = true;
    },
    setDetailTodo(state, payload) {
      console.log(payload);
      state.detailTodo.title = payload.title
      state.detailTodo.description = payload.description
    },
    setUpdated(state, payload) {
      const index = state.todos.findIndex(todo => todo.id === payload.id)
      console.log(index);
      state.todos[index] = payload
    },
    setRegister(state, payload) {
      state.snackbar = payload.snackbar
      state.message = payload.message
    }

  },
  actions: {
    async register2(context, email, password) {
      try {
        const response = await axios.post(
          "https://morning-reef-94255.herokuapp.com/register",
          {
            email: email,
            password: password,
          }
        );

        const token = await response.data.token;
        localStorage.setItem("user-token-register", JSON.stringify(token));
        context.commit("setRegister", {
          snackbar: true,
          message: "Registrasi berhasil!"
        });

      } catch (e) {
        context.commit("setRegister", {
          snackbar: true,
          message: "Registrasi gagal!"
        });
      }
    },
    register(context, payload) {
      axios
        .post("https://morning-reef-94255.herokuapp.com/register", payload)
        .then((res) => {
          console.log(res);
          context.commit("setToken", res.data.token);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addTodo(context, payload) {

      axios("https://morning-reef-94255.herokuapp.com/todos", {
        method: 'POST',
        headers: {
          token: context.state.userToken
        },
        data: payload
      }).then((res) => {
        res.data.data.done = false;
        context.state.todos.push(res.data.data)
      }).catch(err => console.log(err.response))
    },
    getList(context) {
      axios(
        "https://morning-reef-94255.herokuapp.com/todos/",
        {
          method: "GET",
          headers: {
            token: context.state.userToken
          },
        }
      ).then(res => {

        context.state.todos = res.data.data.map(todo => {
          todo.done = false
          return todo
        })
      }).catch(err => console.log(err));
    },
    deleteTodoById(context, id) {
      axios("https://morning-reef-94255.herokuapp.com/todos/" + id, {
        method: 'DELETE',
        headers: {
          token: context.state.userToken
        }
      })
        .then(() => {
          const deleted = context.state.todos.find(todo => todo.id == id)
          context.state.todos = context.state.todos.filter(todo => todo.id !== deleted.id)
        })
        .catch(err => console.log(err))
    },
    detailTodoById(context, id) {
      axios
        .get("https://morning-reef-94255.herokuapp.com/todos/" + id, {
          headers: {
            token: context.state.userToken
          }
        })
        .then(res => {
          context.commit("setDetailTodo", res.data.data)
        })
        .catch(err => console.log(err))
    },
    updateTodo(context, todo) {
      return new Promise((resolve, reject) => {
        axios
          .put("https://morning-reef-94255.herokuapp.com/todos/" + todo.id, todo, {
            headers: {
              token: context.state.userToken
            },
          })
          .then(res => {
            resolve(res)
            context.commit('setUpdated', todo)
          })
          .catch(err => reject(err.response))
      })
    }
  },
  modules: {},
});
