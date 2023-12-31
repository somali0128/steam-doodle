const { namespaceWrapper } = require('../_koiiNode/koiiNode');

const setSpecial = async (cid, round) => {
  const db = await namespaceWrapper.getDb();
  try {
    let existingRound = await db.findOne({ round });
    // console.log('existingRound', existingRound);
    if (!existingRound) {
      const date = new Date().toISOString().slice(0, 10);
      await db.insert({ date, cid, round });
      console.log(`new steam special set in round ${round}`);
      return true;
    } else {
      console.log(`steam special already exist in round ${round}`);
      return false;
    }
  } catch (err) {
    return undefined;
  }
};

const getSpecial = async (round) => {
  const db = await namespaceWrapper.getDb();
  try {
    const resp = await db.findOne({ round });

    if (resp) {
        console.log('steam special get', resp);
      return resp.cid;
    } else{
        console.log('steam special not found');
        return null;
    }
  } catch (err) {
    return undefined;
  }
};

const getSpecialList = async () => {
  const db = await namespaceWrapper.getDb();
  try {
    const resp = await db.find({});
    return resp;
  } catch (err) {
    return undefined;
  }
};

module.exports = {
  setSpecial,
  getSpecial,
  getSpecialList,
};
