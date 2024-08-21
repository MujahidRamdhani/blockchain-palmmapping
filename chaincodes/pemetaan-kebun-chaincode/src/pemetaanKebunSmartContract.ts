/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { PemetaanKebun, PemetaanKebunResponse } from './pemetaanKebun';
import { Iterators } from 'fabric-shim';


@Info({title: 'pemetaan Kebun', description: 'Smart contract for Pemetaan Kebun'})
export class PemetaanKebunSmartContract extends Contract {
    
    
    @Transaction()
    public async CreatePemetaanKebun(
      ctx: Context, 
      idPemetaanKebun: string, 
      nikSurveyor: string, 
      namaSurveyor: string, 
      longitude: string, 
      latitude: string, 
      statusKawasan:string,
      luasKebun: string,
      waktuPemetaanKebun: string,
      ): Promise<any> {
        const exists = await this.AssetExists(ctx, idPemetaanKebun);
        if (exists) {
            throw new Error(`Asset Dengan ID ${idPemetaanKebun} Sudah Ada.`);
        }

        const asset: PemetaanKebun = {
            idPemetaanKebun: idPemetaanKebun,
            nikSurveyor: nikSurveyor,
            namaSurveyor: namaSurveyor,
            longitude: longitude,
            latitude: latitude,
            statusKawasan: statusKawasan,
            luasKebun: luasKebun,
            nipVerifikator: 'False',
            namaVerifikator: 'False',
            statusVerifikator: 'Belum diverifikasi',
            pesanVerifikator: 'False',
            waktuPemetaanKebun: waktuPemetaanKebun,
            waktuVerifikator: 'False',
            waktuUpdatePemetaanKebun: 'False',
            waktuUpdateVerifikator: 'False'
        };

        
        await ctx.stub.putState(idPemetaanKebun, Buffer.from(stringify(sortKeysRecursive(asset))));
        const idTrx = ctx.stub.getTxID()
        return {"status":"success","idTrx":idTrx,"message":`Pemetaan Kebun berhasil`}
    }

