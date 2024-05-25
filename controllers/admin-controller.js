const asyncHandler = require('express-async-handler');

/* -----------------------------------------------------------------------------------------------------------*/
/* ------------------------------------------------- Clients ---------------------------------------------------*/
/* -----------------------------------------------------------------------------------------------------------*/

// GET all Clients.
exports.get_client_list = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'listClients',
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Got Clients List, ${payload}`,
                });
            }
        },
    );
});

// GET Client by name
exports.get_client_by_name = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'getClient',
                username: req.body.username,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Got client, ${payload}`,
                });
            }
        },
    );
});

// POST Client
exports.post_client = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'createClient',
                username: req.body.username,
                password: req.body.password,
                clientid: req.body.clientid || '',
                textname: req.body.textname || '',
                textdescription: req.body.textdescription || '',
                groups: req.body.groups || [] /* [
                    { "groupname": "group", "priority": 1 }
                ] */,
                roles: req.body.roles || [] /* [
                    { "rolename": "role", "priority": -1 }
                ] */,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Added Client, ${payload}`,
                });
            }
        },
    );
});

// POST Client enable
exports.post_enable_client = asyncHandler(async (req, res, next) => {
    let payload;
    if (req.body.enable === true) {
        payload = JSON.stringify({
            commands: [
                {
                    command: 'enableClient',
                    username: req.body.username,
                },
            ],
        });
    } else if (req.body.enable === false) {
        payload = JSON.stringify({
            commands: [
                {
                    command: 'disableClient',
                    username: req.body.username,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Enabled/Disabled Client, ${payload}`,
                });
            }
        },
    );
});

// POST Client role
exports.post_client_role = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'addClientRole',
                username: req.body.username,
                rolename: req.body.rolename,
                priority: req.body.priority || -1,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Added Role to client, ${payload}`,
                });
            }
        },
    );
});

// POST Client group
exports.post_client_group = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'addGroupClient',
                username: req.body.username,
                groupname: req.body.groupname,
                priority: req.body.priority || -1,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Added Client to group, ${payload}`,
                });
            }
        },
    );
});

// PUT client ID
exports.put_clientId = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'setClientId',
                username: req.body.username,
                clientid:
                    req.body.clientId || '' /* Client ID will be removed */,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Updated ClientId, ${payload}`,
                });
            }
        },
    );
});

// PUT Client password
exports.put_client_password = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'setClientPassword',
                username: req.body.username,
                password: req.body.password,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Updated password, ${payload}`,
                });
            }
        },
    );
});

// PUT Client
exports.put_client = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'modifyClient',
                username: req.body.username,
                password: req.body.password || '',
                clientid:
                    req.body.clientid || '' /* Client ID will be removed */,
                textname: req.body.textname || '',
                textdescription: req.body.textdescription || '',
                groups: req.body.groups || [] /* [
                    { "groupname": "group", "priority": 1 }
                ] */,
                roles: req.body.roles || [] /* [
                    { "rolename": "role", "priority": 1 }
                ] */,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Updated Client, ${payload}`,
                });
            }
        },
    );
});

// Delete Client role
exports.delete_client_role = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'removeClientRole',
                username: req.body.username,
                rolename: req.body.rolename,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Deleted Client role, ${payload}`,
                });
            }
        },
    );
});

// Delete Client group
exports.delete_client_group = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'removeGroupClient',
                groupname: req.body.groupname,
                username: req.body.username,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Deleted Client group, ${payload}`,
                });
            }
        },
    );
});

// DELETE Client
exports.delete_client = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'deleteClient',
                username: req.body.username,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Deleted Client, ${payload}`,
                });
            }
        },
    );
});

/* -----------------------------------------------------------------------------------------------------------*/
/* ------------------------------------------------- Groups ---------------------------------------------------*/
/* -----------------------------------------------------------------------------------------------------------*/

