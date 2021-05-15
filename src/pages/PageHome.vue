<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            class="newtweet"
            v-model="newTweetContent"
            placeholder="What's happening?"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img
                  src="https://avatars.githubusercontent.com/u/32111854?v=4"
                />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewTweet"
            :disable="!newTweetContent"
            class="q-mb-lg"
            unelevated
            rounded
            color="primary"
            label="Tweet"
            no-caps
          />
        </div>
      </div>
      <q-separator size="10px" color="grey-2" class="divider"/>

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="tweet in tweets" :key="tweet.id" class="tweet q-py-md">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img
                  src="https://avatars.githubusercontent.com/u/32111854?v=4"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1"
                ><strong>Arsene Indamutsa</strong>
                <span class="text-grey-7"
                  >__arsene__
                  <br class="lt-md" />
                  &bull; {{ tweet.date | relativeDate }}
                </span>
              </q-item-label>
              <q-item-label class="tweetcontent  text-body1">
                {{ tweet.content }}
              </q-item-label>

              <div class=" tweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="far fa-comment"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
                <q-btn
                  @click="toggleLike(tweet)"
                  flat
                  round
                  :color="tweet.liked ? 'pink' : 'grey'"
                  size="sm"
                  :icon="tweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                />
                <q-btn
                  @click="deleteTweet(tweet)"
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group> </q-list
    ></q-scroll-area>
  </q-page>
</template>

<script>
import { formatDistance } from "date-fns";
import db from "src/boot/firebase";

export default {
  name: "PageHome",
  data() {
    return {
      newTweetContent: "",
      tweets: [
        // {
        //   id: "IDQ",
        //   content:
        //     "'Man cannot discover new oceans unless he has the courage to lose sight of the shore.'- AndrÃ© Gide",
        //   date: 1621062209597,
        //   liked: false
        // },
        // {
        //   id: "IDE",
        //   content:
        //     "I always wanted to be somebody, but I should have been more specific",
        //   date: 1621065632233,
        //   liked: true
        // }
      ]
    };
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    }
  },
  methods: {
    addNewTweet() {
      let newTweet = {
        content: this.newTweetContent,
        date: Date.now(),
        liked: false
      };
      // Add a new document with a generated id.
      db.collection("tweets")
        .add(newTweet)
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
      // this.tweets.unshift(newTweet);
      this.newTweetContent = "";
    },
    deleteTweet(tweet) {
      // let dateToDelete = tweet.date;
      // let index = this.tweets.findIndex(tweet => tweet.date === dateToDelete);
      // console.log(index);
      // this.tweets.splice(index, 1);

      db.collection("tweets")
        .doc(tweet.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch(error => {
          console.error("Error removing document: ", error);
        });
    },
    toggleLike(tweet) {
      return db
        .collection("tweets")
        .doc(tweet.id)
        .update({
          liked: !tweet.liked
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch(error => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }
  },
  mounted() {
    db.collection("tweets")
      .orderBy("date")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          let tweetChange = change.doc.data();

          tweetChange.id = change.doc.id;

          if (change.type === "added") {
            console.log("New tweet: ", tweetChange);
            this.tweets.unshift(tweetChange);
          }
          if (change.type === "modified") {
            console.log("Modified tweet: ", change.doc.data());
            let index = this.tweets.findIndex(
              tweet => tweet.id === tweetChange.id
            );
            Object.assign(this.tweets[index], tweetChange);
          }
          if (change.type === "removed") {
            let index = this.tweets.findIndex(
              tweet => tweet.id === tweetChange.id
            );
            this.tweets.splice(index, 1);
          }
        });
      });
  }
};
</script>
<style lang="sass">
.newtweet
  textarea
   font-size: 19px
   line-height: 1.4 !important

.divider
  border-top: 1px
  border-bottom:1px
  border-color: $grey-4

.tweetcontent
  white-space: pre-line

.tweet-icons
  margin-left: -5px

.tweet:not(:first-child)
  border-top: 1px solid rgba(0,0,0,0.12)
</style>