    // ReadAsset returns the asset stored in the world state with given id.
    @Transaction(false)
    public async ReadAsset(ctx: Context, idPemetaanKebun: string): Promise<string> {
        const assetJSON = await ctx.stub.getState(idPemetaanKebun); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`Asset Dengan ID ${idPemetaanKebun} Tidak Ditemukan.`);
        }
        return assetJSON.toString();
    }


    // AssetExists returns true when asset with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async AssetExists(ctx: Context, idPemetaanKebun: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(idPemetaanKebun);
        return assetJSON && assetJSON.length > 0;
    }

    // GetAllAssets returns all assets found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllPemetaanKebun(ctx: Context): Promise<string> {
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
    public async VerifyPemetaanKebun(ctx: Context, idPemetaanKebun: string, nipVerifikator: string, namaVerifikator: string, statusVerifikator: string, pesanVerifikator: string, waktuVerifikator: string, waktuUpdateVerifikator: string): Promise<any> {
        
      const exists = await this.AssetExists(ctx, idPemetaanKebun);
        if (!exists) {
            throw new Error(`Id Pemetaan Kebun Dengan id : ${idPemetaanKebun} tidak ditemukan`);
        }

        const assetBuffer = await ctx.stub.getState(idPemetaanKebun);
        const asset = JSON.parse(assetBuffer.toString());

        asset.nipVerifikator = nipVerifikator;
        asset.namaVerifikator = namaVerifikator;
        asset.statusVerifikator = statusVerifikator;
        asset.pesanVerifikator = pesanVerifikator;
        asset.waktuVerifikator =  waktuVerifikator;
        asset.waktuUpdateVerifikator =  waktuUpdateVerifikator;

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(idPemetaanKebun, Buffer.from(stringify(sortKeysRecursive(asset))));
        const idTrx = ctx.stub.getTxID();
        return {"status":"success","idTrx":idTrx,"message":`Pemetaan Kebun Berhasil Di verifikasi`}
    }

    public async UpdateStatusVerifyPemetaanKebun(ctx: Context, idPemetaanKebun: string, nipVerifikator: string, namaVerifikator: string, statusVerifikator: string, pesanVerifikator: string, waktuVerifikator: string, waktuUpdateVerifikator: string): Promise<any> {
        
        const exists = await this.AssetExists(ctx, idPemetaanKebun);
          if (!exists) {
              throw new Error(`Id Pemetaan Kebun Dengan id : ${idPemetaanKebun} tidak ditemukan`);
          }
  
          const assetBuffer = await ctx.stub.getState(idPemetaanKebun);
          const asset = JSON.parse(assetBuffer.toString());
  
          asset.nipVerifikator = nipVerifikator;
          asset.namaVerifikator = namaVerifikator;
          asset.statusVerifikator = statusVerifikator;
          asset.pesanVerifikator = pesanVerifikator;
          asset.waktuUpdateVerifikator =  waktuUpdateVerifikator;
  
          // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
          await ctx.stub.putState(idPemetaanKebun, Buffer.from(stringify(sortKeysRecursive(asset))));
          const idTrx = ctx.stub.getTxID();
          return {"status":"success","idTrx":idTrx,"message":`Pemetaan Kebun Berhasil Di verifikasi`}
      }


    @Transaction()
    public async UpdatePemetaanKebun(
      ctx: Context, 
      idPemetaanKebun: string, 
      nikSurveyor: string, 
      namaSurveyor: string, 
      longitude: string, 
      latitude: string, 
      statusKawasan:string,
      luasKebun: string,
      nipVerifikator: string,
      namaVerifikator: string,
      statusVerifikator: string,
      pesanVerifikator: string,
      waktuPemetaanKebun: string,
      waktuVerifikator: string,
      waktuUpdatePemetaanKebun: string,
      waktuUpdateVerifikator: string,
      ): Promise<any> {
        
      const exists = await this.AssetExists(ctx, idPemetaanKebun);
        if (!exists) {
            throw new Error(`Id Pemetaan Kebun Dengan id : ${idPemetaanKebun} tidak ditemukan`);
        }

        // overwriting original asset with new asset
        const updatedAsset: PemetaanKebun = {
          idPemetaanKebun: idPemetaanKebun,
          nikSurveyor: nikSurveyor,
          namaSurveyor: namaSurveyor,
          longitude: longitude,
          latitude: latitude,
          statusKawasan: statusKawasan,
          luasKebun: luasKebun,
          nipVerifikator: nipVerifikator,
          namaVerifikator: namaVerifikator,
          statusVerifikator: statusVerifikator,
          pesanVerifikator: pesanVerifikator,
          waktuPemetaanKebun: waktuPemetaanKebun,
          waktuVerifikator: waktuVerifikator,
          waktuUpdatePemetaanKebun: waktuUpdatePemetaanKebun,
          waktuUpdateVerifikator: waktuUpdateVerifikator,
      };

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(idPemetaanKebun, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
        const idTrx = ctx.stub.getTxID();
        return {"status":"success","idTrx":idTrx,"message":`Pemetaan Kebun Berhasil Di Perbarui`}
    }

    @Transaction()
    public async Update(
      ctx: Context, 
      idPemetaanKebun: string, 
      nikSurveyor: string, 
      namaSurveyor: string, 
      longitude: string, 
      latitude: string, 
      statusKawasan:string,
      luasKebun: string,
      nipVerifikator: string,
      namaVerifikator: string,
      statusVerifikator: string,
      pesanVerifikator: string,
      waktuPemetaanKebun: string,
      waktuVerifikator: string,
      waktuUpdatePemetaanKebun: string,
      waktuUpdateVerifikator: string,
      ): Promise<any> {
        
      const exists = await this.AssetExists(ctx, idPemetaanKebun);
        if (!exists) {
            throw new Error(`The asset ${idPemetaanKebun} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset: PemetaanKebun = {
            idPemetaanKebun: idPemetaanKebun,
            nikSurveyor: nikSurveyor,
            namaSurveyor: namaSurveyor,
            longitude: longitude,
            latitude: latitude,
            statusKawasan: statusKawasan,
            luasKebun: luasKebun,
            nipVerifikator: nipVerifikator,
            namaVerifikator: namaVerifikator,
            statusVerifikator: statusVerifikator,
            pesanVerifikator: pesanVerifikator,
            waktuPemetaanKebun: waktuPemetaanKebun,
            waktuVerifikator: waktuVerifikator,
            waktuUpdatePemetaanKebun: waktuUpdatePemetaanKebun,
            waktuUpdateVerifikator: waktuUpdateVerifikator,
        };

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(idPemetaanKebun, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
        const idTrx = ctx.stub.getTxID();
        return {"status":"success","idTrx":idTrx,"message":`Pemetaan Hutan Berhasil Di Perbarui`}
    }
   

        // DeleteAsset deletes an given asset from the world state.
        @Transaction()
        public async DeletePemetaanKebun(ctx: Context, idPemetaanKebun: string): Promise<void> {
            const exists = await this.AssetExists(ctx, idPemetaanKebun);
            if (!exists) {
                throw new Error(`Id Pemetaan Kebun Dengan id : ${idPemetaanKebun} tidak ditemukan`);
            }
            return ctx.stub.deleteState(idPemetaanKebun);
        }
        
        @Transaction()
        public async GetHistoryById(ctx: Context, idPemetaanKebun: string): Promise<PemetaanKebunResponse[]> {
            const resultsIterator: Iterators.HistoryQueryIterator = await ctx.stub.getHistoryForKey(idPemetaanKebun);
    
            const pemetaanKebunResponses: PemetaanKebunResponse[] = [];
            while (true) {
                const response = await resultsIterator.next();
                if (response.value && response.value.value.toString()) {
                    const pemetaanKebun : PemetaanKebun = JSON.parse(response.value.value.toString());
    
                    const pemetaaanKebunResponse: PemetaanKebunResponse = {
                        IdTransaksiBlockchain: response.value.txId,
                        idPemetaanKebun: pemetaanKebun.idPemetaanKebun,
                        nikSurveyor: pemetaanKebun.nikSurveyor,
                        namaSurveyor: pemetaanKebun.namaSurveyor,
                        longitude: pemetaanKebun.longitude,
                        latitude: pemetaanKebun.latitude,
                        statusKawasan: pemetaanKebun.statusKawasan,
                        luasKebun: pemetaanKebun.luasKebun,
                        nipVerifikator: pemetaanKebun.nipVerifikator,
                        namaVerifikator: pemetaanKebun.namaVerifikator,
                        statusVerifikator: pemetaanKebun.statusVerifikator,
                        pesanVerifikator: pemetaanKebun.pesanVerifikator,
                        waktuPemetaanKebun: pemetaanKebun.waktuPemetaanKebun,
                        waktuVerifikator: pemetaanKebun.waktuVerifikator,
                        waktuUpdatePemetaanKebun: pemetaanKebun.waktuUpdatePemetaanKebun,
                        waktuUpdateVerifikator: pemetaanKebun.waktuUpdateVerifikator,
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