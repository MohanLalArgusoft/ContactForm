
<template>
  <v-app id="register">
    <v-content>
      <v-container class="fill-height" fluid id="registerpage">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Register form</v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="username"
                    :rules="nameRules"
                    label="UserName"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="number"
                    :rules="numberRules"
                    label="Phone Number"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="password1"
                    :rules="passwordRules"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>

                  <v-text-field
                    v-model="password2"
                    :rules="passwordRules"
                    id="password2"
                    label="Comfirm Password"
                    name="password2"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" v-on:click="register">Register</v-btn>
                <v-btn color="primary" v-on:click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { Bus } from "../main";

export default {
  props: {},
  data: () => ({
    valid: true,
    username: "",
    number: "",
    password1: "",
    password2: "",
    nameRules: [
      v => !!v || "Name is required",
      v => v.length >= 3 || "Name must be greater than 2 characters"
    ],
    passwordRules: [
      v => !!v || "Password is required",
      v => v.length >= 4 || "Password must be greater than 3 characters"
    ],
    numberRules: [
      v => !!v || "Number is required",
      v => v.length == 10 || "Enter Value Number !"
    ]
  }),
  methods: {
    register() {
      if (this.$refs.form.validate()) {
        if (this.password1 === this.password2) {
          var body = {
            username: this.username,
            number: this.number,
            password: this.password1
          };
          console.log(body);
          this.$http
            .post("http://127.0.0.1:3000/users/register", body)
            .then(function(data) {
              console.log(data);
              console.log(data);
              this.token = JSON.stringify(data);
              localStorage.setItem("token", this.token);
              localStorage.setItem("username", this.username);
              localStorage.setItem("id", "");
              localStorage.setItem("name", "");
              localStorage.setItem("num1", "");
              localStorage.setItem("num2", "");
              localStorage.setItem("email", "");
              localStorage.setItem("add", "");
              localStorage.setItem("category", "");
              this.$router.push("/contacts");
            });
        }
      }
    },
    login() {
      this.$router.push("/");
    }
  }
};
</script>
<style scoped>
#registerpage {
  background-color: skyblue;
}
</style>