require('dotenv').config();
const dataFromCid = require('./helpers/dataFromCid');
const {namespaceWrapper} = require('./namespaceWrapper');

const audit = async (submission) => {
    const outputraw = await dataFromCid(submission);
    if (!outputraw) {
        console.log('VOTE FALSE');
        console.log('SLASH VOTE DUE TO FAKE VALUE');
        return false;
    }
    const output = outputraw.data;
    console.log('OUTPUT', output);
    const { steam_doodle, nodePublicKey, signature } = output;
    const voteResp = await namespaceWrapper.verifySignature(signature, nodePublicKey);
    const cleanVoteRespData = voteResp.data.replace(/"/g, '');
    if (!voteResp || cleanVoteRespData !== steam_doodle) {
        console.log('VOTE FALSE');
        console.log('SLASH VOTE DUE TO DATA MISMATCH');
        return false;
    }
    const steam_doodle_resp = await dataFromCid(steam_doodle);
    if (!steam_doodle_resp) {
        console.log('VOTE FALSE');
        console.log('SLASH VOTE DUE TO FAKE STEAM DOODLE');
        return false;
    }
    // Check if the steam doodle is valid
    // If format of steam_doodle_resp.data is image, return true
    // Else return false
    if (!typeof steam_doodle_resp.data === 'image') {
        console.log('VOTE FALSE');
        console.log('SLASH VOTE DUE TO FAKE STEAM DOODLE');
        return false;
    }
    console.log('VOTE TRUE');
    return true;
};

module.exports = {
    audit,
};