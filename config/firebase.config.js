const { auth } = require("firebase-admin");
const admin = require("firebase-admin");
const firebaseConfig = {
  "type": "service_account",
  "project_id": "rmr-silk",
  "private_key_id": "d929d462b40bdc1ce201b9c956ee73a739c916ae",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzDENB/1w1UJRS\n8I2KckOTCZDZGKBJqTDNj/MAECDyCV3amNACGbXvh3JLVRYjV1A6MlTwe5FpuJzb\n4mltP5sHR7i8F2sF8VeaLyYbCV3Z29xs2Moe3HaYS0v1r+rImkU+qu9D5n/gGcyl\nSYRBmyODAWkzhQVvL4SZ9bMUuA/jGHaI7fdXJgWNfL+gPqAxrePsQW44uZzzjYDK\nMYdXZdrmcO1ZcWim+Z/j8NfACr8+/lDdLD9YJSF3+eit7a2lw2a0UNjUaYASgVmu\nNBw3X+FWy1wh55eXIc/cFm+uDmHtbUV7KtyOuj/b/dMMsu2gx+lsmwQCw3UySArp\n2Kf2KbIZAgMBAAECggEANtMc7yMFtY+Qc1sURB3b4jSuJUO8pQGJH5Ch7FWD+Qj0\nM6DSJKqBwrAbR8Tsi/LK7p8F0kNMEe7FHTFVbe3phw+nmfSjwUSWufAQ/3tdQP3p\nH208arnAGL8JqdftkPJoHJnTvNtiMZlEyCHcPQiHlbBDadKkCNkohcotxTzdJICP\nKQvKTImOoakUqIV+ri8Tz+N2C9ObgxBWmEGigpAa0sBeknL8SBBhaAP2wbET3uuR\nT/+NSfJ/mvzFtxjDH08KAvVUVfhh3VySPEOL1GkTm7tokNnU2NK39M1AXYfWGyVR\nKdb8kmfArNQlZB3gIKLYvcasBKVO0CbQmzC+IDFX/wKBgQD3EwIAJrLFAGxkOOMU\nUA0ZFwfkl7Ch+YAv42zcgJh/5IuMgu/Fr+pXRu0mvMXY4BAYJcPinBc6+6mONzrP\ns2vgfY0dY4bBEOiBRa0gpiyx6xdDKkKEhAARx9KL+7F8Q8OYq/mIaHWexrBGmaJ6\nzB02cq6fh0peBSDPgZKS+Jm4+wKBgQC5hCI0JoiUYWnN/4H7At6RYEWgKrmnQ3UX\nfNNDpulAALaqIqBYkoOGer6aTa0XaJad2+nULYlStzh7iAXeBBJtttipnz+BBGKg\niPVNta+dwgrUBOaNqsDuz3iA2jGhVJTR4qoMfr8BbdNdvjFgo6EiCwTRfIIvz4C8\n5Yk/6Xu8+wKBgQDxKqqPPzbMOIeUpDpy/1hpnyNjK/WLhSBsng8KhLNWUt0sADrO\nudGB84dUgnqUINFU4Lf9n+LE/hUY7iwHxNiNvb9aamWEWl64oCxHbCzAVfrU4pEf\nDEGNGYEYhktOQk7P3T2qulvk6Yfywc/pEQeKuBJfQQ2EDHlkUtOhhet2tQKBgBwJ\nC+I1sI476nFnG42DcX8mvV7nFgdg+mECTCr9HmK9uN0dPn4kJhw8kHFhK7dN5vUU\nNtIJz6bgaXjBpaFXnDFYYIXBuycUMpNwHyIPQurkWB6SXwUpuN5eHCfc0YM/9P2C\n84/P162vmzGffHbOQ5uRbrj5x/LRuPLS/VrbPgfhAoGAQHvsa7jIMeIY5O2tsp/b\nVnekVDapDF/doZh20TAcVQ1R6vNfnSe6vi4FSlP0gSwOoICBR6XjnHZR4FuPtXQ4\nEOwXQFupWaf4ymsNCIhHgQGPZ3Df4g0iOXYsU+r/Usbujom0wVzOk2R5g50hn6AH\nlKUY2ralB3tETbmHrWyUv6U=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-n5w56@rmr-silk.iam.gserviceaccount.com",
  "client_id": "112362474556379647537",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n5w56%40rmr-silk.iam.gserviceaccount.com"
}

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://rmr-silk.firebaseio.com"
});


module.exports.sendFirebaseNotification = (payload, token, callback) => {
  if (token.length == 0) {
    callback("Empty Token");
    return;
  }
  admin.messaging().sendToDevice(
    token, payload).then(info => {
      callback(null, info);
    }).catch(err => {
      callback(err);
    });
}

module.exports.verifyIdToken = (idToken, callback) => {
  if (!idToken) {
    callback("Empty Token");
    return;
  }
  admin.auth().verifyIdToken(idToken).then(decodedToken => {
    callback(null, decodedToken);
  }).catch(err => {
    callback(err);
  });
}

module.exports = {
  ...module.exports,
  getFirebaseUser(uid, cb) {
    admin.auth().getUser(uid)
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());
        cb(null, userRecord.toJSON());
      })
      .catch(function (error) {
        console.log('Error fetching user data:', error);
        cb(error);
      });
  },
  getFirebaseUserByMail(email, cb) {
    admin.auth().getUserByEmail(email)
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());
        cb(null, userRecord.toJSON());
      })
      .catch(function (error) {
        console.log('Error fetching user data:', error);
        cb(error);
      });
  },
  getFirebaseUserByPhone(phoneNumber, cb) {
    admin.auth().getUserByPhoneNumber(phoneNumber)
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());
        cb(null, userRecord.toJSON());
      })
      .catch(function (error) {
        console.log('Error fetching user data:', error);
        cb(error);
      });
  },
  createFirebaseUser(user,cb){
    // Example
    // user={
    //   email: 'user@example.com',
    //   emailVerified: false,
    //   phoneNumber: '+11234567890',
    //   password: 'secretPassword',
    //   displayName: 'John Doe',
    //   photoURL: 'http://www.example.com/12345678/photo.png',
    //   disabled: false
    // }

    admin.auth().createUser(user)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
        cb(null,userRecord);
      })
      .catch(function(error) {
        console.log('Error creating new user:', error);
        cb(error);
      });
  },
  updateFirebaseUser(user,cb){
    admin.auth().updateUser(user).then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully updated user', userRecord.toJSON());
      cb(null,userRecord);
    })
    .catch(function(error) {
      console.log('Error updating user:', error);
      cb(error);
    });
  },
  deleteFirebaseUser(uid,cb){
    admin.auth().deleteUser(uid)
  .then(function() {
    console.log('Successfully deleted user');
    cb(null,true);
  })
  .catch(function(error) {
    console.log('Error deleting user:', error);
    cb(error);
  });
  },
  listAllUsers(nextPageToken) {
    // List batch of users, 1000 at a time.
    admin.auth().listUsers(1000, nextPageToken)
      .then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
          console.log('user', userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch(function(error) {
        console.log('Error listing users:', error);
      });
  }
}









