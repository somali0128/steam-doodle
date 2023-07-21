const { namespaceWrapper } = require('../_koiiNode/koiiNode');
const { auditValue } = require('./special_audit');
class Audit {
  async validateNode(submission_value, round) {
    console.log(`********** Validate Node ${round} **********`);

    console.log('Received submission_value', submission_value, round);
    let vote;
    try {
      vote = await auditValue(submission_value);
    } catch (err) {
      console.log('ERROR IN VALIDATING NODE', err);
      vote = false;
    }

    console.log(`********** End Validate Node ${round} Vote ${vote} **********`);
    return vote;
  }

  async auditTask(roundNumber) {
    console.log('auditTask called with round', roundNumber);
    console.log(
      await namespaceWrapper.getSlot(),
      'current slot while calling auditTask',
    );
    await namespaceWrapper.validateAndVoteOnNodes(
      this.validateNode,
      roundNumber,
    );
  }
}
const audit = new Audit();
module.exports = { audit };
