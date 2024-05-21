const asyncHandler = require('express-async-handler');
// checkID middleware

const checkControllerId = asyncHandler(async (req, res, next) => {
    const { controllerId } = req.body;
    if (!controllerId) {
        return next({ statusCode: 400, message: 'no controller id provided' });
    }
    const result = await req.prisma.controller.findUnique({
        where: {
            id: controllerId,
        },
    });
    if (!result) {
        return next({ statusCode: 404, message: 'controller not found' });
    }
    next();
});
module.exports = checkControllerId;
