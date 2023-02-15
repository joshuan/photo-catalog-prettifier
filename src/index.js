import { getData } from './exiftool/index.js';

export default (path) => {
    getData(path)
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });
};
