<template>
  <main v-if="show">
    <div class="centerWrapper">
      <div class="userData" v-if="!showNotification">
        <span>Nazwa użytkownika: {{ username }}</span>
        <span>Discord User ID: {{ discordUserId }}</span>
        <span>Email użytkownika: {{ discordUserEmail }}</span>
        <div class="userQuestions" v-bind:key="item" v-for="item in object">
          <span>Pytanie: {{ item.question }}</span>
          <span>Odpowiedź: {{ item.answer }}</span>
        </div>
      </div>
      <div class="buttonsWrapper" v-if="!showNotification">
        <button v-on:click="acceptApplication()">Akceptuj</button>
        <button v-on:click="rejectApplication()">Odrzuć</button>
      </div>
      <div class="userData" v-if="showNotification">
        <span>Brak nowych podań</span>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
export default {
  name: "Dashboard",
  data() {
    return {
      show: false,
      username: "",
      discordUserId: "",
      discordUserEmail: "",
      adminDiscordUserId: "",
      object: [],
      token: "",
      showNotification: false,
      ip: ''
    };
  },
  methods: {
    async getDiscordInformation() {
      let uri = new URLSearchParams(document.location.search);
      const code = uri.get("code");

      if (code) {
        try {
          const oauthResult = await fetch(
            "https://discord.com/api/oauth2/token",
            {
              method: "POST",
              body: new URLSearchParams({
                client_id: process.env.VUE_APP_CLIENTID,
                client_secret: process.env.VUE_APP_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_uri: `http://${this.ip}/dashboard`,
                scope: "identify",
                ip: ""
              }),
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          const oauthData = await oauthResult.json();
          if (oauthData.access_token) {
            fetch(`https://discord.com/api/users/@me`, {
              headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
              },
            })
              .then((result) => result.json())
              .then((response) => {
                this.getAdmins().then((result) => {
                  result.forEach((element) => {
                    if (element.discordUserId == response.id) {
                      axios
                        .post(`http://${this.ip}/api/v1/dashboard/login`, {
                          username: response.id,
                        })
                        .then(async (res3) => {
                          this.adminDiscordUserId = response.id;
                          this.token = res3.data.token;
                          this.show = true;

                          this.generateQuestions();
                        });
                    } else {
                      window.location.href = `http://${this.ip}/`;
                    }
                  });
                });
              })
              .catch(console.error);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("Authentication error");
      }
    },
    async getAdmins() {
      const admins = await fetch(`http://${this.ip}/api/v1/dashboard/`, {
        method: "GET",
      });
      const adminsData = await admins.json();
      return adminsData.msg;
    },
    async generateQuestions() {
      const questionsQuery = await fetch(
        `http://${this.ip}/api/v1/dashboard/getQuestions/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      const questionsJson = await questionsQuery.json();
      const questions = questionsJson.msg;

      if (questions.length == 0) {
        this.showNotification = true;
        return;
      }

      this.username = questions[0].discordName;
      this.discordUserId = questions[0].discordUserId;
      this.discordUserEmail = questions[0].discordEmail;
      const allAnswers = JSON.parse(questions[0].answers);
      this.object = allAnswers;
    },
    async acceptApplication() {
      axios
        .post(
          `http://${this.ip}/api/v1/dashboard/accept/`,
          {
            discordUserId: this.discordUserId,
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.msg == "Succesfull") {
            axios.post(
              `http://${this.ip}/api/v1/dashboard/userId/`,
              {
                discordUserId: this.discordUserId,
                adminDiscordUserId: this.adminDiscordUserId,
                action: "accept",
              },
              {
                headers: {
                  Authorization: `Bearer ${this.token}`,
                },
              }
            );

            this.generateQuestions();
          }
        });
    },
    async rejectApplication() {
      axios
        .post(
          `http://${this.ip}/api/v1/dashboard/reject/`,
          {
            discordUserId: this.discordUserId,
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.msg == "Succesfull") {
            axios.post(
              `http://${this.ip}/api/v1/dashboard/userId/`,
              {
                discordUserId: this.discordUserId,
                adminDiscordUserId: this.adminDiscordUserId,
                action: "reject",
              },
              {
                headers: {
                  Authorization: `Bearer ${this.token}`,
                },
              }
            );

            this.generateQuestions();
          }
        });
    },
  },
  created() {
    this.getDiscordInformation();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  -webkit-scrollbar: none;

  min-height: 100vh;
  background-color: #202020;
  font-family: "Montserrat", sans-serif;
  color: white;
}

.centerWrapper {
  height: 700px;
  width: 50%;
  border: 3px solid white;
  border-radius: 10px;
}

.userData {
  display: flex;
  flex-direction: column;
  margin: 15px;
}

.userQuestions {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

button {
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
  font-size: 24px;
  text-transform: uppercase;
  width: 150px;
  height: 50px;
  border-radius: 35px;
  color: white;
  background-color: #6e1ebd;
  outline: none;
  border: 1px solid #fff;
  margin-top: 20px;
  flex-wrap: wrap;
  margin-left: 15px;
}

button:hover {
  background-color: #11824d;
  transition: 0.7s ease;
}
</style>
