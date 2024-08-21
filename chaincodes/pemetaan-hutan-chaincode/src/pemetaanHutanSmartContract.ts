/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { PemetaanHutan, PemetaanHutanResponse } from './pemetaanHutan';
import { Iterators } from 'fabric-shim';
@Info({title: 'PemetaanHutanSmartContract', description: 'SmartContract for pemetaan Hutan'})
export class PemetaanHutanSmartContract extends Contract {
    
    // CreateAsset issues a new asset to the world state with given details.
    @Transaction()
    public async CreatePemetaanHutan(
      ctx: Context, 
      idHutan: string, 
      namaHutan: string, 
      longitude: string, 
      latitude: string,
      luasHutan: string,
      nipSurveyor: string,
      namaSurveyor: string,
      waktuPemetaanHutan: string,
      updateWaktuPemetaanHutan: string,
      ): Promise<any> {
        const exists = await this.AssetExists(ctx, idHutan);
        if (exists) {
            throw new Error(`Pemetaan hutan dengan id ${idHutan} sudah ada`);
        }

        const asset: PemetaanHutan = {
            idHutan: idHutan,
            namaHutan: namaHutan,
            longitude: longitude,
            latitude: latitude,
            luasHutan: luasHutan,
            nipSurveyor: nipSurveyor,
            namaSurveyor: namaSurveyor,
            waktuPemetaanHutan: waktuPemetaanHutan,
            updateWaktuPemetaanHutan: updateWaktuPemetaanHutan,
        };

        
        await ctx.stub.putState(idHutan, Buffer.from(stringify(sortKeysRecursive(asset))));
        const idTrx = ctx.stub.getTxID()
        return {"status":"success","idTrx":idTrx,"message":`Pemetaan Hutan Berhasil`}
    }

    
    @Transaction(false)
    public async ReadAsset(ctx: Context, idHutan: string): Promise<string> {
        const assetJSON = await ctx.stub.getState(idHutan); 
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${idHutan} does not exist`);
        }
        return assetJSON.toString();
    }


    // AssetExists returns true when asset with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async AssetExists(ctx: Context, idHutan: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(idHutan);
        return assetJSON && assetJSON.length > 0;
    }

    // GetAllAssets returns all assets found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllPemetaanHutan(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


    @Transaction()
    public async UpdatePemetaanHutan(
      ctx: Context, 
      idHutan: string, 
      namaHutan: string, 
      longitude: string, 
      latitude: string, 
      luasHutan: string,
      nipSurveyor: string,
      namaSurveyor: string,
      waktuPemetaanHutan: string,
      updateWaktuPemetaanHutan: string,
      ): Promise<any> {
        
      const exists = await this.AssetExists(ctx, idHutan);
        if (!exists) {
            throw new Error(`The asset ${idHutan} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset: PemetaanHutan = {
          idHutan: idHutan,
          namaHutan: namaHutan,
          longitude: longitude,
          latitude: latitude,
          luasHutan: luasHutan,
          nipSurveyor: nipSurveyor,
          namaSurveyor: namaSurveyor,
          waktuPemetaanHutan: waktuPemetaanHutan,
          updateWaktuPemetaanHutan: updateWaktuPemetaanHutan,
      };

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(idHutan, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
        const idTrx = ctx.stub.getTxID();
        return {"status":"success","idTrx":idTrx,"message":`Pemetaan Hutan Berhasil Di Perbarui`}
    }



        // DeleteAsset deletes an given asset from the world state.
        @Transaction()
        public async DeletePemetaanHutan(ctx: Context, idHutan: string): Promise<void> {
            const exists = await this.AssetExists(ctx, idHutan);
            if (!exists) {
                throw new Error(`Id hutan dengan id ${idHutan} tidak ditemukan`);
            }
            return ctx.stub.deleteState(idHutan);
        }

        @Transaction()
        public async GetHistoryById(ctx: Context, idPemetaanKebun: string): Promise<PemetaanHutanResponse[]> {
            const resultsIterator: Iterators.HistoryQueryIterator = await ctx.stub.getHistoryForKey(idPemetaanKebun);
            const pemetaanKebunResponses: PemetaanHutanResponse[] = [];
            while (true) {
                const response = await resultsIterator.next();
                if (response.value && response.value.value.toString()) {
                    const pemetaanHutan : PemetaanHutan = JSON.parse(response.value.value.toString());
    
                    const pemetaaanKebunResponse: PemetaanHutanResponse = {
                        IdTransaksiBlockchain: response.value.txId,
                        idHutan: pemetaanHutan.idHutan,
                        nipSurveyor: pemetaanHutan.nipSurveyor,
                        namaSurveyor: pemetaanHutan.namaSurveyor,
                        namaHutan: pemetaanHutan.namaHutan,
                        longitude: pemetaanHutan.longitude,
                        latitude: pemetaanHutan.latitude,
                        luasHutan: pemetaanHutan.luasHutan,
                        waktuPemetaanHutan: pemetaanHutan.waktuPemetaanHutan,
                        updateWaktuPemetaanHutan: pemetaanHutan.updateWaktuPemetaanHutan,
                    };
    
                    pemetaanKebunResponses.push(pemetaaanKebunResponse);
                }
    
                if (response.done) {
                    await resultsIterator.close();
                    break;
                }
            }
    
            return pemetaanKebunResponses;
        }
}