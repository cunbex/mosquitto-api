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
    await req.prisma.controller.create({
        data: {
            id: deviceId,
            active: req.body.active || false,
            topics:
                JSON.stringify(req.body.topics) ||
                JSON.stringify({ topics: [] }),
            password: req.body.password,
        },
    });
    res.status(201).json({
        success: true,
        status: 201,
        message: `Created Controller, id: ${deviceId}`,
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
    const updatedTopics = JSON.parse(result.topics);
    updatedTopics.topics.push(req.body.topic);
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
            id: req.body.controllerId,
        },
    });
    if (!result) {
        return next({ statusCode: 404, message: `Controller doesn't exists` });
    }
    await req.prisma.controller.update({
        where: {
            id: req.body.controllerId,
        },
        data: {
            userId: req.body.userId,
        },
    });
    res.status(200).json({
        success: true,
        status: 200,
        message: `Updated userId, id: ${req.body.controllerId}`,
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
    const index = updatedTopics.topics.findIndex(
        (item) => item === req.body.topic,
    );
    updatedTopics.topics.splice(index, 1);
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
    res.status(200).json({
        success: true,
        status: 200,
        message: `Deleted Controller, id: ${req.body.id}`,
    });
});
