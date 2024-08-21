/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class PemetaanKebun {
    @Property()
    public idPemetaanKebun: string;
 
    @Property()
    public nikSurveyor: string;

    @Property()
    public namaSurveyor: string;

    @Property()
    public longitude: string;

    @Property()
    public latitude: string;
    
    @Property()
    public statusKawasan: string;

    @Property()
    public luasKebun: string;
    
    @Property()
    public nipVerifikator: string;

    @Property()
    public namaVerifikator: string;

    @Property()
    public statusVerifikator: string;

    @Property()
    public pesanVerifikator: string;

    @Property()
    public waktuPemetaanKebun: string;

    @Property()
    public waktuVerifikator: string;

    @Property()
    public waktuUpdatePemetaanKebun: string;

    @Property()
    public waktuUpdateVerifikator: string;


}

@Object()
export class PemetaanKebunResponse {
    @Property()
    public IdTransaksiBlockchain: string;

    @Property()
    public idPemetaanKebun: string;
 
    @Property()
    public nikSurveyor: string;

    @Property()
    public namaSurveyor: string;

    @Property()
    public longitude: string;

    @Property()
    public latitude: string;
    
    @Property()
    public statusKawasan: string;

    @Property()
    public luasKebun: string;
    
    @Property()
    public nipVerifikator: string;

    @Property()
    public namaVerifikator: string;

    @Property()
    public statusVerifikator: string;

    @Property()
    public pesanVerifikator: string;

    @Property()
    public waktuPemetaanKebun: string;

    @Property()
    public waktuVerifikator: string;

    @Property()
    public waktuUpdatePemetaanKebun: string;

    @Property()
    public waktuUpdateVerifikator: string;
}







