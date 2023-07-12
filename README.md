# Koii Task - Steam Doodle

This task scrape steam doodle and submit the doodle to IPFS and the cid of the doodle is submitted to K2.
## Requirements

- [Node >=16.0.0](https://nodejs.org)

## What's in the task?

- `doodle_task.js` - This is the main task file. It contains the code for scraping the doodle and submitting it to IPFS and K2.
- `db.js` - This file contains the code for connecting to the database.
- It also include GET endpoint `/getDoodleList` to get the list of doodles submitted to K2.

## How to run the task?

- Download desktop node from [here](https://www.koii.network/node?promo=F973BD738033). 
- Run the steam doodle task from the desktop node.

## How to run the task locally?

To run and test this task locally:
- Clone this repository.
- Run `yarn install` to install all the dependencies.
- Run `yarn test` to start the task.

## What's the reward distribution rule?

Bounty will be distributed to people who submit the doodle to IPFS and the cid of the doodle is submitted to K2. The bounty per round is 1 KOII.

## How to submit the doodle to IPFS?

When you run the task, desktop node will ask you insert your web3.storage key. Check the tutorial [here](https://blog.koii.network/Introduce-web3-storage/)

