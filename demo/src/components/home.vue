<template>
  <v-app id="home">
    <v-navigation-drawer v-model="drawer" app class="sidebar">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <h1 style="color:Black:">Welcome {{username}}</h1>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="load">
          <v-list-item-action>
            <v-icon>mdi-contacts</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contacts</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="categories">
          <v-list-item-action>
            <v-icon>mdi-filter-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Categories</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-row>
        <v-col cols="9">
          <v-toolbar-title>
            <h2>CONTACT FORM</h2>
          </v-toolbar-title>
        </v-col>
        <v-col cols="3" style="text-align='right';">
          <h2>{{username}}</h2>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row align="center" justify="center">
          <v-col>
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import AddContact from "./AddContact";
import Contacts from "./contacts";
import Categories from "./Categories";
import server from "../constant";

export default {
  props: {
    source: String
  },
  data() {
    return {
      drawer: null,
      username: "",
      startToCheck: null
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
    load() {
      this.$router.push("/contacts");
    },
    toaddcontact() {
      this.$router.push("/addcontact");
    },
    categories() {
      this.$router.push("/categories");
    },
    startChecking() {
      var body = {
        username: this.username
      };
      this.startToCheck = setInterval(() => {
        this.$http
          .post(`http://localhost:3000/contacts/deleteDuplicateImage`, body)
          .then(function() {
            // this.$toaster.success("Duplicate Images are Deleted");
          });
      }, 1000 * 60 * 60);
    }
  },
  components: {
    contacts: Contacts,
    addcontact: AddContact,
    categories: Categories
  },
  created() {
    this.username = localStorage.getItem("username");
    this.startChecking();
  },
  beforeDestroy() {
    clearInterval(this.startToCheck);
  }
};
</script>

<style  scoped>
.sidebar {
  background-color: beige;
}
</style>