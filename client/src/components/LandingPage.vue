<template>
  <main>
    <div class="wrapper">
      <div class="serverName">
        <span class="serverTitle">Region Roleplay</span>
      </div>

      <div class="subtitle">
        <span>Whitelist</span>
      </div>

      <div class="joinWrapperButton" style="margin-top: 10px">
        <button class="joinButton" v-on:click="discordOAuth()">Dołącz</button>
         <button class="joinButton" v-on:click="discordOAuthAdmin()" style="margin-left: 10px;">Admin</button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "LandingPage",
  methods: {
    discordOAuth() {
      window.location.href ="https://discord.com/api/oauth2/authorize?client_id=940992495322533929&redirect_uri=http%3A%2F%2F134.255.217.116%2Fwhitelist&response_type=code&scope=identify%20email%20guilds";
    },
    discordOAuthAdmin() {
      window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=940992495322533929&redirect_uri=http%3A%2F%2F134.255.217.116%2Fdashboard&response_type=code&scope=identify';
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  height: 100vh;
  font-family: "Montserrat", sans-serif;
  color: white;
  background-image: url("../assets/background.png") !important;
  background-size: cover;
}

.serverTitle {
  text-transform: uppercase;
  font-size: 64px;
}

.subtitle {
  text-transform: uppercase;
  color: #c7c7c7;
  text-align: right;
  font-size: 48px;
  line-height: 15px;
}

.wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
}

.joinWrapperButton {
  display: flex;
  align-items: center;
  justify-content: center;
}

.joinButton {
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
  font-size: 36px;
  text-transform: uppercase;
  width: 286px;
  height: 89px;
  border-radius: 35px;
  color: white;
  background-color: #6e1ebd;
  outline: none;
  border: 1px solid #fff;
  margin-top: 20px;
}

.joinButton:hover {
  background-color: #11824d;
  transition: 0.7s ease;
}
</style>
