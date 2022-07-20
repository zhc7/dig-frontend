<template>
  <div>
    <v-container>
      <v-row>
        <v-col sm="6" cols="12">
          <v-row v-for="(p, index) in players">
            <v-col cols="8">
              <v-card class="mb-2" :class="{'dead-card': p['died']}">
                <v-card-title>
                  <font-awesome-icon :icon="'fas fa-'+(p['died']?'skull':'user')" :style="{color: p['died'] ? 'red' : 'green'}" />
                  玩家：{{ index }}
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="6" v-for="(attrName, attr) in attrs">
                      {{ attrName }}：{{ p[attr] }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col class="action-col">
              <span v-if="historyActions.length >= 2" class="action-span">
                <font-awesome-icon :icon="'fa-solid fa-' + icons[historyActions[historyActions.length - 2][index]]"/>
                {{ actions[historyActions[historyActions.length - 2][index]] }}
              </span>
            </v-col>
          </v-row>
        </v-col>
        <v-col md="6">
          <v-row v-if="!isMobile">
            <v-col class="dig-title">
              <span>
                <font-awesome-icon icon="fas fa-person-digging" class="dig-title-icon"/>
              </span>
              <br>
              掘！
            </v-col>
          </v-row>
          <v-row v-if="!isMobile">
            <v-col sm="4"/>
            <v-col sm="4">
              <v-btn @click="refresh" block class="mt-3 mb-5">
                <font-awesome-icon icon="fas fa-rotate"/>
                重新开始
              </v-btn>
            </v-col>
            <v-col sm="4"/>
          </v-row>
          <v-row>
            <v-col v-for="(actionName, actionId) in actions" cols="3">
              <v-btn :id="actionId" @click="postAction(actionId)" :disabled="!availableActions.includes(actionId)"
                     block>
                <font-awesome-icon :icon="'fa-solid fa-' + icons[actionId]"/>
                {{ actionName }}
              </v-btn>
            </v-col>
            <v-col cols="6" v-if="isMobile">
              <v-btn @click="refresh" block>
                <font-awesome-icon icon="fas fa-rotate"/>
                重新开始
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

const apiRoot = "";

export default {
  name: "index",
  data() {
    return {
      players: {},
      actions: {
        j: "掘", t: "塔", by: "兵营", b: "兵", bt: "抱头", fs: "防射",
        fm: "防猛", fg: "防高", fk: "防砍", s: "射", gs: "高射", mj: "猛进", k: "砍", xd: "下地"
      },
      icons: {
        j: "hammer",
        t: "chess-rook",
        by: "tents",
        b: "person-rifle",
        bt: "helmet-safety",
        fs: "user-shield",
        fm: "backward-fast",
        fg: "people-roof",
        fk: "shield-halved",
        s: "crosshairs",
        gs: "meteor",
        mj: "backward",
        k: "bolt",
        xd: "explosion"
      },
      availableActions: ["j"],
      registered: false,
      attrs: {"jue": "掘", "tower": "塔", "baotou": "抱头", "defended_rush": "防猛次数", "soldier": "兵"},
      historyActions: [{1: "j"}],
      isWin: false,
      winner: "",
      isMobile: document.body.clientWidth < 600,
    }
  },
  watch: {},
  methods: {
    postAction(actionId) {
      this.historyActions[this.historyActions.length - 1]["0"] = actionId;
      $fetch(apiRoot + "/api/action",
          {
            method: "POST",
            body: {
              action: actionId
            }
          }).then(response => {
        let resPlayers = response["players"];
        for (let i in this.players) {
          if (i in resPlayers) {
            this.players[i] = resPlayers[i];
          } else {
            this.players[i]["died"] = true;
          }
        }
        if (response["isWin"]) {
          this.winner = response["winner"];
          this.isWin = true;
          this.availableActions = [];
        } else {
          this.availableActions = response["availableActions"];
        }
        this.historyActions.push({1: response["action"]});
      })
    },
    register() {
      $fetch(apiRoot + "/api/register",
          {
            method: "POST",
          }).then(response => {
        if (response["status"] === "ok") {
          this.registered = true;
          this.players = response["players"];
        }
      })
    },
    refresh() {
      $fetch(apiRoot + "/api/refresh",
          {
            method: "POST"
          }).then(response => {
        this.players = response["players"];
        this.availableActions = ["j"];
        this.isWin = false;
        this.winner = "";
        this.historyActions = [{1: "j"}];
      })
    }
  },
  computed: {},
  mounted() {
    this.register();
  }
}
</script>

<style scoped>
.dig-title-icon {
  font-size: 10rem;
}

.dig-title {
  font-size: 5rem;
  text-align: center;
  color: greenyellow;
  font-family: lyls, LiSu, serif;
  font-weight: normal;
}

.dead-card {
  background-color: lightgrey;
}

.action-col {
  margin: auto;
  text-align: center;
  color: #43c0ff;
}

.action-span {
  background-color: #e5e5e5;
  border-radius: 0.8rem;
  padding: 1rem;
}
</style>