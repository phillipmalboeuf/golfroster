const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

admin.initializeApp();

const CONFIG = functions.config();

exports.newMessage = functions.firestore
  .document('chatrooms/{chatroomId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const message = snapshot.data();
    return admin
      .firestore()
      .collection('chatrooms')
      .doc(context.params.chatroomId)
      .update({
        latest: {
          body: message.body,
          player_id: message.player_id,
          date: message.date,
        },
      });
  });

async function sendNotification(
  players,
  invitation_type,
  invited_to_id,
  invited_to_name,
) {
  // const invited_by =
  //   authType === 'USER' &&
  //   (await admin
  //     .firestore()
  //     .collection('players')
  //     .doc(auth.uid)
  //     .get());

  return (
    players.length &&
    players.map(player =>
      admin
        .firestore()
        .collection('players')
        .doc(player)
        .collection('notifications')
        .add({
          invitation_type,
          invited_to_id,
          invited_to_name,
          // ...(invited_by && {
          //   invited_by_id: auth.uid,
          //   invited_by_name: invited_by.data().name,
          // }),
          date: new Date(),
        }),
    )
  );
}

exports.inviteToGroup = functions.firestore
  .document('groups/{groupId}')
  .onWrite(async (change, {params, auth, authType}) => {
    const group = change.after.data();
    const previous = change.before.data();
    const players = group.invited.filter(
      player => !previous.invited.includes(player),
    );

    return sendNotification(players, 'group', params.groupId, group.name);
  });

exports.inviteToEvent = functions.firestore
  .document('events/{eventId}')
  .onWrite(async (change, {params, auth, authType}) => {
    const event = change.after.data();
    const previous = change.before.data();
    const players = event.invited.filter(
      player => !previous.invited.includes(player),
    );

    return sendNotification(players, 'event', params.eventId, event.name);
  });

const search = algoliasearch(CONFIG.algolia.id, CONFIG.algolia.key);

exports.indexPlayer = functions.firestore
  .document('players/{playerId}')
  .onWrite(async (change, context) => {
    const player = change.after.data();
    const index = search.initIndex('players');
    return index.saveObject({
      ...player,
      objectID: context.params.playerId,
    });
  });
