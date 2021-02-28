<template>
  <v-row justify="center" class="my-3">
    <v-col cols="6">
      <v-container grid-list-xs>
        <v-form @submit.prevent="add">
          <v-card class="px-6" :loading="createLoad">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="New todo .."
                  prepend-inner-icon="mdi-pencil"
                  v-model="newTodo.title"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Description .."
                  prepend-inner-icon="mdi-label"
                  v-model="newTodo.description"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn color="green" class="mt-3" type="submit"
                  ><v-icon>mdi-plus-circle-outline</v-icon> Add</v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-form>
        <v-list-item-group class="my-5">
          <!-- Looping todos from API -->
          <v-list-item
            :class="{
              red: todo.done,
              info: !todo.done,
            }"
            class="my-2"
            dark
            v-for="(todo, index) in todos"
            :key="index"
          >
            <template>
              <v-list-item-content>
                <v-list-item-title
                  :class="{ 'text-decoration-line-through': todo.done }"
                  >{{ todo.title }}</v-list-item-title
                >
                <v-list-item-subtitle
                  :class="{ 'text-decoration-line-through': todo.done }"
                  >{{ todo.description }}</v-list-item-subtitle
                >
                <v-expand-transition>
                  <v-form v-if="todo.edit" @submit.prevent="edit(index)">
                    <v-text-field v-model="updateTodo"></v-text-field>
                  </v-form>
                </v-expand-transition>
              </v-list-item-content>

              <v-btn
                class="mx-2"
                color="orange"
                fab
                small
                dark
                :loading="loading"
                @click="showTodo(todo.id)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn color="success" small fab @click="done(index)"
                ><v-icon>mdi-check-bold</v-icon></v-btn
              >
              <v-btn
                :loading="destroy"
                color="red mx-2"
                fab
                small
                @click="deleteTodo(todo.id)"
                ><v-icon color="white">mdi-trash-can</v-icon></v-btn
              >
              <v-btn
                class=""
                color="purple lighten-1"
                fab
                small
                dark
                @click="showEdit(index)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-container>
    </v-col>

    <!-- Show one todo dialog -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ detailTodo.title }}
        </v-card-title>

        <v-card-text>
          {{ detailTodo.description }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> I accept </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit dialog -->
    <v-dialog v-model="editdialog" width="500">
      <v-form @submit.prevent="update()">
        <v-card :loading="editLoading">
          <v-card-title class="headline grey lighten-2 info">
            <h4 class="mx-auto">Form edit todo</h4>
          </v-card-title>

          <v-card-text>
            <v-text-field
              label="title"
              v-model="todoDetail.title"
            ></v-text-field>
            <v-text-field
              v-model="todoDetail.description"
              label="description"
            ></v-text-field>
            {{ todoDetail }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="primary" text @click="editdialog = false">
              Close
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit">
              Update <v-icon right>mdi-check</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- Alert with snackbar -->
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar">
        Success deleted!

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-row>
</template>

<script>
// import VueJwtDecode from "vue-jwt-decode";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      snackbar: false,
      todoDetail: {
        id: "",
        title: "",
        description: "",
        status: true,
      },
      createLoad: false,
      loading: false,
      destroy: false,
      dialog: false,
      editdialog: false,
      editLoading: false,
      newTodo: {
        title: "",
        description: "",
      },
    };
  },
  computed: {
    ...mapState(["todos", "detailTodo"]),
  },
  methods: {
    ...mapActions([
      "addTodo",
      "getList",
      "deleteTodoById",
      "detailTodoById",
      "updateTodo",
    ]),
    done(index) {
      let done = this.$store.state.todos[index];
      done.done = true;
    },
    async update() {
      this.editLoading = true;
      try {
        let todo = this.todoDetail;
        await this.updateTodo(todo);
        this.editdialog = false;
      } catch (error) {
        this.editdialog = true;
      } finally {
        this.editLoading = false;
      }
    },
    showEdit(index) {
      let todo = this.todos[index];
      this.editdialog = true;
      this.todoDetail.id = todo.id;
      this.todoDetail.title = todo.title;
      this.todoDetail.description = todo.description;
    },
    add() {
      this.createLoad = true;
      this.addTodo(this.newTodo);
      this.newTodo = {
        title: "",
        description: "",
      };
      setTimeout(() => {
        this.createLoad = false;
      }, 1000);
    },
    showTodo(id) {
      this.detailTodoById(id);
      setTimeout(() => {
        this.loading = true;
      }, 100);
      setTimeout(() => {
        this.dialog = true;
        this.loading = false;
      }, 1000);
    },
    deleteTodo(id) {
      this.destroy = true;
      setTimeout(() => {
        this.deleteTodoById(id);
        this.snackbar = true;
        this.destroy = false;
      }, 1000);
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style></style>
