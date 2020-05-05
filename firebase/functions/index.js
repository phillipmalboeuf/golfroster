const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

admin.initializeApp();

let CONFIG = functions.config();
const stripe = require('stripe')(CONFIG.stripe.key);

exports.newUser = functions.auth.user().onCreate(async user => {
  return await admin
    .firestore()
    .collection('players')
    .doc(user.uid)
    .set({
      email: user.email,
      friends: ['support'],
    });
});

exports.deleteUser = functions.auth.user().onDelete(async user => {
  return await admin
    .firestore()
    .collection('players')
    .doc(user.uid)
    .delete();
});

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

  console.log('SENDING', player_id);

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

exports.sendCloudNotification = functions.firestore
  .document('players/{playerId}/notifications/{id}')
  .onCreate(async (snapshot, {params}) => {
    const notification = snapshot.data();
    const player = (await admin
      .firestore()
      .collection('players')
      .doc(params.playerId)
      .get()).data();

    return (
      player.tokens &&
      (await admin.messaging().sendMulticast({
        tokens: player.tokens,
        notification: {
          group: {
            title: `Group Invitation`,
            body: `You were invited to join ${notification.subject_name}.`,
          },
          event: {
            title: `Event Invitation`,
            body: `You were invited to attend ${notification.subject_name}.`,
          },
          player: {
            title: `Friend Request`,
            body: `${notification.subject_name} has sent you a friend request.`,
          },
          group_accepted: {
            title: `Group Accepted`,
            body: `${
              notification.sent_by_name
            } has accepted your invitation to join ${
              notification.subject_name
            }!`,
          },
          event_accepted: {
            title: `Event Accepted`,
            body: `${
              notification.sent_by_name
            } has accepted your invitation to attend ${
              notification.subject_name
            }`,
          },
        }[notification.type],
        data: {
          type: 'notification',
        },
      }))
    );
  });

exports.sendCloudChat = functions.firestore
  .document('chatrooms/{chatroomId}/messages/{id}')
  .onCreate(async (snapshot, {params}) => {
    const message = snapshot.data();
    const chatroom = (await admin
      .firestore()
      .collection('chatrooms')
      .doc(params.chatroomId)
      .get()).data();

    const players = await Promise.all(
      chatroom.players.map(async player_id =>
        (await admin
          .firestore()
          .collection('players')
          .doc(player_id)
          .get()).data(),
      ),
    );

    console.log(players);

    const sender = await players.find(
      player => message.player_id === player.id,
    );
    console.log(sender);

    return players.map(
      async player =>
        player.tokens &&
        (await admin.messaging().sendMulticast({
          tokens: player.tokens,
          notification: {
            title: `${sender.first_name} ${sender.last_name}`,
            body: message.body,
          },
          data: {
            type: 'chat',
            id: chatroom.id,
          },
        })),
    );
  });

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

exports.friendRequest = functions.firestore
  .document('players/{playerId}')
  .onWrite(async (change, {params}) => {
    const player = change.after.data();
    const previous = change.before.data();
    const friends = player.friends.filter(
      friend => !previous.friends.includes(friend),
    );

    console.log(friends);

    return friends.map(friend => {
      return sendNotification(
        friend,
        player.id,
        'player',
        params.playerId,
        `${player.first_name} ${player.last_name}`,
      );
    });
  });

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

exports.unindexPlayer = functions.firestore
  .document('players/{playerId}')
  .onDelete(async (snapshot, context) => {
    const index = search.initIndex('players');
    return index.deleteObject(context.params.playerId);
  });

exports.indexGroup = functions.firestore
  .document('groups/{groupId}')
  .onWrite(async (change, context) => {
    const group = change.after.data();
    const index = search.initIndex('players');
    return index.saveObject({
      ...group,
      objectID: context.params.groupId,
    });
  });

exports.unindexGroup = functions.firestore
  .document('groups/{groupId}')
  .onDelete(async (snapshot, context) => {
    const index = search.initIndex('players');
    return index.deleteObject(context.params.groupId);
  });

exports.indexEvent = functions.firestore
  .document('events/{eventId}')
  .onWrite(async (change, context) => {
    const event = change.after.data();
    const index = search.initIndex('events');
    return index.saveObject({
      ...event,
      objectID: context.params.eventId,
    });
  });

exports.unindexEvent = functions.firestore
  .document('events/{eventId}')
  .onDelete(async (snapshot, context) => {
    const index = search.initIndex('events');
    return index.deleteObject(context.params.eventId);
  });

const server = express();

server.use(cors({origin: true}));
server.use(bodyParser.raw({type: 'application/json'}));
server.post('/', async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      CONFIG.stripe.webhook,
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  const subscription = event.data.object;
  const customer = await stripe.customers.retrieve(subscription.customer);

  const player = (await admin
    .firestore()
    .collection('players')
    .where('email', '==', customer.email)
    .get()).docs[0];

  const doc = admin
    .firestore()
    .collection('players')
    .doc(player.id);

  if (event.type === 'customer.subscription.created') {
    await doc.update({pro: true, subscription: subscription.id});
  } else if (event.type === 'customer.subscription.deleted') {
    await doc.update({pro: false, subscription: subscription.id});
  }

  return response.json({received: true});
});

exports.subscription = functions.https.onRequest(server);
