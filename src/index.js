const tool = require('./exiftool');

module.exports = (path) => {
    tool.getData(path)
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });
};
