'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        for (let i = 0; i < this.roundArguments.assets; i++) {
            const idPemetaanKebun = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Creating asset ${idPemetaanKebun}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'CreatePemetaanKebun',
                invokerIdentity: 'User1',
                contractArguments: [idPemetaanKebun, 'blue', '20', 'penguin', '500', '123123', '123123', '123123'],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }
    async submitTransaction() {
        const randomId = Math.floor(Math.random() * this.roundArguments.assets);
        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'ReadAsset',
            invokerIdentity: 'User1',
            contractArguments: [`${this.workerIndex}_${randomId}`],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(myArgs);
    }

    async cleanupWorkloadModule() {
        for (let i = 0; i < this.roundArguments.assets; i++) {
            const idPemetaanKebun = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Deleting asset ${idPemetaanKebun}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'DeletePemetaanKebun',
                invokerIdentity: 'User1',
                contractArguments: [idPemetaanKebun],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;