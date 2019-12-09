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
  invitation,
  invitation_type,
  invited_to_id,
  invited_to_name,
) {
  const invited_by =
    invitation.invited_by &&
    (await admin
      .firestore()
      .collection('players')
      .doc(invitation.invited_by)
      .get()).data();

  return admin
    .firestore()
    .collection('players')
    .doc(invitation.player_id)
    .collection('notifications')
    .add({
      invitation_type,
      invited_to_id,
      invited_to_name,
      ...(invited_by && {
        invited_by_id: invitation.invited_by,
        invited_by_name: `${invited_by.first_name} ${invited_by.last_name}`,
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
      invitation,
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
      invitation,
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
