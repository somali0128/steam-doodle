const { namespaceWrapper } = require('../_koiiNode/koiiNode');
const db = require('./db');
const { mainTask } = require('../task/steam_task');
const { submit } = require('../task/steam_submit');

class Submission {
  async task(round) {

    try {
      const cid = await mainTask(round);
      /**
       * 1. Store the cid in the database
       * 2. If the cid has same round that already present in the database, then return null
       *
       */
      await db.setSpecial(cid, round);
      console.log(`********** End Main TASK ${round} **********`);
      return cid;
    } catch (err) {
      console.log('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }

  }

  async submitTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      console.log('inside try');
      console.log(
        await namespaceWrapper.getSlot(),
        'current slot while calling submit',
      );
      const submission = await this.fetchSubmission(roundNumber);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );
      console.log('after the submission call');
      return submission;
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async fetchSubmission(round) {
    console.log(`********** Fetch Submission ${round} **********`);
    const submission = await submit(round);
    console.log(`********** End Fetch Submission ${round} **********`);
    return submission;
  }
}
const submission = new Submission();
module.exports = { submission };
