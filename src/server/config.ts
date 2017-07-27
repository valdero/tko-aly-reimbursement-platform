const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

function optionalEnv(varName: string): string | undefined {
    return process.env[varName];
}

/*
function commaSeparatedEnv(varName: string): string[] {
    const value = optionalEnv(varName);

    if (value) {
        return value.split(',');
    } else {
        return [];
    }
}

function requiredEnv(varName: string): string {
    const value = optionalEnv(varName);
    if (value === undefined) {
        throw new Error(`${varName} environment variable not set`);
    } else {
        return value;
    }
}

/*
function prodRequiredEnv(varName: string): string | undefined {
    return isProd
        ? requiredEnv(varName)
        : optionalEnv(varName);
}
*/

export const config = {
    isProd,
    isDev,
    port: Number(optionalEnv('PORT')) || 3000,
    publicDir: './public',
    mailgun: {
        apiKey: optionalEnv('MAILGUN_API_KEY'),
        domain: optionalEnv('MAILGUN_DOMAIN'),
    },
    email: {
        worker: optionalEnv('WORKER_EMAIL'),
    },
};
