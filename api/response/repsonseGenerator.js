module.exports = {
  fetchedAllRecords: (docs, response, model_name) => {
    if (docs.length === 0) {
      response.status(404).json({
        message: "Oops No records found in database"
      });
    } else if (docs.length > 0) {
      let documents = {};
      documents[model_name] = docs;
      response.status(200).json({
        totRecords: docs.length,
        documents
      });
    }
  },
  fetchById: (result, response) => {
    if (result) {
      response.status(200).json({
        order: result
      });
    } else {
      response.status(404).json({
        message: "No record's found in database"
      });
    }
  },
  postRequestResponse: (result, response, model_name) => {
    if (result) {
      response.status(201).json({
        message: "Post request for " + model_name + " is successfull",
        request: {
          type: "GET",
          url: "http://localhost:3000/" + model_name + "/" + result._id
        }
      });
    }
  },
  updatedById: (result, response, model_name, update_id) => {
    if (result.n > 0) {
      response.status(200).json({
        message: `${model_name} is Updated`,
        request: {
          type: "GET",
          url: "http://localhost:3000/" + model_name + "/" + update_id
        }
      });
    } else {
      response.status(404).json({
        message: `${model_name} id : ${update_id} not found.`
      });
    }
  },
  deletedById: (result, response, model_name, deleted_Id) => {
    if (result.n > 0) {
      response.status(200).json({
        message: `${model_name} id : ${deleted_Id} is deleted.`,
        result: result
      });
    } else {
      response.status(404).json({
        message: `${model_name} id : ${deleted_Id} not found.`
      });
    }
  },
  handleErrorReceived: (error, response) => {
    response.status(500).json({
      message: error.message
    });
  }
};
