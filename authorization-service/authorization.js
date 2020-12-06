require('dotenv').config();

const createPolicy = (creds, resource, effect) => {
    return {
        principalId: creds,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
}

module.exports.authorize = async (event, ctx, callback) => {
    console.log(`Event: ${JSON.stringify(event)}`);
    if (event['type'] != 'TOKEN') {
        callback('Unauthorized');
    }

    try {
        const authToken = event.authorizationToken;
        console.log(`authToken: ${authToken}`);
        const creds = authToken.split(' ')[1];
        const plainCreds = Buffer.from(creds,'base64')
            .toString('utf-8')
            .split(':');
        const user = plainCreds[0];
        const password = plainCreds[1];

        if (!user && !password) {
            callback('Unauthorized');
        }

        let effect;
        const storedPassword = process.env[user];
        if (storedPassword && storedPassword == password) {
            effect = 'Allow';
        } else {
            effect = 'Deny';
        }
        const resource = event.methodArn;
        callback(null,createPolicy(creds, resource, effect));
    } catch (err) {
        callback('Unauthrized');
    }
}