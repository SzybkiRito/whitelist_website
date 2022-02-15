<template>
  <main>
    <div class="centerWrapper" v-if="show">
      <span id="question" class="question ease-in">{{
        this.questions[this.questionNumber].question
      }}</span>

      <div id="inputAnwser" style="margin-top: 15px">
        <textarea id="" class="inputAnwser ease-in" v-model="answer"></textarea>
      </div>

      <div class="button--wrapper ease-in">
        <button class="nextButton" v-on:click="this.nextQuestion()">
          Dalej
        </button>
      </div>
    </div>

    <div class="centerWrapperEnd" v-if="show == false">
      Złożyłeś podanie na serwer Region Roleplay, w wiadomości prywatnej
      zostaniesz poinformowany o statusie twojego podania. Pamiętaj aby być na
      naszym serwerze discord w celu otrzymania powiadomieia.
    </div>

    <span class="usernameInfo ease-in"
      >Nazwa użytkownika: {{ this.discordData.discordName }}</span
    >
  </main>
</template>

<script>
// import { ref, onMounted } from 'vue'
import axios from "axios";

export default {
  name: "Whitelist",
  data() {
    return {
      answer: this.answer,
      questionNumber: 0,
      show: true,
      questions: [
        {
          questionNumber: 0,
          question: "Ile płatków jesz dziennie? (Podaj w gramach)",
        },
        {
          questionNumber: 1,
          question: "Ile płatków jesz dziennie? (Podaj w kilogramach)",
        },
        {
          questionNumber: 2,
          question: "Ile płatków jesz dziennie? (Podaj w tonach)",
        },
      ],
      allAnswers: [],
      discordData: {},
      redirect_uri: "",
      ip: ""
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
                redirect_uri: `${this.redirect_uri}`,
                scope: "identify",
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
                this.discordData = {
                  discordUserId: response.id,
                  discordName: response.username,
                  discordEmail: response.email,
                };
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
    async nextQuestion() {
      if (this.answer !== "") {
        let answerObj = {
          questionNumber: this.questionNumber,
          question: this.questions[this.questionNumber].question,
          answer: this.answer,
        };
        this.allAnswers.push(answerObj);

        if (this.questionNumber >= this.questions.length - 1) {
          axios
            .post(`http://${this.ip}/api/v1/auth/answer`, {
              answer: this.allAnswers,
              discordData: this.discordData,
            })
            .then((response) => {
              switch (response.data.msg) {
                case "Not Enough Characters":
                  console.log("Not enought letters");
                  break;
                case "Succesfull":
                  this.show = false;
                  break;
              }
            });
        } else {
          this.questionNumber++;
          this.answer = "";
          this.nextQuestion();
        }
      } else {
        return;
      }
    },
  },
  created() {
    this.getDiscordInformation();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

.centerWrapper {
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

.wrapper-end-display-none {
  display: none;
}

.centerWrapperEnd {
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

.wrapper-end-display {
  display: flex;
}

.question {
  width: 820px;
  font-weight: 300;
}

.button--wrapper {
  width: 820px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.nextButton {
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
}

.nextButton:hover {
  background-color: #11824d;
  transition: 0.7s ease;
}

.inputAnwser {
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
  outline: none;
  border: 5px solid white;
  border-radius: 10px;
  background-color: transparent;
  color: white;
  resize: none;
  width: 820px;
  height: 300px;
}

.usernameInfo {
  font-family: "Montserrat", sans-serif;
  color: white;
  position: absolute;
  top: 95%;
  left: 30px;
}

@media only screen and (max-width: 820px) {
  .inputAnwser {
    width: 320px;
  }

  .question {
    width: 320px;
  }

  .usernameInfo {
    top: 90%;
  }
}

@keyframes ease-in {
  0% {
    opacity: 0;
    margin-left: 150%;
  }
  100% {
    opacity: 1;
    margin-left: 0px;
  }
}

.ease-in {
  animation-duration: 2s;
  animation-name: ease-in;
  overflow-x: hidden;
}
</style>
