const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const { hashedPassword, checkPassword } = require("../helper/bcrypt");
const { GraphQLError } = require("graphql");
const { createToken } = require("../helper/jwt");

class User {
  static collection() {
    return database.collection("User");
  }

  static async findUsers() {
    return this.collection().find().toArray();
  }

  static async findUserById(_id) {
    const data = this.collection().findOne({
      _id: new ObjectId(String(_id)),
    });
    return data;
  }

  static async searchUsers(name) {
    const userCollection = this.collection();
    return await userCollection
      .find(
        {
          $or: [
            { name: { $regex: name, $options: "i" } },
            { username: { $regex: name, $options: "i" } },
          ],
        },
        { password: 0 }
      )
      .toArray();
  }

  static async findLoggedInUSer(_id) {
    const data = this.collection().findOne({
      _id: new ObjectId(String(_id)),
    });
    return data;
  }

  static async createUser({ name, username, email, password }) {
    const schema = Joi.object({
      name: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (value.trim() === "") {
            return helpers.error("any.required");
          }
          return value;
        }),
      username: Joi.string()
        .required()
        .disallow(" ")
        .custom((value, helpers) => {
          if (value.trim() === "") {
            return helpers.error("any.required");
          }
          return value;
        })
        .custom((value, helpers) => {
          if (value.includes(" ")) {
            return helpers.error("string.invalid");
          }
          return value;
        })
        .messages({
          "string.invalid": "username cannot contain spaces",
        }),
      email: Joi.string()
        .email()
        .required()
        .custom((value, helpers) => {
          if (value.trim() === "") {
            return helpers.error("any.required");
          }
          return value;
        }),
      password: Joi.string()
        .min(5)
        .required()
        .custom((value, helpers) => {
          if (value.trim() === "") {
            return helpers.error("any.required");
          }
          return value;
        }),
    });
    const { error } = schema.validate({ name, username, email, password });
    if (error) {
      throw new GraphQLError(error.details[0].message, {
        extensions: { code: "BAD_REQUEST" },
      });
    }

    const existingUsername = await this.collection().findOne({ username });
    if (existingUsername) {
      throw new GraphQLError("Username already exists", {
        extensions: { code: "BAD_REQUEST" },
      });
    }
    const existingEmail = await this.collection().findOne({ email });
    if (existingEmail) {
      throw new GraphQLError("Email already exists", {
        extensions: { code: "BAD_REQUEST" },
      });
    }

    return this.collection().insertOne({
      name,
      username,
      email,
      password: hashedPassword(password),
    });
  }

  static async login(email, password) {
    const userCollection = this.collection();

    const user = await userCollection.findOne({ email });
    if (!user) {
      throw new GraphQLError("Invalid Email/Password", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    const verifyPassword = checkPassword(password, user.password);
    if (!verifyPassword) {
      throw new GraphQLError("Invalid Email/Password", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    const access_token = createToken({
      _id: user._id,
      email: user.email,
    });

    return { access_token, email };
  }
}

module.exports = User;
