const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({
  origin: true,
});

const stripe = require("stripe")(
  functions.config().stripe.secret
);

admin.initializeApp();

exports.createStripeCheckout =
  functions.https.onRequest(
    (req, res) => {

      cors(req, res, async () => {

        try {

          const {
            amount,
          } = req.body;

          const paymentIntent =
            await stripe.paymentIntents.create({
              amount,
              currency: "usd",
            });

          res.send({
            clientSecret:
              paymentIntent.client_secret,
          });

        } catch (error) {

          console.log(error);

          res.status(500).send(error);

        }

      });

    }
  );