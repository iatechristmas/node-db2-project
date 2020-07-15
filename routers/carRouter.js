const express = require("express");
const db = require("../dbConfig");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cars = await db("cars");
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Failed to get cars", error: err });
  }
});

router.get("/:id", validateId, async (req, res) => {
  const { id } = req.params;
  try {
    const [car] = await db("cars").where("id", id);
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Failed to get car", error: err });
  }
});

router.post("/", async (req, res) => {
  const carData = req.body;
  try {
    const car = await db("cars").insert(carData);
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: "Failed to add car", error: err });
  }
});

router.put("/:id", validateId, async (req, res) => {
  const { id } = req.params;
  try {
    const rowsUpdated = await db("cars").where("id", id).update(req.body);
    res.status(200).json({ updated: rowsUpdated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update car", error: err });
  }
});

router.delete("/:id", validateId, async (req, res) => {
  const { id } = req.params;
  try {
    const rowsDeleted = await db("cars").where("id", id).del();
    res.status(200).json({ deletedRecords: rowsDeleted });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete car", error: err });
  }
});

function intToBoolean(int) {
  return int === 1 ? true : false;
}

function carToBody(car) {
  return {
    ...car,
    completed: intToBoolean(car.completed),
  };
}

function get(id) {
  let query = db("cars");

  if (id) {
    return query
      .where("id", id)
      .first()
      .then((car) => {
        if (car) {
          return carToBody(car);
        } else {
          return null;
        }
      });
  } else {
    return query.then((cars) => {
      return cars.map((car) => carToBody(car));
    });
  }
}

function validateId(req, res, next) {
  const { id } = req.params;
  get(id)
    .then((car) => {
      if (car) {
        req.id = id;
        next();
      } else {
        res.status(400).json({ message: "No car with that ID was found" });
      }
    })
    .catch((err) => {
      console.log("validateId error: ", err);
      res.status(500).json(err.message);
    });
}

module.exports = router;
