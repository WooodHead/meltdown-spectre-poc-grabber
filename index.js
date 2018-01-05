const Git = require('nodegit');
const GitHubApi = require('github');

const github = new GitHubApi();
const filterNonUnique = arr =>
	arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i));
const errorAndAttemptOpen = local => Git.Repository.open(local);
const meltdownRepos = [];
github.search
	.repos({q: `meltdown`, sort: 'updated', per_page: 100})
	.then(repos => {
		repos.data.items.forEach(elem => {
			if (!elem.description) {
				elem.description = elem.full_name;
			} else {
				elem.description = `${elem.full_name} - ${elem.description}`;
			}
			if (elem.description.toLowerCase().search(/cve/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/exploit/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/attack/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/poc/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/example/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/bug/) >= 0) {
				meltdownRepos.push(elem);
			}
		});
		const uniqRepos = filterNonUnique(meltdownRepos);
		const promises = [];
		uniqRepos.forEach(elem => {
			Git.Clone(elem.clone_url, `repos/${elem.name}_${elem.owner.login}`)
				.then(repo => {
					console.log(`Cloned: ${elem.name}_${elem.owner.login}`);
				})
				.catch(err => {
					if (err.errno === -4) {
						console.log(`Already cloned, updating: ${elem.name}_${elem.owner.login}`);
						errorAndAttemptOpen(`repos/${elem.name}_${elem.owner.login}`)
						.then(repo => {
							repo.fetchAll().then(() => {
								repo.mergeBranches('master', 'origin/master')
									.catch(err => {
										if (err.errno !== -3) {
											console.error(err);
											console.log(`${elem.name}_${elem.owner.login}`);
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
					} else {
						console.log(err);
					}
				});
		});
	})
	.catch(err => {
		console.log(err);
	});
github.search
	.repos({q: `spectre`, sort: 'updated', per_page: 100})
	.then(repos => {
		repos.data.items.forEach(elem => {
			if (!elem.description) {
				elem.description = elem.full_name;
			} else {
				elem.description = `${elem.full_name} - ${elem.description}`;
			}
			if (elem.description.toLowerCase().search(/cve/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/exploit/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/attack/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/poc/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/example/) >= 0) {
				meltdownRepos.push(elem);
			}
			if (elem.description.toLowerCase().search(/bug/) >= 0) {
				meltdownRepos.push(elem);
			}
		});
		const uniqRepos = filterNonUnique(meltdownRepos);
		const promises = [];
		uniqRepos.forEach(elem => {
			Git.Clone(elem.clone_url, `repos/${elem.name}_${elem.owner.login}`)
				.then(repo => {
					console.log(`Cloned: ${elem.name}_${elem.owner.login}`);
				})
				.catch(err => {
					if (err.errno === -4) {
						console.log(`Already cloned, updating: ${elem.name}_${elem.owner.login}`);
						errorAndAttemptOpen(`repos/${elem.name}_${elem.owner.login}`)
						.then(repo => {
							repo.fetchAll().then(() => {
								repo.mergeBranches('master', 'origin/master')
									.catch(err => {
										console.error(err);
										console.log(`${elem.name}_${elem.owner.login}`);
									});
							  })
							  .catch(err => {
								  console.error(err);
							  });
						})
						.catch(err => {
							console.log(err);
						});
					} else {
						console.log(err);
					}
				});
		});
	})
	.catch(err => {
		console.log(err);
	});
