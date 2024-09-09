import tmi from 'tmi.js';

const createClient = (channels) => {
    const client = new tmi.Client({
        channels: channels,
    });

    client.connect();

    return client;
};

export default createClient;
