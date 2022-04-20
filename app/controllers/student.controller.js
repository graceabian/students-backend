const db = require("../models");
const Student = db.students;

exports.create = (req, res) => {
  const errors = [];
  if (!req.body.name) {
    errors.push("Name cannot be empty!");
  }

  if (!req.body.age) {
    errors.push("Age cannot be empty!");
  }

  if (!req.body.gender) {
    errors.push("Gender cannot be empty!");
  }

  if (errors.length > 0) {
    let errorMessage = JSON.stringify(errors);
    res.status(400).send({ message: errorMessage });
    return;
  }

  // create mongo model
  const student = new Student({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
  });

  // save in db
  student
    .save(student)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Unable to create Student - Error.",
      });
    });
};

exports.findAll = (req, res) => {
  console.log("Find all students");
  const name = req.query.name;

  var condition = name ? { name: name } : {};

  Student.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Unable to get Student",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Student.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Student not found with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Unable to get student with id=" + id });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Student.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Student with id=${id}`,
        });
      } else res.send({ message: "Student was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Student with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Student.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Student with id=${id}`,
        });
      } else {
        res.send({
          message: "Student was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Student with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Student.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Students were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error in deleting Students",
      });
    });
};
