import { getData } from './exiftool/index.js';
import { saveData } from './database/index.js';

export default (path) => {
    getData(path)
        .then(data => saveData('fullData', data))
        .then(() => console.log('✅'))
        .catch(err => console.error(err));
};
