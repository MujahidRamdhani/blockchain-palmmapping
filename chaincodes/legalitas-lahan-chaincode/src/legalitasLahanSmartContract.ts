/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { dataKebun, dataKebunResponse, legalitasLahan, legalitasLahanResponse, legalitasLahanResponseBaru } from './legalitasLahan';
import { Iterators } from 'fabric-shim';
var moment = require('moment');

@Info({title: 'LegalitasLahanSmartContract', description: 'Smart contract for legalitas lahan'})
export class LegalitasLahanSmartContract extends Contract {
    
    @Transaction()
public async CreatePengajuan(
   ctx: Context,
   nomorSTDB: string, 
   nik: string, 
   nama: string,
   idDataKebun: string,
   nikKonfirmator: string,
   namaKonfirmator: string,
   alamatKebun: string,
   statusKepemilikanLahan: string,
   nomorSertifikat: string,
   jenisTanaman: string,
   produksiPerHaPertahun: string,
   jumlahPohon: string,
   asalBenih: string,
   polaTanam: string,
   jenisPupuk: string,
   mitraPengolahan: string,
   jenisTanah: string,
   tahunTanam: string,
   usahaLainDikebun: string,
   cidFotoKebun: string,
   cidFileLegalitasKebun: string,
   waktuPembuatan: string,
   waktuPengajuan: string,
): Promise<any> {
    // Check if LegalitasLahan asset already exists
    const legalitasExists = await this.AssetExists(ctx, nomorSTDB);
    if (legalitasExists) {
        throw new Error(`Aset LegalitasLahan dengan nomorSTDB ${nomorSTDB} sudah ada.`);
    }

    // Check if DataKebun asset already exists
    const kebunExists = await this.AssetExists(ctx, idDataKebun);
    if (kebunExists) {
        throw new Error(`Aset DataKebun dengan idDataKebun ${idDataKebun} sudah ada.`);
    }

    // Create LegalitasLahan asset
    const legalitasAsset: legalitasLahan = {
        nomorSTDB: nomorSTDB,
        nik: nik,
        nama: nama,
        idPemetaanKebun: 'Belum dipetakan',
        idDataKebun: idDataKebun,
        nikKonfirmator: nikKonfirmator,
        namaKonfirmator: namaKonfirmator,
        statusKonfirmator: 'Belum dikonfirmasi',
        nipPenerbitLegalitas: 'False',
        namaPenerbitLegalitas: 'False',
        statusPenerbitLegalitas: 'Belum diterbitkan',
        pesanKonfirmator: 'False',
        waktuPengajuan: waktuPengajuan,
        updateWaktuPengajuan: 'False',
        waktuKonfirmator: 'False',
        updateWaktuKonfirmator: 'False',
        waktuPenerbitLegalitas: 'False',
        updateWaktuPenerbitLegalitas: 'False',
    };

    // Create DataKebun asset
    const kebunAsset: dataKebun = {
        dataKebunId: idDataKebun,
        alamatKebun: alamatKebun,
        statusKepemilikanLahan: statusKepemilikanLahan,
        nomorSertifikat: nomorSertifikat,
        jenisTanaman: jenisTanaman,
        produksiPerHaPertahun: produksiPerHaPertahun,
        jumlahPohon: jumlahPohon,
        asalBenih: asalBenih,
        polaTanam: polaTanam,
        jenisPupuk: jenisPupuk,
        mitraPengolahan: mitraPengolahan,
        jenisTanah: jenisTanah,
        tahunTanam: tahunTanam,
        usahaLainDikebun: usahaLainDikebun,
        cidFotoKebun: cidFotoKebun,
        cidFileLegalitasKebun: cidFileLegalitasKebun,
        waktuPembuatan: waktuPembuatan,
        waktuUpdatePembuatan: 'False',
    };


    // Insert the LegalitasLahan asset into the ledger
    await ctx.stub.putState(nomorSTDB, Buffer.from(stringify(sortKeysRecursive(legalitasAsset))));
    
    // Insert the DataKebun asset into the ledger
    await ctx.stub.putState(idDataKebun, Buffer.from(stringify(sortKeysRecursive(kebunAsset))));

    const idTrx = ctx.stub.getTxID();
    return {
        "status": "success",
        "idTrx": idTrx,
        "message": "Pengajuan Legalitas Lahan berhasill"
    };
}


