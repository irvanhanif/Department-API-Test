module.exports = {
  epochToDate: (epoch) => {
    const dateParse = new Date(Number(epoch) * 1000);
    return dateParse.toISOString().split("T")[0];
  },
};
