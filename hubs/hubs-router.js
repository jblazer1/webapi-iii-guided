const express = require("express");

const Hubs = require("./hubs-model.js");
const Messages = require("../messages/messages-model.js");

const router = express.Router();

// this only applys to this particular hubs router
router.use((req, res, next) => {
  console.log("Hubs Router, woohoo!");
  next();
});

// this only runs if the url has /api/hubs in it
router.get("/", async (req, res) => {
  try {
    const hubs = await Hubs.find(req.query);
    res.status(200).json(hubs);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the hubs"
    });
  }
});

router.get("/:id", validateId, (req, res) => {
  res.status(200).json(req.hub);
});

// because of the validateId middleware the below code can be written as above
// /api/hubs/:id
// router.get("/:id", validateId, async (req, res) => {
//   try {
//     const hub = await Hubs.findById(req.params.id);

//     if (hub) {
//       res.status(200).json(hub);
//     } else {
//       res.status(404).json({ message: "Hub not found" });
//     }
//   } catch (error) {
//     // log error to server
//     console.log(error);
//     res.status(500).json({
//       message: "Error retrieving the hub"
//     });
//   }
// });

router.post("/", requiredBody, async (req, res) => {
  try {
    const hub = await Hubs.add(req.body);
    res.status(201).json(hub);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error adding the hub"
    });
  }
});

router.delete("/:id", validateId, async (req, res) => {
  try {
    const count = await Hubs.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "The hub has been nuked" });
    } else {
      res.status(404).json({ message: "The hub could not be found" });
    }
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error removing the hub"
    });
  }
});

router.put("/:id", requiredBody, validateId, async (req, res) => {
  try {
    const hub = await Hubs.update(req.params.id, req.body);
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: "The hub could not be found" });
    }
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error updating the hub"
    });
  }
});

// add an endpoint that returns all the messages for a hub
// this is a sub-route or sub-resource
router.get("/:id/messages", validateId, async (req, res) => {
  try {
    const messages = await Hubs.findHubMessages(req.params.id);

    res.status(200).json(messages);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error getting the messages for the hub"
    });
  }
});

// add an endpoint for adding new message to a hub
router.post("/:id/messages", requiredBody, validateId, async (req, res) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  try {
    const message = await Messages.add(messageInfo);
    res.status(210).json(message);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error getting the messages for the hub"
    });
  }
});

async function validateId(req, res, next) {
  try {
    const { id } = req.params;
    const hub = await Hubs.findById(id);
    if (hub) {
      req.hub = hub;
      next();
    } else {
      res.status(404).json({ message: "Hub not found; invalid id" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to process request " });
  }
}

function requiredBody(req, res, next) {
  if (req.body && Object.keys(req.body).length) {
    // if next has no parameters it will go to the next bit of middleware
    next();
  } else {
    // if next is called with a parameter it will jump to an error handler bit of middleware
    next({ message: "This is from the next call in the requireBody function" });
    // the below error handler is replaced with the above error handler
    // res.status(400).json({ message: "Please include request body" });
  }
}

module.exports = router;
