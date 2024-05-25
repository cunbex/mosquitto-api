const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

// GET Controller list
exports.get_controller_list = asyncHandler(async (req, res, next) => {
    const allControllers = await req.prisma.controller.findMany();
    res.status(200).json({ success: true, status: 200, allControllers });
});

// GET Controller by id
exports.get_controller_by_id = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.controller.findUnique({
        where: {
            id: req.body.id,
        },
    });
    if (!result) {
        return next({ statusCode: 404, message: `Controller doesn't exists` });
    }
    res.status(201).json({
        success: true,
        status: 201,
        message: result,
    });
});

// POST Controller
exports.post_controller = asyncHandler(async (req, res, next) => {
    const deviceId = uuidv4();
    let payload = JSON.stringify({
        commands: [
            {
                command: 'createClient',
                username: deviceId,
                password: '0000',
                clientid: deviceId,
                textname: req.body.textname || '',
                textdescription: req.body.textdescription || '',
                roles: [{ rolename: 'lwt', priority: 0 }],
            },
        ],
    });
    req.client.publish(
        '$CONTROL/dynamic-security/v1',
        payload,
        req.publishOptions,
        (err) => {
            if (err) {
                return next(err);
            }
        },
    );
    payload = JSON.stringify({
        commands: [
            {
                command: 'enableClient',
                username: deviceId,
            },
        ],
    });
    req.client.publish(
        '$CONTROL/dynamic-security/v1',
        payload,
        req.publishOptions,
        (err) => {
            if (err) {
                return next(err);
            }
        },
    );
    payload = JSON.stringify({
        commands: [
            {
                command: 'createRole',
                rolename: deviceId,
                textname: req.body.textname || '',
                textdescription: req.body.textdescription || '',
                acls: [
                    {
                        acltype: 'publishClientSend',
                        topic: `${deviceId}/#`,
                        priority: 0,
                        allow: true,
                    },
                    {
                        acltype: 'publishClientReceive',
                        topic: `${deviceId}/#`,
                        priority: 0,
                        allow: true,
                    },
                    {
                        acltype: 'subscribePattern',
                        topic: `${deviceId}/#`,
                        priority: 0,
                        allow: true,
                    },
                    {
                        acltype: 'unsubscribePattern',
                        topic: `${deviceId}/#`,
                        priority: 0,
                        allow: true,
                    },
                ],
            },
        ],
    });
    req.client.publish(
        '$CONTROL/dynamic-security/v1',
        payload,
        req.publishOptions,
        (err) => {
            if (err) {
                return next(err);
            }
        },
    );
    payload = JSON.stringify({
        commands: [
            {
                command: 'addClientRole',
                username: deviceId,
                rolename: deviceId,
                priority: 0,
            },
        ],
    });
    req.client.publish(
        '$CONTROL/dynamic-security/v1',
        payload,
        req.publishOptions,
        (err) => {
            if (err) {
                return next(err);
            }
        },
    );
    await req.prisma.controller.create({
        data: {
            id: deviceId,
            active: req.body.active || false,
            topics: JSON.stringify(req.body.topics || []),
            password: req.body.password,
        },
    });
    res.status(201).json({
        success: true,
        status: 201,
        message: `Created Controller on DB, Controller & Controller Role on mqtt: ${deviceId}`,
    });
});

// PUT Controller Topic
exports.put_controller_topic = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.controller.findUnique({
        where: {
            id: req.body.id,
        },
    });
    if (!result) {
        return next({ statusCode: 404, message: `Controller doesn't exists` });
    }
    const updatedTopics = [...JSON.parse(result.topics), ...req.body.topics];
    console.log(updatedTopics);
    await req.prisma.controller.update({
        where: {
            id: req.body.id,
        },
        data: {
            topics: JSON.stringify(updatedTopics),
        },
    });
    res.status(200).json({
        success: true,
        status: 200,
        message: `Updated Topics "add", id: ${req.body.id}`,
    });
});
// PUT Controller userId
exports.put_controller_userId = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.controller.findUnique({
        where: {
            id: req.body.id,
        },
    });
    if (!result) {
        return next({ statusCode: 404, message: `Controller doesn't exists` });
    }
    let payload;
    if (req.body.state === 'add') {
        await req.prisma.controller.update({
            where: {
                id: req.body.id,
            },
            data: {
                userId: req.body.userId,
            },
        });
        payload = JSON.stringify({
            commands: [
                {
                    command: 'addClientRole',
                    username: req.body.userId,
                    rolename: req.body.id,
                    priority: 0,
                },
            ],
        });
    } else {
        await req.prisma.controller.update({
            where: {
                id: req.body.id,
            },
            data: {
                userId: null,
            },
        });
        payload = JSON.stringify({
            commands: [
                {
                    command: 'removeClientRole',
                    username: req.body.userId,
                    rolename: req.body.id,
                },
            ],
        });
    }

    req.client.publish(
        '$CONTROL/dynamic-security/v1',
        payload,
        req.publishOptions,
        (err) => {
            if (err) {
                next(err);
            }
        },
    );
    res.status(200).json({
        success: true,
        status: 200,
        message: `Updated userId & ${req.body.state} its controller role, id: ${req.body.id}`,
    });
});

// Delete Controller Topic
exports.delete_controller_topic = asyncHandler(async (req, res, next) => {
    const result = await req.prisma.controller.findUnique({
        where: {
            id: req.body.id,
        },
    });
    if (!result) {
        return next({ statusCode: 404, message: `Controller doesn't exists` });
    }
    const updatedTopics = JSON.parse(result.topics);
    const index = updatedTopics.findIndex(
        (item) => item === req.body.topics[0],
    );
    updatedTopics.splice(index, 1);
    await req.prisma.controller.update({
        where: {
            id: req.body.id,
        },
        data: {
            topics: JSON.stringify(updatedTopics),
        },
    });
    res.status(200).json({
        success: true,
        status: 200,
        message: `Updated Topics "delete", id: ${req.body.id}`,
    });
});

// DELETE Controller
exports.delete_controller = asyncHandler(async (req, res, next) => {
    await req.prisma.controller.delete({
        where: {
            id: req.body.id,
        },
    });
    let payload = JSON.stringify({
        commands: [
            {
                command: 'deleteRole',
                rolename: req.body.id,
            },
        ],
    });
    req.client.publish(
        '$CONTROL/dynamic-security/v1',
        payload,
        req.publishOptions,
        (err) => {
            if (err) {
                next(err);
            }
        },
    );
    payload = JSON.stringify({
        commands: [
            {
                command: 'deleteClient',
                username: req.body.id,
            },
        ],
    });
    req.client.publish(
        '$CONTROL/dynamic-security/v1',
        payload,
        req.publishOptions,
        (err) => {
            if (err) {
                next(err);
            }
        },
    );
    res.status(200).json({
        success: true,
        status: 200,
        message: `Deleted Controller on DB, Controller & Controller role on MQTT: ${req.body.id}`,
    });
});