// GET all Groups.
exports.get_group_list = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'listGroups',
                verbose: false,
                count: -1,
                offset: 0,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Got Groups list, ${payload}`,
                });
            }
        },
    );
});

// GET Group by name
exports.get_group_by_name = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'getGroup',
                groupname: req.body.groupname,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Got Group, ${payload}`,
                });
            }
        },
    );
});

// POST group
exports.post_group = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'createGroup',
                groupname: req.body.groupname,
                roles:
                    req.body.roles ||
                    [] /* [{ rolename: 'role', priority: -1 }] */,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Added Group, ${payload}`,
                });
            }
        },
    );
});

// POST Group role
exports.post_group_role = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'addGroupRole',
                groupname: req.body.groupname,
                rolename: req.body.rolename,
                priority: req.body.priority || -1,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Added Role to group, ${payload}`,
                });
            }
        },
    );
});

// PUT Group
exports.put_group = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'modifyGroup',
                groupname: req.body.groupname,
                textname: req.body.textname || '',
                textdescription: req.body.textdescription || '',
                roles:
                    req.body.groups ||
                    [] /* [{ rolename: 'role', priority: -1 }] */,
                clients:
                    req.body.groups ||
                    [] /* [{ username: 'client', priority: -1 }] */,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Updated Group, ${payload}`,
                });
            }
        },
    );
});

// Delete Group role
exports.delete_group_role = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'removeGroupRole',
                groupname: req.body.groupname,
                rolename: req.body.rolename,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Deleted Group role, ${payload}`,
                });
            }
        },
    );
});

// DELETE Group
exports.delete_group = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'deleteGroup',
                groupname: req.body.groupname,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Deleted Group, ${payload}`,
                });
            }
        },
    );
});

/* -----------------------------------------------------------------------------------------------------------*/
/* ------------------------------------------------- ROLES ---------------------------------------------------*/
/* -----------------------------------------------------------------------------------------------------------*/

// GET all Roles.
exports.get_role_list = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'listRoles',
                verbose: false,
                count: -1,
                offset: 0,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Got Role list, ${payload}`,
                });
            }
        },
    );
});

// GET role by name
exports.get_role_by_name = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'getRole',
                rolename: req.body.rolename,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Got Role by name, ${payload}`,
                });
            }
        },
    );
});

// POST role
exports.post_role = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'createRole',
                rolename: req.body.rolename,
                textname: req.body.textname || '',
                textdescription: req.body.textdescription || '',
                acls: req.body.acls || [] /* [
                    {
                        acltype: 'subscribePattern',
                        topic: 'topic/#',
                        priority: -1,
                        allow: true,
                    },
                ], */,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Added Role, ${payload}`,
                });
            }
        },
    );
});

// POST Role acl
exports.post_acl_role = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'addRoleACL',
                rolename: req.body.rolename,
                acltype: req.body.acltype || '' /* 'subscribePattern' */,
                topic: req.body.topic || '',
                priority: req.body.priority || -1,
                allow: req.body.allow || true,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Added Role Acl, ${payload}`,
                });
            }
        },
    );
});

// PUT Role
exports.put_role = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'modifyRole',
                rolename: req.body.rolename,
                textname: req.body.textname || '',
                textdescription: req.body.textdescription || '',
                acls: req.body.acls || [] /* [
                        { "acltype": "subscribePattern", "topic": "topic/#", "priority": -1, "allow": true }
                    ] */,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Updated Role, ${payload}`,
                });
            }
        },
    );
});

// DELETE Role
exports.delete_role = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'deleteRole',
                rolename: req.body.rolename,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Deleted Role, ${payload}`,
                });
            }
        },
    );
});

// Delete Role acl
exports.delete_role_acl = asyncHandler(async (req, res, next) => {
    const payload = JSON.stringify({
        commands: [
            {
                command: 'removeRoleACL',
                rolename: req.body.rolename,
                acltype: req.body.acltype /* "subscribePattern" */,
                topic: req.body.topic /* "topic/#" */,
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
            } else {
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: `Deleted Role acl, ${payload}`,
                });
            }
        },
    );
});
