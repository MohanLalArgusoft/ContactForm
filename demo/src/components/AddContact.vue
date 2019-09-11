<template>
  <v-app id="addcontact">
    <v-row justify="center">
      <v-col cols="12" sm="8">
        <v-card class="elevation-12">
          <v-toolbar color="indigo" dark flat>
            <v-toolbar-title>{{formTitle}}</v-toolbar-title>
            <div class="flex-grow-1"></div>
          </v-toolbar>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="contact.name"
                    label="Person Name*"
                    :error-messages="nameErrors"
                    @input="$v.contact.name.$touch()"
                    @blur="$v.contact.name.$touch()"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="contact.primarynumber"
                    label="Primary Number*"
                    :error-messages="numberErrors"
                    @input="$v.contact.primarynumber.$touch()"
                    @blur="$v.contact.primarynumber.$touch()"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="contact.secondarynumber"
                    label="Secondary Number"
                    :error-messages="numberErrors2"
                    @input="$v.contact.secondarynumber.$touch()"
                    @blur="$v.contact.secondarynumber.$touch()"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="contact.email"
                    label="Email"
                    :error-messages="emailErrors"
                    @input="$v.contact.email.$touch()"
                    @blur="$v.contact.email.$touch()"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="contact.address" label="Address"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select :items="itemarray" v-model="contact.category" label="Category"></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-form>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="blue darken-1" text v-on:click="reset">Reset</v-btn>
            <v-btn color="blue darken-1" text v-on:click="close">Close</v-btn>
            <v-btn color="blue darken-1" text v-on:click="post">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import server from "../constant";
import { locatedError } from "graphql";
import {
  required,
  minLength,
  between,
  email,
  helpers
} from "vuelidate/lib/validators";
const alpha = helpers.regex(
  "alpha",
  /\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*/
);
export default {
  data() {
    return {
      itemarray: [],
      newcategory: "",
      valid: true,
      contacts: [],
      showp: false,
      search: "",
      contact: {
        name: "",
        primarynumber: "",
        secondarynumber: "",
        email: "",
        address: "",
        category: ""
      },
      editedIndex: -1,
      username: "Welcome",
      radios: "All",
      idid: ""
    };
  },
  validations: {
    contact: {
      name: { required, minLength: minLength(2) },
      primarynumber: { required, alpha },
      secondarynumber: { alpha },
      email: { required, email }
    }
  },
  created() {
    console.log(localStorage.getItem("username"));
    this.username = localStorage.getItem("username");
    this.idid = localStorage.getItem("id");
    this.contact.name = localStorage.getItem("name");
    this.contact.primarynumber = localStorage.getItem("num1");
    this.contact.secondarynumber = localStorage.getItem("num2");
    this.contact.email = localStorage.getItem("email");
    this.contact.address = localStorage.getItem("add");
    this.contact.category = localStorage.getItem("category");
    if (localStorage.getItem("name") || localStorage.getItem("num1")) {
      this.editedIndex = 1;
    }
    var body = {
      username: this.username
    };
    this.$http
      .post(`${server.path}users/getcategorylist`, body, {
        observe: "body"
      })
      .then(data => {
        console.log(data);
        this.itemarray = data.body.doc.categorylist;
      });
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.contact.name.$dirty) return errors;
      !this.$v.contact.name.minLength &&
        errors.push("Name must be atleast 2 characters long");
      !this.$v.contact.name.required &&
        errors.push("Name is required.");
      return errors;
    },
    numberErrors() {
      const errors = [];
      if (!this.$v.contact.primarynumber.$dirty) return errors;
      !this.$v.contact.primarynumber.alpha &&
        errors.push("Number must be valid");
      !this.$v.contact.primarynumber.required &&
        errors.push("Number is required.");
      return errors;
    },
    numberErrors2() {
      const errors = [];
      if (!this.$v.contact.secondarynumber.$dirty) return errors;
      !this.$v.contact.secondarynumber.alpha &&
        errors.push("Number must be valid");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.contact.email.$dirty) return errors;
      !this.$v.contact.email.email && errors.push("Must be valid e-mail");
      !this.$v.contact.email.required && errors.push("E-mail is required");
      return errors;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Add Contact" : "Edit Contact";
    }
  },
  methods: {
    post: function() {

      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("validations not work");
      } else {
        if (this.editedIndex > -1) {
          var body = {
            id: this.idid,
            name: this.contact.name,
            primarynumber: this.contact.primarynumber,
            secondarynumber: this.contact.secondarynumber,
            email: this.contact.email,
            address: this.contact.address,
            category: this.contact.category,
            username: this.username
          };
          console.log(body);
          this.$http
            .put(`${server.path}contacts/update`, body, {
              observe: "body"
            })
            .then(function(data) {
              console.log(data);
              this.$http
                .post(`${server.path}contacts/readcontacts`, body, {
                  observe: "body"
                })
                .then(data => {
                  console.log(data);
                  this.contacts = data.body;
                  this.$toaster.info("Your Contact is Successfully Edited");
                });
              this.contact = this.defaultItem;
              localStorage.removeItem("id");
              localStorage.removeItem("name");
              localStorage.removeItem("num1");
              localStorage.removeItem("num2");
              localStorage.removeItem("email");
              localStorage.removeItem("add");
              localStorage.removeItem("category");
              this.editedIndex = -1;
              this.radios = "All";
              this.$router.push("/contacts");
            });
        } else {
          var body = {
            name: this.contact.name,
            primarynumber: this.contact.primarynumber,
            secondarynumber: this.contact.secondarynumber,
            email: this.contact.email,
            address: this.contact.address,
            category: this.contact.category,
            username: this.username
          };
          console.log(body);
          this.$http
            .post(`${server.path}contacts/store`, body, {
              observe: "body"
            })
            .then(function(data) {
              console.log(data);
              this.$http
                .post(`${server.path}contacts/readcontacts`, body, {
                  observe: "body"
                })
                .then(data => {
                  console.log(data);
                  this.contacts = data.body;
                  this.$toaster.success("Your Contact is Successfully Stored");
                });
            });
          this.submitted = true;
          this.$router.push("/contacts");
        }
        this.radios = "All";
      }
    },
    reset() {
      this.contact = Object.assign({}, this.defaultItem);
    },
    close() {
      localStorage.removeItem("id");
      localStorage.removeItem("name");
      localStorage.removeItem("num1");
      localStorage.removeItem("num2");
      localStorage.removeItem("email");
      localStorage.removeItem("add");
      localStorage.removeItem("category");
      this.editedIndex = -1;
      this.$router.push("/contacts");
    }
  }
};
</script>

<style>
#image-container {
  width: 35px;
  height: 35px;
  border-radius: 100%;
  background-color: violet;
  text-align: center;
  display: inline-block;
  line-height: 35px;
  font-weight: 500;
  font-size: 30px;
}
#editdelete{
  margin: auto;
}
</style>