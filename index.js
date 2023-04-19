// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
  ref,
  set,
  onChildAdded,
  push,
  get,
  onChildChanged,
} from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhWYptjj88s1qre32DwsUhBARM0D5ZkN8",
  authDomain: "fir-test-e003d.firebaseapp.com",
  databaseURL:
    "https://fir-test-e003d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-test-e003d",
  storageBucket: "fir-test-e003d.appspot.com",
  messagingSenderId: "1002363761303",
  appId: "1:1002363761303:web:bd707f56fee9ae67e02fd2",
  measurementId: "G-5EEFGW2XYW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

const queue = ref(rtdb, "queue/");

onChildAdded(queue, (snapshot) => {
  // if queue has 2 players adduserstoLobby
  const queueRef = ref(rtdb, "queue/");
  get(queueRef).then((snapshot) => {
    const queueLength = snapshot.size;
    if (queueLength >= 2) {
      const queue = snapshot.val();
      let player1 = {};
      let player2 = {};
      for (let i = 0; i < 2; i++) {
        const key = Object.keys(queue)[i];
        const playerObject = queue[key];
        if (i === 0) {
          player1 = { playerObject, key };
        }
        if (i === 1) {
          player2 = { playerObject, key };
        }
      }
      addUserstoLobby(player1, player2);
    }
  });
});

function addUserstoLobby(player1, player2) {
  // remove user from queue
  const lobbies = ref(rtdb, "lobbies/");
  const games = push(lobbies);
  const player1Ref = ref(rtdb, "queue/" + player1.key);
  const player2Ref = ref(rtdb, "queue/" + player2.key);
  console.log("player1", player1);
  console.log("player2", player2);

  set(player1Ref, null);
  set(player2Ref, null);

  // get the key of the new lobby
  const lobbyKey = games.key;
  set(ref(rtdb, "lobbies/" + lobbyKey), {
    player1: player1.playerObject,
    player2: player2.playerObject,
  });
  set(ref(rtdb, "lobbies/" + lobbyKey + "/score/"), {
    player1: 0,
    player2: 0,
  });
  set(ref(rtdb, "lobbies/" + lobbyKey + "/ready/"), {
    player1: false,
    player2: false,
  });
}