    // ReadAsset returns the asset stored in the world state with given id.
    @Transaction(false)
    public async ReadAsset(ctx: Context, nomorSTDB: string): Promise<string> {
        const assetJSON = await ctx.stub.getState(nomorSTDB); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`Nomor STDB dengan no: ${nomorSTDB} tidak ada`);
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
    public async GetAllLegalitasLahan(ctx: Context): Promise<string> {
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
    public async UpdateLegalitasKebun(
       ctx: Context,
       nomorSTDB: string, 
       nik: string,
       nama: string,
       idPemetaanKebun: string,
       idDataKebun: string,
       nikKonfirmator: string,
       namaKonfirmator: string,
       statusKonfirmator: string,
       pesanKonfirmator: string,
       nipPenerbitLegalitas: string,
       namaPenerbitLegalitas: string,
       statusPenerbitLegalitas: string,
       waktuPengajuan: string,
       updateWaktuPengajuan: string,
       waktuKonfirmator: string,
       updateWaktuKonfirmator: string,
       waktuPenerbitLegalitas: string,
       updateWaktuPenerbitLegalitas: string,
      ): Promise<any> {
        
      const exists = await this.AssetExists(ctx, nomorSTDB);
        if (!exists) {
            throw new Error(`Nomor STDB dengan no: ${nomorSTDB} tidak ditemukan`);
        }

        // overwriting original asset with new asset
        const updatedAsset: legalitasLahan = {
            nomorSTDB: nomorSTDB,
            nik: nik,
            nama: nama,
            idPemetaanKebun: idPemetaanKebun,
            idDataKebun: idDataKebun,
            nikKonfirmator: nikKonfirmator,
            namaKonfirmator: namaKonfirmator,
            statusKonfirmator: statusKonfirmator,
            nipPenerbitLegalitas: nipPenerbitLegalitas,
            namaPenerbitLegalitas: namaPenerbitLegalitas,
            statusPenerbitLegalitas: statusPenerbitLegalitas,
            pesanKonfirmator: pesanKonfirmator,
            waktuPengajuan: waktuPengajuan,
            updateWaktuPengajuan: updateWaktuPengajuan,
            waktuKonfirmator: waktuKonfirmator,
            updateWaktuKonfirmator: updateWaktuKonfirmator,
            waktuPenerbitLegalitas: waktuPenerbitLegalitas,
            updateWaktuPenerbitLegalitas: updateWaktuPenerbitLegalitas,
      };

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(nomorSTDB, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
        const idTrx = ctx.stub.getTxID();
        return {"status":"success","idTrx":idTrx,"message":`konfirmasi Pengajuan Legalitas Lahan Berhasil`}
    }

    @Transaction()
    public async UpdateLegalitasdanKebun(
        ctx: Context,
        nomorSTDB: string, 
        idDataKebun: string,
        nikKonfirmator: string,
        namaKonfirmator: string,
        nik: string,
        nama: string,
        alamatKebun: string,
        statusKepemilikanLahan: string,
        nomorSertifikat: string,
        jenisTanaman: string,
        produksiPerHaPertahun: string,
        jumlahPohon: string,
        asalBenih: string,
        polaTanam: string,
        jenisPupuk: string,
        mitraPengolahan: string,
        jenisTanah: string,
        tahunTanam: string,
        usahaLainDikebun: string,
        cidFotoKebun: string,
        cidFileLegalitasKebun: string,
        waktuPengajuan: string,
        updateWaktuPengajuan: string,
        waktuPembuatan: string,
        waktuUpdatePembuatan: string,
    ): Promise<any> {
        // Check if LegalitasLahan asset exists
        const legalitasExists = await this.AssetExists(ctx, nomorSTDB);
        if (!legalitasExists) {
            throw new Error(`Aset LegalitasLahan dengan nomor STDB ${nomorSTDB} tidak ditemukan.`);
        }
    
        // Check if DataKebun asset exists
        const kebunExists = await this.AssetExists(ctx, idDataKebun);
        if (!kebunExists) {
            throw new Error(`Aset DataKebun dengan ID ${idDataKebun} tidak ditemukan.`);
        }
    
        // Update LegalitasLahan asset
        const updatedLegalitasLahan: legalitasLahan = {
            nomorSTDB: nomorSTDB,
            nik: nik,
            nama: nama,
            idPemetaanKebun: 'Belum dipetakan',
            idDataKebun: idDataKebun,
            nikKonfirmator: nikKonfirmator,
            namaKonfirmator: namaKonfirmator,
            statusKonfirmator: 'Belum dikonfirmasi',
            nipPenerbitLegalitas: 'False',
            namaPenerbitLegalitas: 'False',
            statusPenerbitLegalitas: 'Belum diterbitkan',
            pesanKonfirmator: 'False',
            waktuPengajuan: waktuPengajuan,
            updateWaktuPengajuan: updateWaktuPengajuan,
            waktuKonfirmator: 'False',
            updateWaktuKonfirmator: 'False',
            waktuPenerbitLegalitas: 'False',
            updateWaktuPenerbitLegalitas: 'False',
        };
    
        // Update DataKebun asset
        const updatedDataKebun: dataKebun = {
            dataKebunId: idDataKebun,
            alamatKebun: alamatKebun,
            statusKepemilikanLahan: statusKepemilikanLahan,
            nomorSertifikat: nomorSertifikat,
            jenisTanaman: jenisTanaman,
            produksiPerHaPertahun: produksiPerHaPertahun,
            jumlahPohon: jumlahPohon,
            asalBenih: asalBenih,
            polaTanam: polaTanam,
            jenisPupuk: jenisPupuk,
            mitraPengolahan: mitraPengolahan,
            jenisTanah: jenisTanah,
            tahunTanam: tahunTanam,
            usahaLainDikebun: usahaLainDikebun,
            cidFotoKebun: cidFotoKebun,
            cidFileLegalitasKebun: cidFileLegalitasKebun,
            waktuPembuatan: waktuPembuatan,
            waktuUpdatePembuatan: waktuUpdatePembuatan,
        };
    
        // Insert updated assets into the ledger
        try {
            await ctx.stub.putState(nomorSTDB, Buffer.from(stringify(sortKeysRecursive(updatedLegalitasLahan))));
            await ctx.stub.putState(idDataKebun, Buffer.from(stringify(sortKeysRecursive(updatedDataKebun))));
        } catch (error) {
            throw new Error(`Gagal memperbarui data: ${error.message}`);
        }
    
        const idTrx = ctx.stub.getTxID();
        return {
            status: "success",
            idTrx: idTrx,
            message: "Pembaruan Legalitas Lahan dan Data Kebun berhasil."
        };
    }
    

    @Transaction()
    public async UpdateDataKebun(
       ctx: Context,
       idDataKebun: string,  
       alamatKebun: string,
         statusKepemilikanLahan: string,
         nomorSertifikat: string,
         jenisTanaman: string,
         produksiPerHaPertahun: string,
         jumlahPohon: string,
         asalBenih: string,
         polaTanam: string,
         jenisPupuk: string,
         mitraPengolahan: string,
         jenisTanah: string,
         tahunTanam: string,
         usahaLainDikebun: string,
         cidFotoKebun: string,
         cidFileLegalitasKebun: string,
         waktuPembuatan: string,
         waktuUpdatePembuatan: string,
      ): Promise<any> {
        
      const exists = await this.AssetExists(ctx, idDataKebun);
        if (!exists) {
            throw new Error(`Nomor STDB dengan no: ${idDataKebun} tidak ditemukan`);
        }

        // overwriting original asset with new asset
        const updatedAsset: dataKebun = {
            dataKebunId: idDataKebun,
            alamatKebun: alamatKebun,
            statusKepemilikanLahan: statusKepemilikanLahan,
            nomorSertifikat: nomorSertifikat,
            jenisTanaman: jenisTanaman,
            produksiPerHaPertahun: produksiPerHaPertahun,
            jumlahPohon: jumlahPohon,
            asalBenih: asalBenih,
            polaTanam: polaTanam,
            jenisPupuk: jenisPupuk,
            mitraPengolahan: mitraPengolahan,
            jenisTanah: jenisTanah,
            tahunTanam: tahunTanam,
            usahaLainDikebun: usahaLainDikebun,
            cidFotoKebun: cidFotoKebun,
            cidFileLegalitasKebun: cidFileLegalitasKebun,
            waktuPembuatan: waktuPembuatan,
            waktuUpdatePembuatan: waktuUpdatePembuatan,
      };

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(idDataKebun, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
        const idTrx = ctx.stub.getTxID();
        return {"status":"success","idTrx":idTrx,"message":`konfirmasi Pengajuan Legalitas Lahan Berhasil`}
    }

    @Transaction()
    public async confirmLegalitasKebun(
       ctx: Context,
       nomorSTDB: string, 
       nikKonfirmator: string,
       namaKonfirmator: string,
       statusKonfirmator: string,
       pesanKonfirmator: string,
       waktuKonfirmator: string,
       updateWaktuKonfirmator: string,
      ): Promise<any> {
        
      const exists = await this.AssetExists(ctx, nomorSTDB);
        if (!exists) {
            throw new Error(`Nomor STDB dengan no: ${nomorSTDB} tidak ditemukan`);
        }
        const assetBuffer = await ctx.stub.getState(nomorSTDB);
        const asset = JSON.parse(assetBuffer.toString());

        asset.nikKonfirmator = nikKonfirmator;
        asset.namaKonfirmator = namaKonfirmator;
        asset.statusKonfirmator = statusKonfirmator;
        asset.pesanKonfirmator = pesanKonfirmator;
        asset.waktuKonfirmator =  waktuKonfirmator;
        asset.updateWaktuKonfirmator =  updateWaktuKonfirmator;

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(nomorSTDB, Buffer.from(stringify(sortKeysRecursive(asset))));
        const idTrx = ctx.stub.getTxID();
        return {"status":"success","idTrx":idTrx,"message":`konfirmasi Pengajuan Legalitas Lahan Berhasil`}
    }

    @Transaction()
    public async AddPemetaanKebun(
       ctx: Context,
       nomorSTDB: string, 
       idPemetaanKebun: string,
      ): Promise<any> {
        
      const exists = await this.AssetExists(ctx, nomorSTDB);
        if (!exists) {
            throw new Error(`Nomor STDB dengan no: ${nomorSTDB} tidak ditemukan`);
        }
        const assetBuffer = await ctx.stub.getState(nomorSTDB);
        const asset = JSON.parse(assetBuffer.toString());
        asset.idPemetaanKebun = idPemetaanKebun;

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(nomorSTDB, Buffer.from(stringify(sortKeysRecursive(asset))));
        const idTrx = ctx.stub.getTxID();
        return {"status":"success","idTrx":idTrx,"message":`kebun berhasil ditambah pada legalitas lahan`}
    }

     @Transaction()
     public async publishLegalitasLahan(
        ctx: Context,
        nomorSTDB: string, 
        nipPenerbitLegalitas: string,
        namaPenerbitLegalitas: string,
        statusPenerbitLegalitas: string,
        waktuPenerbitLegalitas: string,
        updateWaktuPenerbitLegalitas: string,
       ): Promise<any> {
         
       const exists = await this.AssetExists(ctx, nomorSTDB);
         if (!exists) {
             throw new Error(`Nomor STDB dengan no: ${nomorSTDB} tidak ditemukan`);
         }
         const assetBuffer = await ctx.stub.getState(nomorSTDB);
         const asset = JSON.parse(assetBuffer.toString());
 
         asset.nipPenerbitLegalitas = nipPenerbitLegalitas;
         asset.namaPenerbitLegalitas = namaPenerbitLegalitas;
         asset.statusPenerbitLegalitas = statusPenerbitLegalitas;
         asset.waktuPenerbitLegalitas =  waktuPenerbitLegalitas;
         asset.updateWaktuPenerbitLegalitas =  updateWaktuPenerbitLegalitas;
 
         // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
         await ctx.stub.putState(nomorSTDB, Buffer.from(stringify(sortKeysRecursive(asset))));
         const idTrx = ctx.stub.getTxID();
         return {"status":"success","idTrx":idTrx,"message":`konfirmasi Pengajuan Legalitas Lahan Berhasil`}
     }

     @Transaction()
     public async UpdateStatusPenerbitan(
        ctx: Context,
        nomorSTDB: string, 
       ): Promise<any> {
         
       const exists = await this.AssetExists(ctx, nomorSTDB);
         if (!exists) {
             throw new Error(`Nomor STDB dengan no: ${nomorSTDB} tidak ditemukan`);
         }
         const assetBuffer = await ctx.stub.getState(nomorSTDB);
         const asset = JSON.parse(assetBuffer.toString());
 
         asset.nipPenerbitLegalitas = 'False';
         asset.namaPenerbitLegalitas = 'False';
         asset.statusPenerbitLegalitas = 'Belum Diterbitkan';
         asset.waktuPenerbitLegalitas =  'False';
         asset.updateWaktuPenerbitLegalitas =  'False';
 
         // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
         await ctx.stub.putState(nomorSTDB, Buffer.from(stringify(sortKeysRecursive(asset))));
         const idTrx = ctx.stub.getTxID();
         return {"status":"success","idTrx":idTrx,"message":`Update Status Penerbitan Berhasil`}
     }

     @Transaction()
     public async UpdateStatusConfirm(
        ctx: Context,
        nomorSTDB: string,
        nikKonfirmator: string,
        namaKonfirmator: string,
        statusKonfirmator: string,
        pesanKonfirmator: string,
        updateWaktuKonfirmator: string
       ): Promise<any> {
         
       const exists = await this.AssetExists(ctx, nomorSTDB);
         if (!exists) {
             throw new Error(`Nomor STDB dengan no: ${nomorSTDB} tidak ditemukan`);
         }
         const assetBuffer = await ctx.stub.getState(nomorSTDB);
         const asset = JSON.parse(assetBuffer.toString());
         asset.nikKonfirmator = nikKonfirmator;
         asset.namaKonfirmator = namaKonfirmator;
         asset.statusKonfirmator = statusKonfirmator;
         asset.pesanKonfirmator = pesanKonfirmator;
         asset.updateWaktuKonfirmator =  updateWaktuKonfirmator;
         asset.idPemetaanKebun = 'Belum dipetakan'
         asset.nipPenerbitLegalitas = 'False';
         asset.namaPenerbitLegalitas = 'False';
         asset.statusPenerbitLegalitas = 'Belum diterbitkan';
         asset.waktuPenerbitLegalitas =  'False';
         asset.updateWaktuPenerbitLegalitas =  'False';
 
         // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
         await ctx.stub.putState(nomorSTDB, Buffer.from(stringify(sortKeysRecursive(asset))));
         const idTrx = ctx.stub.getTxID();
         return {"status":"success","idTrx":idTrx,"message":`Update Status Konfirmasi Berhasil`}
     }


        // DeleteAsset deletes an given asset from the world state.
        @Transaction()
      public async DeleteLegalitasLahan(ctx: Context, nomorSTDB: string): Promise<void> {
            const exists = await this.AssetExists(ctx, nomorSTDB);
            if (!exists) {
                throw new Error(`Nomor STDB dengan no: ${nomorSTDB} tidak ditemukan`);
            }
            return ctx.stub.deleteState(nomorSTDB);
      }

      @Transaction()
      public async GetHistoryById(ctx: Context, idPemetaanKebun: string): Promise<legalitasLahanResponse[]> {
          const resultsIterator: Iterators.HistoryQueryIterator = await ctx.stub.getHistoryForKey(idPemetaanKebun);
  
          const legalitasLahanResponses: legalitasLahanResponse[] = [];
          while (true) {
              const response = await resultsIterator.next();
              if (response.value && response.value.value.toString()) {
                  const legalitasLahan : legalitasLahan = JSON.parse(response.value.value.toString());
  
                  const legalitasLahanResponse: legalitasLahanResponse = {
                      IdTransaksiBlockchain: response.value.txId,
                      nomorSTDB: legalitasLahan.nomorSTDB,
                      nik: legalitasLahan.nik,
                      nama: legalitasLahan.nama,
                      idPemetaanKebun: legalitasLahan.idPemetaanKebun,
                      idDataKebun: legalitasLahan.idDataKebun,
                      nikKonfirmator: legalitasLahan.nikKonfirmator,
                      namaKonfirmator: legalitasLahan.namaKonfirmator,
                      statusKonfirmator: legalitasLahan.statusKonfirmator,
                      pesanKonfirmator: legalitasLahan.pesanKonfirmator,
                      nipPenerbitLegalitas: legalitasLahan.nipPenerbitLegalitas,
                      namaPenerbitLegalitas: legalitasLahan.namaPenerbitLegalitas,
                      statusPenerbitLegalitas: legalitasLahan.statusPenerbitLegalitas,
                      waktuPengajuan: legalitasLahan.waktuPengajuan,
                      updateWaktuPengajuan: legalitasLahan.updateWaktuPengajuan,
                      waktuKonfirmator: legalitasLahan.waktuKonfirmator,
                      updateWaktuKonfirmator: legalitasLahan.updateWaktuKonfirmator,
                      waktuPenerbitLegalitas: legalitasLahan.waktuPenerbitLegalitas,
                      updateWaktuPenerbitLegalitas: legalitasLahan.updateWaktuPenerbitLegalitas,
                  };
  
                  legalitasLahanResponses.push(legalitasLahanResponse);
              }
  
              if (response.done) {
                  await resultsIterator.close();
                  break;
              }
          }
  
          return legalitasLahanResponses;
      }


      @Transaction()
      public async GetHistoryDataKebunById(ctx: Context, dataKebunId: string): Promise<dataKebunResponse[]> {
          const resultsIterator: Iterators.HistoryQueryIterator = await ctx.stub.getHistoryForKey(dataKebunId);
  
          const dataKebunResponses: dataKebunResponse[] = [];
          while (true) {
              const response = await resultsIterator.next();
              if (response.value && response.value.value.toString()) {
                  const dataKebun : dataKebun = JSON.parse(response.value.value.toString());
  
                  const dataKebunResponse: dataKebunResponse = {
                      IdTransaksiBlockchain: response.value.txId,
                      dataKebunId: dataKebun.dataKebunId,
                      alamatKebun: dataKebun.alamatKebun,
                      statusKepemilikanLahan: dataKebun.statusKepemilikanLahan,
                      nomorSertifikat: dataKebun.nomorSertifikat,
                      jenisTanaman: dataKebun.jenisTanaman,
                      produksiPerHaPertahun: dataKebun.produksiPerHaPertahun,
                      jumlahPohon: dataKebun.jumlahPohon,
                      asalBenih: dataKebun.asalBenih,
                      polaTanam: dataKebun.polaTanam,
                      jenisPupuk: dataKebun.jenisPupuk,
                      mitraPengolahan: dataKebun.mitraPengolahan,
                      jenisTanah: dataKebun.jenisTanah,
                      tahunTanam: dataKebun.tahunTanam,
                      usahaLainDikebun: dataKebun.usahaLainDikebun,
                      cidFotoKebun: dataKebun.cidFotoKebun,
                      cidFileLegalitasKebun: dataKebun.cidFileLegalitasKebun,
                      waktuPembuatan: dataKebun.waktuPembuatan,
                      waktuUpdatePembuatan: dataKebun.waktuUpdatePembuatan                
                  };
  
                  dataKebunResponses.push(dataKebunResponse);
              }
  
              if (response.done) {
                  await resultsIterator.close();
                  break;
              }
          }
  
          return dataKebunResponses;
      }

      @Transaction()
      public async GetHistoryLegalitasLahanById(ctx: Context, nomorSTDB: string): Promise<legalitasLahanResponseBaru[]> {
        const resultsIterator: Iterators.HistoryQueryIterator = await ctx.stub.getHistoryForKey(nomorSTDB);

        const legalitasLahanResponseBarus: legalitasLahanResponseBaru[] = [];
        while (true) {
            const response = await resultsIterator.next();
            if (response.value && response.value.value.toString()) {
                const legalitasLahan : legalitasLahan = JSON.parse(response.value.value.toString());

                const legalitasLahanResponseBaru: legalitasLahanResponseBaru = {
                    IdTransaksiBlockchain: response.value.txId,
                    nomorSTDB: legalitasLahan.nomorSTDB,
                    nik: legalitasLahan.nik,
                    nama: legalitasLahan.nama,
                    idPemetaanKebun: legalitasLahan.idPemetaanKebun,
                    idDataKebun: legalitasLahan.idDataKebun,
                    nikKonfirmator: legalitasLahan.nikKonfirmator,
                    namaKonfirmator: legalitasLahan.namaKonfirmator,
                    statusKonfirmator: legalitasLahan.statusKonfirmator,
                    pesanKonfirmator: legalitasLahan.pesanKonfirmator,
                    nipPenerbitLegalitas: legalitasLahan.nipPenerbitLegalitas,
                    namaPenerbitLegalitas: legalitasLahan.namaPenerbitLegalitas,
                    statusPenerbitLegalitas: legalitasLahan.statusPenerbitLegalitas,
                    waktuPengajuan: legalitasLahan.waktuPengajuan,
                    updateWaktuPengajuan: legalitasLahan.updateWaktuPengajuan,
                    waktuKonfirmator: legalitasLahan.waktuKonfirmator,
                    updateWaktuKonfirmator: legalitasLahan.updateWaktuKonfirmator,
                    waktuPenerbitLegalitas: legalitasLahan.waktuPenerbitLegalitas,
                    updateWaktuPenerbitLegalitas: legalitasLahan.updateWaktuPenerbitLegalitas,
                };

                legalitasLahanResponseBarus.push(legalitasLahanResponseBaru);
            }

            if (response.done) {
                await resultsIterator.close();
                break;
            }
        }

        return legalitasLahanResponseBarus;
     }

      

    @Transaction()
    public async GetAllDataKebunBydataKebunId(ctx: Context): Promise<string> {
        const queryString = {
            selector: {
                dataKebunId: { "$exists": true }
            }
        };
    
        const allResults = [];
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
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
    public async GetAllLegalitasLahanByNomorSTDB(ctx: Context): Promise<string> {
      const queryString = {
          selector: {
              nomorSTDB: { "$exists": true }
          }
      };
  
      const allResults = [];
      const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
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



@Transaction(false)
public async FindOneDataKebun(ctx: Context, dataKebunId: string): Promise<string> {
    // Cek apakah aset DataKebun dengan dataKebunId tersebut ada
    const dataKebunAsBytes = await ctx.stub.getState(dataKebunId); 
    if (!dataKebunAsBytes || dataKebunAsBytes.length === 0) {
        throw new Error(`Aset DataKebun dengan dataKebunId ${dataKebunId} tidak ditemukan.`);
    }

    // Kembalikan data kebun dalam bentuk string
    return dataKebunAsBytes.toString();
}




@Transaction(false)
public async FindOneByNomorSTDB(
    ctx: Context,
    nomorSTDB: string
): Promise<any> {
    // Query for LegalitasLahan by nomorSTDB
    const legalitasAsBytes = await ctx.stub.getState(nomorSTDB);
    if (!legalitasAsBytes || legalitasAsBytes.length === 0) {
        throw new Error(`Legalitas Lahan dengan nomorSTDB ${nomorSTDB} tidak ditemukan.`);
    }
    const legalitasAsset: legalitasLahan = JSON.parse(legalitasAsBytes.toString());

    // Retrieve the corresponding DataKebun by idDataKebun from LegalitasLahan
    const idDataKebun = legalitasAsset.idDataKebun;
    const kebunAsBytes = await ctx.stub.getState(idDataKebun);
    if (!kebunAsBytes || kebunAsBytes.length === 0) {
        throw new Error(`Data Kebun dengan ID ${idDataKebun} tidak ditemukan.`);
    }
    const kebunAsset: dataKebun = JSON.parse(kebunAsBytes.toString());

    // Combine the LegalitasLahan and DataKebun into a single response
    const combinedResult = {
        legalitasLahan: legalitasAsset,
        dataKebun: kebunAsset,
    };

    return combinedResult;
}

@Transaction(false)
public async GetAllPengajuan(ctx: Context): Promise<string> {
    const allResults = [];
    
    // Get all keys in the ledger
    const iterator = await ctx.stub.getStateByRange('', '');

    let result = await iterator.next();
    while (!result.done) {
        const assetString = Buffer.from(result.value.value.toString()).toString('utf8');
        const asset = JSON.parse(assetString);

        // Check if asset is a dataKebun
        if (asset.hasOwnProperty('alamatKebun')) {
            const idDataKebun = asset.dataKebunId;

            // Fetch corresponding legalitasLahan asset
            const legalitasBuffer = await ctx.stub.getState(idDataKebun); // Assuming nomorSTDB is stored using idDataKebun
            if (legalitasBuffer && legalitasBuffer.length > 0) {
                const legalitasAsset = JSON.parse(legalitasBuffer.toString());

                // Merge legalitasLahan and dataKebun data
                const combinedAsset = {
                    ...legalitasAsset,
                    ...asset,  // Merging dataKebun into legalitasLahan
                    dataKebunId: idDataKebun,
                };

                allResults.push(combinedAsset);
            }
        } else {
            // If it's not a dataKebun, just push it as is
            allResults.push(asset);
        }

        result = await iterator.next();
    }
    await iterator.close();

    return JSON.stringify(allResults);
}

public async GetAllLegalitasLahanBaru(ctx: Context): Promise<string> {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange('', '');
    let result = await iterator.next();

    try {
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
    } finally {
        await iterator.close();
    }

    // Pisahkan aset berdasarkan jenisnya
    const legalitasAssets = allResults.filter(asset => asset.nomorSTDB);
    const kebunAssets = allResults.filter(asset => asset.dataKebunId);

    // Gabungkan data berdasarkan idDataKebun
    const mergedAssets = legalitasAssets.map(legalitas => {
        const relatedKebun = kebunAssets.find(kebun => kebun.dataKebunId === legalitas.idDataKebun);
        return relatedKebun ? { ...legalitas, ...relatedKebun } : legalitas;
    });

    // Kembalikan data dalam bentuk string JSON
    return JSON.stringify(mergedAssets);
}

}