import _ from 'lodash';

var list = [
	{ filename: 'A', groupId: 'g1', hash: undefined, originalName: 'A1' },
	{ filename: 'B', groupId: 'g2', hash: 'hash-1', originalName: 'B1' },
	{ filename: 'C', groupId: 'g1', hash: 'hash-1', originalName: 'C1' },
];

const ID_FIELD = 'filename';
const FIELDS = ['groupId', 'hash', 'originalName'];

console.log('List:', list);
console.log('---');

const map = {};

for (const item of list) {
	if (!map[item[ID_FIELD]]) { map[item[ID_FIELD]] = []; }
	for (const field of FIELDS) {
		if (item[field]) { map[item[ID_FIELD]].push(`${field}-${item[field]}`); }
	}
}

console.log('Map:', map);

const relations = [];

for (const item of Object.values(map)) {
	const index = relations.findIndex(relation => relation.some(rel => item.includes(rel)));
	if (index === -1) {
		relations.push(item);
	} else {
		relations[index].push(...item);
	}
}

console.log('Relations:', relations);

const groups = [];

for (const item of list) {
	for (const field of FIELDS) {
		if (item[field]) {
			const index = relations.findIndex(relation => relation.includes(`${field}-${item[field]}`));

			if (index == -1) {
				throw new Error('Can not found group!', { cause: { [field]: item[field] } });
			} else {
				groups[index] = (groups[index] || []).concat([ item[ID_FIELD] ]);
			}
		}
	}
}

console.log('Groups:', groups);

for (const groupIndex in groups) {
	const group = groups[groupIndex];
	const ids = _.uniq(group);

	groups[groupIndex] = ids.map(id => list.find(item => item[ID_FIELD] === id));
}

console.log(groups);























