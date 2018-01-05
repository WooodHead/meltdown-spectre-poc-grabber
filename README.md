# meltdown-spectre-poc-grabber
Script I wrote in about 10 minutes to grab Meltdown/Spectre PoC's

PRs welcome

You can stick it in crontab like so:

```bash
*/5 * * * * (cd /root/meltdown-spectre-poc-grabber && /usr/bin/node ./index.js)
```
