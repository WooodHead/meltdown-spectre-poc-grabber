const Git = require('nodegit');
const GitHubApi = require('github');
const uniqBy = require('lodash.uniqby');
const github = new GitHubApi();

const errorAndAttemptOpen = local => Git.Repository.open(local);

const promises = [
	github.search.repos({q: `meltdown`, sort: 'updated', per_page: 100}),
	github.search.repos({q: `spectre`, sort: 'updated', per_page: 100})
];

const meltdownRepos = [];
Promise.all(promises)
	.then(repos => {
		repos.forEach(data => {
			data.data.items.forEach(elem => {
				if (isRelated(elem)) {
					meltdownRepos.push(elem);
				}
			});
		});
		const uniqRepos = uniqBy(meltdownRepos, 'full_name');
		uniqRepos.forEach(elem => {
			Git.Clone(elem.clone_url, `repos/${elem.name}_${elem.owner.login}`)
				.then(() => {
					console.log(`Cloned: ${elem.name}_${elem.owner.login}`);
				})
				.catch(err => {
					if (err.errno === -4) {
						updateRepo(elem);
					} else {
						console.log(err);
					}
				});
		});
	})
	.catch(err => {
		console.log(err);
	});

function updateRepo(repoObj) {
	console.log(
		`Already cloned, updating: ${repoObj.name}_${repoObj.owner.login}`
	);
	errorAndAttemptOpen(`repos/${repoObj.name}_${repoObj.owner.login}`)
		.then(repo => {
			repo
				.fetchAll()
				.then(() => {
					repo
						.mergeBranches(
							'master',
							'origin/master'
						)
						.catch(err => {
							if (err.errno !== -3) {
								console.error(err);
								console.log(`repos/${repoObj.name}_${repoObj.owner.login} errored.`);
							}
						});
				})
				.catch(err => {
					console.error(err);
				});
		})
		.catch(err => {
			console.log(err);
		});
}

function isRelated(elem) {
	if (elem.description) {
		elem.description = `${elem.full_name} - ${elem.description}`;
	} else {
		elem.description = elem.full_name;
	}
	if (elem.description.toLowerCase().search(/cve/) >= 0) {
		return true;
	}
	if (elem.description.toLowerCase().search(/exploit/) >= 0) {
		return true;
	}
	if (elem.description.toLowerCase().search(/attack/) >= 0) {
		return true;
	}
	if (elem.description.toLowerCase().search(/poc/) >= 0) {
		return true;
	}
	if (elem.description.toLowerCase().search(/example/) >= 0) {
		return true;
	}
	if (elem.description.toLowerCase().search(/bug/) >= 0) {
		return true;
	}
}
