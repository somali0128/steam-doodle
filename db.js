const { namespaceWrapper } = require('./namespaceWrapper');

const setDoodle = async (cid, round) => {
  const db = await namespaceWrapper.getDb();
  try {
    let existingData = await db.findOne({ cid });
    if (!existingData) {
      const date = new Date().toISOString().slice(0, 10);
      await db.insert({ date, cid, round });
      console.log('new steam doodle set');
      return true;
    } else {
      console.log('steam doodle already set');
      return false;
    }
  } catch (err) {
    return undefined;
  }
};

const getDoodle = async (round) => {
  const db = await namespaceWrapper.getDb();
  try {
    const resp = await db.findOne({ round });

    if (resp) {
        console.log('steam doodle get', resp);
      return resp.cid;
    } else{
        console.log('steam doodle not found');
        return null;
    }
  } catch (err) {
    return undefined;
  }
};

const getDoodleList = async () => {
  const db = await namespaceWrapper.getDb();
  try {
    const resp = await db.find({});
    return resp;
  } catch (err) {
    return undefined;
  }
};

module.exports = {
  setDoodle,
  getDoodle,
  getDoodleList,
};
