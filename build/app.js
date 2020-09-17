"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/.env' });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var mongoose_models_1 = require("./models/mongoose-models");
var app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
mongoose_1.default.connect(process.env.DB_URL ? process.env.DB_URL : '');
app.post('/api/user', function (req, res) {
    var user = req.body.data;
    if (user.password === user.confirmPassword) {
        delete user['confirmPassword'];
        bcrypt_1.default.hash(user.password, Number(process.env.SALT_ROUNDS)).then(function (hashedPass) {
            user.password = hashedPass;
            var newUser = new mongoose_models_1.UserModel(user);
            newUser.save(function (err, registeredUser) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                }
                else {
                    res.status(200).json(registeredUser);
                }
            });
        }).catch(function (err) {
            console.log(err);
            res.status(500).json(err);
        });
    }
    else {
        res.status(500).json();
    }
});
app.post('/api/user/login', function (req, res) {
    var user = req.body.data;
    if (user.email && user.password) {
        mongoose_models_1.UserModel.findOne({ email: user.email }, function (err, foundUser) {
            if (err) {
                res.status(500).json(err);
            }
            if (foundUser) {
                bcrypt_1.default.compare(user.password, foundUser.password.toString()).then(function (matched) {
                    if (matched) {
                        res.status(200).json('success');
                    }
                    else {
                        res.status(200).json('Authentication Failed');
                    }
                }).catch(function (err) {
                    res.status(500).json(err);
                });
            }
            else {
                res.sendStatus(404).json('USER NOT FOUND');
            }
        });
    }
    else {
        res.status(500).json();
    }
});
app.listen(3000, function () {
    console.log('Server running');
});
