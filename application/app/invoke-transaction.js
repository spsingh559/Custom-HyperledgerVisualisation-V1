/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var path = require('path');
var fs = require('fs');
var util = require('util');
var hfc = require('fabric-client');
var Peer = require('fabric-client/lib/Peer.js');
var helper = require('./helper.js');
var logger = helper.getLogger('invoke-chaincode');
var EventHub = require('fabric-client/lib/EventHub.js');
var ORGS = hfc.getConfigSetting('network-config');

var invokeChaincode = function(peerNames, channelName, chaincodeName, fcn, args, username, org,app) {
	logger.debug(util.format('\n============ invoke transaction on organization %s ============\n', org));
	var socket=app.get('mySocket');
	socket.emit('txInit','txinitiated');
	console.log('-------------------------Socket');
	var obj={
		peerNames:peerNames,
		channelName:channelName,
		chaincodeName:chaincodeName,
		org:org
	}

	console.log(JSON.stringify(obj));
	
// mySocket.emit('getapi', 'getapi');
	
	socket.emit('basicInfo',JSON.stringify(obj));
	socket.emit('txInits','txinitiated');
	// console.log('after socket');
	var client = helper.getClientForOrg(org);
	var channel = helper.getChannelForOrg(org);
	var targets = (peerNames) ? helper.newPeers(peerNames, org) : undefined;
	// console.log(' -------------------targets--------------------',targets);

	var tx_id = null;

	return helper.getRegisteredUsers(username, org).then((user) => {
		// console.log('--------------------------user----------------------', user);
		tx_id = client.newTransactionID();
		logger.debug(util.format('Sending transaction "%j"', tx_id));
		// send proposal to endorser
		var request = {
			chaincodeId: chaincodeName,
			fcn: fcn,
			args: args,
			chainId: channelName,
			txId: tx_id
		};

		// console.log('-----------------------------request-------------------', request)

		if (targets)
			request.targets = targets;
		socket.emit('sendTxProposal',JSON.stringify(request));
		// console.log('----------------------------tx proposal-----------------------',channel.sendTransactionProposal(request));
		return channel.sendTransactionProposal(request);
	}, (err) => {
		socket.emit('enrollUserDecline', 'Failed to enroll user');
		logger.error('Failed to enroll user \'' + username + '\'. ' + err);
		throw new Error('Failed to enroll user \'' + username + '\'. ' + err);
	}).then((results) => {
		socket.emit('proposalResponse', 'proposalResponse');
		var proposalResponses = results[0];
		var proposal = results[1]; 
		console.log('--------------------------------proposalResponses-----------------------', results[0]);
		console.log('--------------------------------proposal-----------------------', results[1]);
		var all_good = true;
		for (var i in proposalResponses) {
			let one_good = false;
			if (proposalResponses && proposalResponses[i].response &&
				proposalResponses[i].response.status === 200) {
				one_good = true;
				logger.info('transaction proposal was good');
			} else {
				logger.error('transaction proposal was bad');
			}
			all_good = all_good & one_good;
		}
		if (all_good) {
			socket.emit('proposalGood','Transaction proposal was good' );
			// socket.emit('proposalStatus',JSON.stringify(proposalResponses[0].response.status) );
			// socket.emit('proposalmessage',JSON.stringify(proposalResponses[0].response.message ));
			// socket.emit('proposalMetadata',JSON.stringify(proposalResponses[0].response.payload ));
			// socket.emit('proposalMetadata',JSON.stringify(proposalResponses[0].response.payload ));
			// socket.emit('proposalEndorsement',JSON.stringify(proposalResponses[0].endorsement
			// .signature ));
			

			logger.debug(util.format(
				'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
				proposalResponses[0].response.status, proposalResponses[0].response.message,
				proposalResponses[0].response.payload, proposalResponses[0].endorsement
				.signature));
			var request = {
				proposalResponses: proposalResponses,
				proposal: proposal
			};
			// set the transaction listener and set a timeout of 30sec
			// if the transaction did not get committed within the timeout period,
			// fail the test
			var transactionID = tx_id.getTransactionID();
			var eventPromises = [];

			if (!peerNames) {
				peerNames = channel.getPeers().map(function(peer) {
					return peer.getName();
				});
			}

			var eventhubs = helper.newEventHubs(peerNames, org);
			for (let key in eventhubs) {
				let eh = eventhubs[key];
				eh.connect();

				let txPromise = new Promise((resolve, reject) => {
					let handle = setTimeout(() => {
						eh.disconnect();
						reject();
					}, 30000);

					eh.registerTxEvent(transactionID, (tx, code) => {
						clearTimeout(handle);
						eh.unregisterTxEvent(transactionID);
						eh.disconnect();

						if (code !== 'VALID') {
							// socket.emit('CommitmentStatus','transaction is invalid');
							logger.error(
								'The SSLNG transaction was invalid, code = ' + code);
							reject();
						} else {
							// socket.emit('CommitmentStatus','transaction has been committed on peer'+ eh._ep._endpoint.addr);
							logger.info(
								'The SSLNG transaction has been committed on peer ' +
								eh._ep._endpoint.addr);
							resolve();
						}
					});
				});

				console.log('------------------------------txPromise--------------', txPromise);
				eventPromises.push(txPromise);
			};
			var sendPromise = channel.sendTransaction(request);
			console.log('----------------------request for orderer---------------', request);
			console.log('-----------------------------------sendPromise------------------', sendPromise);
			socket.emit('preparingRequestToOrderer',' Request Contain Data in Byte Buffer');
			return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
				console.log('-------------------------------results------------------', results);
				logger.debug(' event promise all complete and testing complete');
				return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
			}).catch((err) => {
				logger.error(
					'Failed to send transaction and get notifications within the timeout period.'
				);
				return 'Failed to send transaction and get notifications within the timeout period.';
			});
		} else {
			logger.error(
				'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
			);
			return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
		}
	}, (err) => {
		logger.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
			err);
		return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
			err;
	}).then((response) => {
		// console.log('-------------------response of ordere--------------------', response);
		if (response.status === 'SUCCESS') {
			socket.emit('ordererStatus','Successfully sent transaction to the orderer' );
			socket.emit('ordererCommited','Block has been created' );
			socket.emit('peerCommited','Ledger has been updated on all peers' );
			socket.emit('txid',JSON.stringify(tx_id.getTransactionID()) );
			logger.info('Successfully sent transaction to the orderer.');
			return tx_id.getTransactionID();
		} else {
			// socket.emit('finalStatus','Failed to order the transaction');
			logger.error('Failed to order the transaction. Error code: ' + response.status);
			return 'Failed to order the transaction. Error code: ' + response.status;
		}
	}, (err) => {
		// socket.emit('finalStatus','Failed to send the transaction');
		logger.error('Failed to send transaction due to error: ' + err.stack ? err
			.stack : err);
		return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
			err;
	});
};

exports.invokeChaincode = invokeChaincode;
