module.exports = (num) => {
  return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
}