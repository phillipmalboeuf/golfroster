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
  player_id,
  sent_by_id,
  type,
  subject_id,
  subject_name,
) {
  const sent_by =
    sent_by_id &&
    (await admin
      .firestore()
      .collection('players')
      .doc(sent_by_id)
      .get()).data();

  return admin
    .firestore()
    .collection('players')
    .doc(player_id)
    .collection('notifications')
    .add({
      type,
      subject_id,
      subject_name,
      ...(sent_by && {
        sent_by_id,
        sent_by_name: `${sent_by.first_name} ${sent_by.last_name}`,
      }),
      date: new Date(),
    });
}

exports.inviteToGroup = functions.firestore
  .document('groups/{groupId}/invitations/{id}')
  .onCreate(async (snapshot, {params}) => {
    const invitation = snapshot.data();
    const group = (await admin
      .firestore()
      .collection('groups')
      .doc(params.groupId)
      .get()).data();

    return await sendNotification(
      invitation.player_id,
      invitation.invited_by,
      'group',
      params.groupId,
      group.name,
    );
  });

exports.inviteToEvent = functions.firestore
  .document('events/{eventId}/invitations/{id}')
  .onCreate(async (snapshot, {params}) => {
    const invitation = snapshot.data();
    const event = (await admin
      .firestore()
      .collection('events')
      .doc(params.eventId)
      .get()).data();

    return await sendNotification(
      invitation.player_id,
      invitation.invited_by,
      'event',
      params.eventId,
      event.name,
    );
  });

// exports.friendRequest = functions.firestore
//   .document('players/{playerId}')
//   .onWrite(async (change, {params}) => {
//     const player = change.after.data();
//     const previous = change.before.data();
//     const players = player.friends.filter(
//       player => !previous.friends.includes(player),
//     );

//     return sendNotification(
//       players,
//       'friend',
//       params.playerId,
//       `${player.first_name} ${player.last_name}`,
//     );
//   });

exports.acceptedNotification = functions.firestore
  .document('players/{playerId}/notifications/{id}')
  .onWrite(async (change, {params}) => {
    const notification = change.after.data();

    return (
      notification.accepted &&
      notification.sent_by_id &&
      sendNotification(
        notification.sent_by_id,
        params.playerId,
        `${notification.type}_accepted`,
        notification.subject_id,
        notification.subject_name,
      )
    );
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
