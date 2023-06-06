const express = require('express');

const fileService = require('./file.service');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = 3003;

app.get('/users', async (req, res) => {
    const users = await fileService.reader();
    res.json(users);
});

app.post('/users', async (req, res) => {
    const users = await fileService.reader();

    if (!req.body.name || req.body.name.length < 3) {
        return res.status(400).json('Name is wrong');
    }
    if (req.body.age < 16 || req.body.age > 130 || !req.body.name) {
        return res.status(400).json('Age is wrong');
    }
    if (typeof (req.body.status) !== 'boolean') {
        return res.status(400).json('Status is wrong');
    }

    const newUser = {id: users.length ? users[users.length - 1].id + 1 : 1, ...req.body};
    users.push(newUser);

    await fileService.writer(users);

    res.status(201).json(newUser);
});

app.get('/users/:userId', async (req, res) => {
    const {userId} = req.params;

    const users = await fileService.reader();
    const userById = users.find(user => user.id === +userId);

    if (!userById) {
        return res.status(422).json(`User with id: ${userId} not found`);
    }

    res.json(userById);
});

app.patch('/users/:userId', async (req, res) => {
    const {userId} = req.params;
    const updateUser = req.body;

    const users = await fileService.reader();
    const userById = users.find(user => user.id === +userId);

    if (!userById) {
        return res.status(422).json(`User with id: ${userId} not found`);
    }
    if (updateUser.name && updateUser.name.length < 3) {
        return res.status(400).json('Name is wrong');
    }
    if (updateUser.age && updateUser.age < 16 || updateUser.age > 130) {
        return res.status(400).json('Age is wrong');
    }
    if (updateUser.status && typeof (updateUser.status) !== 'boolean') {
        return res.status(400).json('Status is wrong');
    }

    if (updateUser.name) userById.name = updateUser.name;
    if (updateUser.age) userById.age = updateUser.age;
    if (updateUser.status) userById.status = updateUser.status;

    await fileService.writer(users);
    res.status(201).json(updateUser);
});

app.delete('/users/:userId', async (req, res) => {
    const {userId} = req.params;

    const users = await fileService.reader();
    const index = users.findIndex(user => user.id === +userId);

    if (index === -1) {
        return res.status(422).json(`User not found`);
    }

    users.splice(index, 1);
    await fileService.writer(users);
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Started on port: ${PORT} ⚡`);
});
